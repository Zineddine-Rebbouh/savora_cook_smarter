import uuid
from datetime import date as DateType, datetime as DateTimeType
from decimal import Decimal

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class RegisterIn(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8)
    display_name: str
    diets: list[str] = []


class LoginIn(BaseModel):
    email: EmailStr
    password: str


class RefreshIn(BaseModel):
    refresh_token: str


class TokenOut(BaseModel):
    access_token: str
    refresh_token: str


class UserRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: uuid.UUID
    email: EmailStr
    display_name: str


class ProfileUpdate(BaseModel):
    display_name: str | None = None
    dietary_preferences: list[str] | None = None
    cooking_since: DateType | None = None


class ProfileRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    display_name: str
    dietary_preferences: list[str]
    cooking_since: DateType
    saved_count: int = 0
    cooked_count: int = 0
    collection_count: int = 0


class IngredientIn(BaseModel):
    amount: Decimal
    unit: str = ""
    name: str
    note: str | None = None


class IngredientRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: uuid.UUID
    amount: Decimal
    unit: str
    name: str
    note: str | None


class StepIn(BaseModel):
    instruction: str
    timer_minutes: int | None = None
    linked_recipe: str | None = None


class StepRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: uuid.UUID
    instruction: str
    timer_minutes: int | None
    linked_recipe: str | None


class NutritionItem(BaseModel):
    label: str
    grams: float
    color: str


class RecipeCreate(BaseModel):
    title: str
    source_url: str | None = None
    hero_image: str | None = None
    description: str | None = None
    hero_tag: str | None = None
    servings: int = 1
    prep_minutes: int = 0
    cook_minutes: int = 0
    difficulty: str = "Easy"
    nutrition: list[NutritionItem] = []
    ingredients: list[IngredientIn] = []
    steps: list[StepIn] = []


class RecipeUpdate(BaseModel):
    title: str | None = None
    source_url: str | None = None
    hero_image: str | None = None
    description: str | None = None
    hero_tag: str | None = None
    servings: int | None = None
    prep_minutes: int | None = None
    cook_minutes: int | None = None
    difficulty: str | None = None
    nutrition: list[NutritionItem] | None = None
    ingredients: list[IngredientIn] | None = None
    steps: list[StepIn] | None = None


class RecipeRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: uuid.UUID
    title: str
    source_url: str | None
    hero_image: str | None
    description: str | None
    hero_tag: str | None
    servings: int
    prep_minutes: int
    cook_minutes: int
    difficulty: str
    nutrition: list[NutritionItem]
    created_at: DateTimeType
    updated_at: DateTimeType
    ingredients: list[IngredientRead]
    steps: list[StepRead]
    pantry_owned: int = 0
    pantry_total: int = 0
    missing_ingredients: list[str] = []
    community_rating: str = "4.8 from 126 home cooks"


class PantryItemCreate(BaseModel):
    name: str
    quantity: str
    category: str
    expiry_date: DateType | None = None


class PantryItemUpdate(BaseModel):
    name: str | None = None
    quantity: str | None = None
    category: str | None = None
    expiry_date: DateType | None = None


class PantryItemRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: uuid.UUID
    name: str
    quantity: str
    category: str
    expiry_date: DateType | None
    alert: str | None = None


class CookLogCreate(BaseModel):
    recipe_id: uuid.UUID | None = None
    date: DateType | None = None
    rating: int = Field(ge=1, le=5)
    note: str | None = None


class CookLogRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: uuid.UUID
    recipe_id: uuid.UUID
    recipe_title: str
    recipe_hero_image: str | None
    date: DateType
    rating: int
    note: str | None


class MealPlanEntryCreate(BaseModel):
    recipe_id: uuid.UUID
    day: int = Field(ge=0, le=6)
    slot: str


class MealPlanEntryRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: uuid.UUID
    recipe_id: uuid.UUID
    recipe_title: str
    recipe_hero_image: str | None
    day: int
    slot: str


class MealPlanCreate(BaseModel):
    week_start: DateType
    entries: list[MealPlanEntryCreate] = []


class MealPlanUpdate(BaseModel):
    week_start: DateType | None = None


class MealPlanRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: uuid.UUID
    week_start: DateType
    entries: list[MealPlanEntryRead]


class Paginated(BaseModel):
    items: list
    total: int
    limit: int
    offset: int

