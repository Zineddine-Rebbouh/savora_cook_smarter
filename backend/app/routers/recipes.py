import uuid

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import func, or_
from sqlalchemy.orm import Session, selectinload

from app.auth import get_current_user
from app.database import get_db
from app.models import CookLog, Ingredient, PantryItem, Recipe, RecipeStep, User
from app.schemas import (
    CookLogCreate,
    CookLogRead,
    IngredientRead,
    Paginated,
    RecipeCreate,
    RecipeRead,
    RecipeUpdate,
    StepRead,
)

router = APIRouter(prefix="/recipes", tags=["recipes"])


def _load_recipe(db: Session, recipe_id: uuid.UUID, user: User) -> Recipe:
    recipe = db.get(Recipe, recipe_id, options=[selectinload(Recipe.ingredients), selectinload(Recipe.steps)])
    if recipe is None or recipe.owner_id != user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Recipe not found")
    return recipe


def _pantry_names(db: Session, user: User) -> list[str]:
    return [name for (name,) in db.query(PantryItem.name).filter(PantryItem.owner_id == user.id).all()]


def _ingredient_owned(ingredient_name: str, pantry_names: list[str]) -> bool:
    name = ingredient_name.lower()
    return any(p.lower() in name or name in p.lower() for p in pantry_names)


def _to_recipe_read(recipe: Recipe, user: User, db: Session) -> RecipeRead:
    pantry_names = _pantry_names(db, user)
    owned = [i for i in recipe.ingredients if _ingredient_owned(i.name, pantry_names)]
    missing = [i.name for i in recipe.ingredients if not _ingredient_owned(i.name, pantry_names)]
    return RecipeRead(
        id=recipe.id,
        title=recipe.title,
        source_url=recipe.source_url,
        hero_image=recipe.hero_image,
        description=recipe.description,
        hero_tag=recipe.hero_tag,
        servings=recipe.servings,
        prep_minutes=recipe.prep_minutes,
        cook_minutes=recipe.cook_minutes,
        difficulty=recipe.difficulty,
        nutrition=recipe.nutrition,
        created_at=recipe.created_at,
        updated_at=recipe.updated_at,
        ingredients=[IngredientRead.model_validate(i) for i in recipe.ingredients],
        steps=[StepRead.model_validate(s) for s in recipe.steps],
        pantry_owned=len(owned),
        pantry_total=len(recipe.ingredients),
        missing_ingredients=missing,
    )


def _apply_ingredients(db: Session, recipe: Recipe, ingredients: list):
    recipe.ingredients = [
        Ingredient(sort_order=i, amount=ing.amount, unit=ing.unit, name=ing.name, note=ing.note)
        for i, ing in enumerate(ingredients)
    ]


def _apply_steps(db: Session, recipe: Recipe, steps: list):
    recipe.steps = [
        RecipeStep(sort_order=i, instruction=s.instruction, timer_minutes=s.timer_minutes, linked_recipe=s.linked_recipe)
        for i, s in enumerate(steps)
    ]


@router.get("/", response_model=Paginated)
def list_recipes(
    search: str | None = None,
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    query = db.query(Recipe).filter(Recipe.owner_id == user.id)
    if search:
        like = f"%{search}%"
        query = query.outerjoin(Ingredient, Ingredient.recipe_id == Recipe.id).filter(
            or_(Recipe.title.ilike(like), Ingredient.name.ilike(like))
        ).distinct()
    total = query.count()
    recipes = query.options(selectinload(Recipe.ingredients), selectinload(Recipe.steps)).order_by(Recipe.created_at.desc()).offset(offset).limit(limit).all()
    return Paginated(items=[_to_recipe_read(r, user, db) for r in recipes], total=total, limit=limit, offset=offset)


@router.post("/", response_model=RecipeRead, status_code=status.HTTP_201_CREATED)
def create_recipe(body: RecipeCreate, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    recipe = Recipe(
        owner_id=user.id,
        title=body.title,
        source_url=body.source_url,
        hero_image=body.hero_image,
        description=body.description,
        hero_tag=body.hero_tag,
        servings=body.servings,
        prep_minutes=body.prep_minutes,
        cook_minutes=body.cook_minutes,
        difficulty=body.difficulty,
        nutrition=[n.model_dump() for n in body.nutrition],
    )
    _apply_ingredients(db, recipe, body.ingredients)
    _apply_steps(db, recipe, body.steps)
    db.add(recipe)
    db.commit()
    db.refresh(recipe)
    return _to_recipe_read(_load_recipe(db, recipe.id, user), user, db)


@router.get("/{recipe_id}", response_model=RecipeRead)
def get_recipe(recipe_id: uuid.UUID, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return _to_recipe_read(_load_recipe(db, recipe_id, user), user, db)


@router.put("/{recipe_id}", response_model=RecipeRead)
def update_recipe(recipe_id: uuid.UUID, body: RecipeCreate, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    recipe = _load_recipe(db, recipe_id, user)
    for field, value in body.model_dump(exclude={"ingredients", "steps"}).items():
        setattr(recipe, field, value)
    recipe.nutrition = [n.model_dump() for n in body.nutrition]
    _apply_ingredients(db, recipe, body.ingredients)
    _apply_steps(db, recipe, body.steps)
    db.commit()
    return _to_recipe_read(_load_recipe(db, recipe_id, user), user, db)


@router.patch("/{recipe_id}", response_model=RecipeRead)
def patch_recipe(recipe_id: uuid.UUID, body: RecipeUpdate, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    recipe = _load_recipe(db, recipe_id, user)
    data = body.model_dump(exclude_unset=True, exclude={"ingredients", "steps", "nutrition"})
    for field, value in data.items():
        setattr(recipe, field, value)
    if body.nutrition is not None:
        recipe.nutrition = [n.model_dump() for n in body.nutrition]
    if body.ingredients is not None:
        _apply_ingredients(db, recipe, body.ingredients)
    if body.steps is not None:
        _apply_steps(db, recipe, body.steps)
    db.commit()
    return _to_recipe_read(_load_recipe(db, recipe_id, user), user, db)


@router.delete("/{recipe_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_recipe(recipe_id: uuid.UUID, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    recipe = _load_recipe(db, recipe_id, user)
    db.delete(recipe)
    db.commit()


@router.post("/{recipe_id}/cook-logs/", response_model=CookLogRead, status_code=status.HTTP_201_CREATED)
def log_cook(recipe_id: uuid.UUID, body: CookLogCreate, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    recipe = db.get(Recipe, recipe_id)
    if recipe is None or recipe.owner_id != user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Recipe not found")
    from datetime import date

    log = CookLog(user_id=user.id, recipe_id=recipe_id, date=body.date or date.today(), rating=body.rating, note=body.note)
    db.add(log)
    db.commit()
    db.refresh(log)
    return CookLogRead(
        id=log.id,
        recipe_id=log.recipe_id,
        recipe_title=recipe.title,
        recipe_hero_image=recipe.hero_image,
        date=log.date,
        rating=log.rating,
        note=log.note,
    )
