import uuid
from datetime import date

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.auth import get_current_user
from app.database import get_db
from app.models import PantryItem, User
from app.schemas import Paginated, PantryItemCreate, PantryItemRead, PantryItemUpdate

router = APIRouter(prefix="/pantry-items", tags=["pantry"])


def _alert(expiry: date | None) -> str | None:
    if expiry is None:
        return None
    days = (expiry - date.today()).days
    if days <= 3:
        return "high"
    if days <= 7:
        return "medium"
    return "low"


def _to_read(item: PantryItem) -> PantryItemRead:
    return PantryItemRead(
        id=item.id,
        name=item.name,
        quantity=item.quantity,
        category=item.category,
        expiry_date=item.expiry_date,
        alert=_alert(item.expiry_date),
    )


def _load_item(db: Session, item_id: uuid.UUID, user: User) -> PantryItem:
    item = db.get(PantryItem, item_id)
    if item is None or item.owner_id != user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Pantry item not found")
    return item


@router.get("/", response_model=Paginated)
def list_items(
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    query = db.query(PantryItem).filter(PantryItem.owner_id == user.id)
    total = query.count()
    items = query.order_by(PantryItem.expiry_date.asc().nulls_last(), PantryItem.name.asc()).offset(offset).limit(limit).all()
    return Paginated(items=[_to_read(i) for i in items], total=total, limit=limit, offset=offset)


@router.post("/", response_model=PantryItemRead, status_code=status.HTTP_201_CREATED)
def create_item(body: PantryItemCreate, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    item = PantryItem(owner_id=user.id, **body.model_dump())
    db.add(item)
    db.commit()
    db.refresh(item)
    return _to_read(item)


@router.get("/{item_id}", response_model=PantryItemRead)
def get_item(item_id: uuid.UUID, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return _to_read(_load_item(db, item_id, user))


@router.put("/{item_id}", response_model=PantryItemRead)
def update_item(item_id: uuid.UUID, body: PantryItemCreate, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    item = _load_item(db, item_id, user)
    for field, value in body.model_dump().items():
        setattr(item, field, value)
    db.commit()
    db.refresh(item)
    return _to_read(item)


@router.patch("/{item_id}", response_model=PantryItemRead)
def patch_item(item_id: uuid.UUID, body: PantryItemUpdate, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    item = _load_item(db, item_id, user)
    for field, value in body.model_dump(exclude_unset=True).items():
        setattr(item, field, value)
    db.commit()
    db.refresh(item)
    return _to_read(item)


@router.delete("/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_item(item_id: uuid.UUID, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    db.delete(_load_item(db, item_id, user))
    db.commit()
