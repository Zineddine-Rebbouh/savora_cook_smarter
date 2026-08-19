import uuid

from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.orm import Session

from app.auth import decode_token, get_current_user, hash_password, issue_token_pair, verify_password
from app.database import get_db
from app.limiter import limiter
from app.models import Profile, User
from app.schemas import LoginIn, ProfileRead, RefreshIn, RegisterIn, TokenOut, UserRead

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register/", response_model=TokenOut, status_code=status.HTTP_201_CREATED)
@limiter.limit("5/minute")
def register(request: Request, body: RegisterIn, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == body.email).first():
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already registered")
    user = User(
        id=uuid.uuid4(),
        email=body.email,
        password_hash=hash_password(body.password),
        display_name=body.display_name,
    )
    db.add(user)
    db.flush()
    db.add(Profile(user_id=user.id, dietary_preferences=body.diets))
    db.commit()
    return issue_token_pair(user.id)


@router.post("/login/", response_model=TokenOut)
@limiter.limit("5/minute")
def login(request: Request, body: LoginIn, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == body.email).first()
    if user is None or not verify_password(body.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")
    return issue_token_pair(user.id)


@router.post("/refresh/", response_model=TokenOut)
def refresh(body: RefreshIn):
    payload = decode_token(body.refresh_token)
    if payload.get("type") != "refresh":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token type")
    return issue_token_pair(uuid.UUID(payload["sub"]))

