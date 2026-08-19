import uuid
from datetime import date, datetime
from decimal import Decimal

from sqlalchemy import JSON, CheckConstraint, Date, DateTime, ForeignKey, Integer, Numeric, String, Text, UniqueConstraint, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email: Mapped[str] = mapped_column(String(320), unique=True, index=True)
    password_hash: Mapped[str] = mapped_column(String(255))
    display_name: Mapped[str] = mapped_column(String(100))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    profile: Mapped["Profile"] = relationship(back_populates="user", cascade="all, delete-orphan", uselist=False)


class Profile(Base):
    __tablename__ = "profiles"

    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), primary_key=True)
    dietary_preferences: Mapped[list[str]] = mapped_column(JSON, default=list)
    cooking_since: Mapped[date] = mapped_column(Date, default=date.today)
    user: Mapped[User] = relationship(back_populates="profile")


class Recipe(Base):
    __tablename__ = "recipes"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    owner_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    title: Mapped[str] = mapped_column(String(255))
    source_url: Mapped[str | None] = mapped_column(String(2048))
    hero_image: Mapped[str | None] = mapped_column(String(2048))
    description: Mapped[str | None] = mapped_column(Text)
    hero_tag: Mapped[str | None] = mapped_column(String(100))
    servings: Mapped[int] = mapped_column(Integer, default=1)
    prep_minutes: Mapped[int] = mapped_column(Integer, default=0)
    cook_minutes: Mapped[int] = mapped_column(Integer, default=0)
    difficulty: Mapped[str] = mapped_column(String(20), default="Easy")
    nutrition: Mapped[list[dict]] = mapped_column(JSON, default=list)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    ingredients: Mapped[list["Ingredient"]] = relationship(back_populates="recipe", cascade="all, delete-orphan", order_by="Ingredient.sort_order")
    steps: Mapped[list["RecipeStep"]] = relationship(back_populates="recipe", cascade="all, delete-orphan", order_by="RecipeStep.sort_order")


class Ingredient(Base):
    __tablename__ = "ingredients"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    recipe_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("recipes.id", ondelete="CASCADE"), index=True)
    sort_order: Mapped[int] = mapped_column(Integer)
    amount: Mapped[Decimal] = mapped_column(Numeric(10, 2))
    unit: Mapped[str] = mapped_column(String(50), default="")
    name: Mapped[str] = mapped_column(String(255))
    note: Mapped[str | None] = mapped_column(String(255))
    recipe: Mapped[Recipe] = relationship(back_populates="ingredients")


class RecipeStep(Base):
    __tablename__ = "recipe_steps"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    recipe_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("recipes.id", ondelete="CASCADE"), index=True)
    sort_order: Mapped[int] = mapped_column(Integer)
    instruction: Mapped[str] = mapped_column(Text)
    timer_minutes: Mapped[int | None] = mapped_column(Integer)
    linked_recipe: Mapped[str | None] = mapped_column(String(255))
    recipe: Mapped[Recipe] = relationship(back_populates="steps")


class CookLog(Base):
    __tablename__ = "cook_logs"
    __table_args__ = (CheckConstraint("rating BETWEEN 1 AND 5", name="cook_log_rating_range"),)

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    recipe_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("recipes.id", ondelete="CASCADE"), index=True)
    date: Mapped[date] = mapped_column(Date, default=date.today)
    rating: Mapped[int] = mapped_column(Integer)
    note: Mapped[str | None] = mapped_column(Text)


class PantryItem(Base):
    __tablename__ = "pantry_items"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    owner_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    name: Mapped[str] = mapped_column(String(255))
    quantity: Mapped[str] = mapped_column(String(100))
    category: Mapped[str] = mapped_column(String(50))
    expiry_date: Mapped[date | None] = mapped_column(Date)


class MealPlan(Base):
    __tablename__ = "meal_plans"
    __table_args__ = (UniqueConstraint("owner_id", "week_start", name="unique_owner_week"),)

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    owner_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    week_start: Mapped[date] = mapped_column(Date)
    entries: Mapped[list["MealPlanEntry"]] = relationship(back_populates="meal_plan", cascade="all, delete-orphan")


class MealPlanEntry(Base):
    __tablename__ = "meal_plan_entries"
    __table_args__ = (CheckConstraint("day BETWEEN 0 AND 6", name="meal_plan_day_range"),)

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    meal_plan_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("meal_plans.id", ondelete="CASCADE"), index=True)
    recipe_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("recipes.id", ondelete="CASCADE"))
    day: Mapped[int] = mapped_column(Integer)
    slot: Mapped[str] = mapped_column(String(20))
    meal_plan: Mapped[MealPlan] = relationship(back_populates="entries")
    recipe: Mapped[Recipe] = relationship()
