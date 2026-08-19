import uuid
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.auth import issue_token_pair
from app.database import Base, get_db
from app.main import app
from app.models import Profile, User

# SQLite in-memory engine for fast test runs
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture(scope="function")
def db_session():
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)


@pytest.fixture(scope="function")
def client(db_session):
    def _override_get_db():
        try:
            yield db_session
        finally:
            pass

    app.dependency_overrides[get_db] = _override_get_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()


@pytest.fixture
def user_a(db_session):
    user = User(
        id=uuid.uuid4(),
        email="usera@example.com",
        password_hash="fakehash",
        display_name="User A",
    )
    db_session.add(user)
    db_session.flush()
    profile = Profile(user_id=user.id, dietary_preferences=["Vegetarian"])
    db_session.add(profile)
    db_session.commit()
    tokens = issue_token_pair(user.id)
    return {"user": user, "tokens": tokens}


@pytest.fixture
def user_b(db_session):
    user = User(
        id=uuid.uuid4(),
        email="userb@example.com",
        password_hash="fakehash",
        display_name="User B",
    )
    db_session.add(user)
    db_session.flush()
    profile = Profile(user_id=user.id, dietary_preferences=["Keto"])
    db_session.add(profile)
    db_session.commit()
    tokens = issue_token_pair(user.id)
    return {"user": user, "tokens": tokens}


@pytest.fixture
def auth_client_a(db_session, user_a):
    def _override_get_db():
        try:
            yield db_session
        finally:
            pass

    app.dependency_overrides[get_db] = _override_get_db
    with TestClient(app, headers={"Authorization": f"Bearer {user_a['tokens']['access_token']}"}) as c:
        yield c


@pytest.fixture
def auth_client_b(db_session, user_b):
    def _override_get_db():
        try:
            yield db_session
        finally:
            pass

    app.dependency_overrides[get_db] = _override_get_db
    with TestClient(app, headers={"Authorization": f"Bearer {user_b['tokens']['access_token']}"}) as c:
        yield c

