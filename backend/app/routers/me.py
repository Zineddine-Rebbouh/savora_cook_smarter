from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.auth import get_current_user
from app.database import get_db
from app.models import CookLog, Profile, User
from app.schemas import ProfileRead, ProfileUpdate, UserRead

router = APIRouter(tags=["me"])


@router.get("/me/", response_model=ProfileRead)
def read_me(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    profile = db.get(Profile, user.id)
    cooked_count = db.query(func.count(CookLog.id)).filter(CookLog.user_id == user.id).scalar() or 0
    return ProfileRead(
        display_name=user.display_name,
        dietary_preferences=profile.dietary_preferences if profile else [],
        cooking_since=profile.cooking_since if profile else user.created_at.date(),
        cooked_count=cooked_count,
    )


@router.patch("/me/", response_model=ProfileRead)
def update_me(
    body: ProfileUpdate,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if body.display_name is not None:
        user.display_name = body.display_name
    profile = db.get(Profile, user.id)
    if profile is None:
        profile = Profile(user_id=user.id)
        db.add(profile)
    if body.dietary_preferences is not None:
        profile.dietary_preferences = body.dietary_preferences
    if body.cooking_since is not None:
        profile.cooking_since = body.cooking_since
    db.commit()
    db.refresh(profile)
    cooked_count = db.query(func.count(CookLog.id)).filter(CookLog.user_id == user.id).scalar() or 0
    return ProfileRead(
        display_name=user.display_name,
        dietary_preferences=profile.dietary_preferences,
        cooking_since=profile.cooking_since,
        cooked_count=cooked_count,
    )
