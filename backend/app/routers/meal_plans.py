import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, selectinload

from app.auth import get_current_user
from app.database import get_db
from app.models import MealPlan, MealPlanEntry, Recipe, User
from app.schemas import MealPlanCreate, MealPlanEntryCreate, MealPlanEntryRead, MealPlanRead, MealPlanUpdate

router = APIRouter(prefix="/meal-plans", tags=["meal-plans"])


def _load_plan(db: Session, plan_id: uuid.UUID, user: User) -> MealPlan:
    plan = db.get(MealPlan, plan_id, options=[selectinload(MealPlan.entries)])
    if plan is None or plan.owner_id != user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Meal plan not found")
    return plan


def _to_read(plan: MealPlan) -> MealPlanRead:
    entries = [
        MealPlanEntryRead(
            id=e.id,
            recipe_id=e.recipe_id,
            recipe_title=e.recipe.title if e.recipe else "",
            recipe_hero_image=e.recipe.hero_image if e.recipe else None,
            day=e.day,
            slot=e.slot,
        )
        for e in plan.entries
    ]
    return MealPlanRead(id=plan.id, week_start=plan.week_start, entries=entries)


@router.get("/", response_model=list[MealPlanRead])
def list_plans(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    plans = (
        db.query(MealPlan)
        .filter(MealPlan.owner_id == user.id)
        .options(selectinload(MealPlan.entries).selectinload(MealPlanEntry.recipe))
        .order_by(MealPlan.week_start.desc())
        .all()
    )
    return [_to_read(p) for p in plans]


@router.post("/", response_model=MealPlanRead, status_code=status.HTTP_201_CREATED)
def create_plan(body: MealPlanCreate, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    existing = db.query(MealPlan).filter(MealPlan.owner_id == user.id, MealPlan.week_start == body.week_start).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="A plan already exists for this week")
    plan = MealPlan(owner_id=user.id, week_start=body.week_start)
    for e in body.entries:
        _require_recipe(db, e.recipe_id, user)
        plan.entries.append(MealPlanEntry(recipe_id=e.recipe_id, day=e.day, slot=e.slot))
    db.add(plan)
    db.commit()
    db.refresh(plan)
    return _to_read(_load_plan(db, plan.id, user))


@router.get("/{plan_id}", response_model=MealPlanRead)
def get_plan(plan_id: uuid.UUID, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return _to_read(_load_plan(db, plan_id, user))


@router.put("/{plan_id}", response_model=MealPlanRead)
def update_plan(plan_id: uuid.UUID, body: MealPlanUpdate, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    plan = _load_plan(db, plan_id, user)
    if body.week_start is not None:
        plan.week_start = body.week_start
    db.commit()
    return _to_read(_load_plan(db, plan_id, user))


@router.patch("/{plan_id}", response_model=MealPlanRead)
def patch_plan(plan_id: uuid.UUID, body: MealPlanUpdate, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return update_plan(plan_id, body, user, db)


@router.delete("/{plan_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_plan(plan_id: uuid.UUID, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    db.delete(_load_plan(db, plan_id, user))
    db.commit()


def _require_recipe(db: Session, recipe_id: uuid.UUID, user: User) -> Recipe:
    recipe = db.get(Recipe, recipe_id)
    if recipe is None or recipe.owner_id != user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Recipe not found")
    return recipe


@router.get("/{plan_id}/entries/", response_model=list[MealPlanEntryRead])
def list_entries(plan_id: uuid.UUID, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    plan = _load_plan(db, plan_id, user)
    return [
        MealPlanEntryRead(
            id=e.id,
            recipe_id=e.recipe_id,
            recipe_title=e.recipe.title if e.recipe else "",
            recipe_hero_image=e.recipe.hero_image if e.recipe else None,
            day=e.day,
            slot=e.slot,
        )
        for e in plan.entries
    ]


@router.post("/{plan_id}/entries/", response_model=MealPlanEntryRead, status_code=status.HTTP_201_CREATED)
def add_entry(plan_id: uuid.UUID, body: MealPlanEntryCreate, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    plan = _load_plan(db, plan_id, user)
    recipe = _require_recipe(db, body.recipe_id, user)
    entry = MealPlanEntry(meal_plan_id=plan.id, recipe_id=body.recipe_id, day=body.day, slot=body.slot)
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return MealPlanEntryRead(
        id=entry.id,
        recipe_id=entry.recipe_id,
        recipe_title=recipe.title,
        recipe_hero_image=recipe.hero_image,
        day=entry.day,
        slot=entry.slot,
    )


@router.delete("/{plan_id}/entries/{entry_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_entry(plan_id: uuid.UUID, entry_id: uuid.UUID, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    plan = _load_plan(db, plan_id, user)
    entry = db.get(MealPlanEntry, entry_id)
    if entry is None or entry.meal_plan_id != plan.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Entry not found")
    db.delete(entry)
    db.commit()
