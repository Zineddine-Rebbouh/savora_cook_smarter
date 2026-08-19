import uuid
from datetime import date, timedelta
from decimal import Decimal

from app.auth import hash_password
from app.database import SessionLocal, engine
from app.models import Base, Ingredient, MealPlan, MealPlanEntry, PantryItem, Profile, Recipe, RecipeStep, User


def seed_data():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        # Check if demo user already exists
        existing_user = db.query(User).filter(User.email == "demo@savora.app").first()
        if existing_user:
            print("Demo user already seeded.")
            return

        user_id = uuid.uuid4()
        demo_user = User(
            id=user_id,
            email="demo@savora.app",
            password_hash=hash_password("password123"),
            display_name="Demo Chef",
        )
        db.add(demo_user)
        db.flush()

        profile = Profile(
            user_id=user_id,
            dietary_preferences=["Gluten-Free", "Dairy-Free"],
            cooking_since=date.today() - timedelta(days=365),
        )
        db.add(profile)

        # Seed Recipes
        recipe1 = Recipe(
            id=uuid.uuid4(),
            owner_id=user_id,
            title="Crispy Garlic Salmon",
            source_url="https://example.com/crispy-garlic-salmon",
            hero_image="https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80",
            description="Pan-seared salmon with golden crispy garlic butter sauce and lemon.",
            hero_tag="Savora Pick",
            servings=2,
            prep_minutes=10,
            cook_minutes=15,
            difficulty="Easy",
            nutrition=[
                {"label": "Protein", "grams": 34.0, "color": "#10B981"},
                {"label": "Carbs", "grams": 4.0, "color": "#F59E0B"},
                {"label": "Fat", "grams": 22.0, "color": "#EF4444"},
            ],
            ingredients=[
                Ingredient(sort_order=0, amount=Decimal("2.0"), unit="pcs", name="Salmon Fillet", note="skin-on"),
                Ingredient(sort_order=1, amount=Decimal("4.0"), unit="cloves", name="Garlic", note="minced"),
                Ingredient(sort_order=2, amount=Decimal("1.0"), unit="tbsp", name="Olive Oil", note="extra virgin"),
                Ingredient(sort_order=3, amount=Decimal("1.0"), unit="pc", name="Lemon", note="juiced"),
            ],
            steps=[
                RecipeStep(sort_order=0, instruction="Pat salmon fillets dry with paper towels and season with salt and pepper.", timer_minutes=2),
                RecipeStep(sort_order=1, instruction="Heat olive oil in a skillet over medium-high heat. Add salmon skin-side down.", timer_minutes=6),
                RecipeStep(sort_order=2, instruction="Flip salmon, add minced garlic and lemon juice, and sear until cooked through.", timer_minutes=4),
            ],
        )

        recipe2 = Recipe(
            id=uuid.uuid4(),
            owner_id=user_id,
            title="Zero-Waste Veggie Bowl",
            source_url="https://example.com/veggie-bowl",
            hero_image="https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80",
            description="Nourishing roasted vegetable bowl using leftover produce and quinoa.",
            hero_tag="Zero Waste",
            servings=1,
            prep_minutes=15,
            cook_minutes=25,
            difficulty="Easy",
            nutrition=[
                {"label": "Protein", "grams": 14.0, "color": "#10B981"},
                {"label": "Carbs", "grams": 45.0, "color": "#F59E0B"},
                {"label": "Fat", "grams": 10.0, "color": "#EF4444"},
            ],
            ingredients=[
                Ingredient(sort_order=0, amount=Decimal("1.0"), unit="cup", name="Quinoa", note="cooked"),
                Ingredient(sort_order=1, amount=Decimal("2.0"), unit="cups", name="Spinach", note="fresh"),
                Ingredient(sort_order=2, amount=Decimal("1.0"), unit="pc", name="Avocado", note="sliced"),
                Ingredient(sort_order=3, amount=Decimal("1.0"), unit="tbsp", name="Olive Oil", note=""),
            ],
            steps=[
                RecipeStep(sort_order=0, instruction="Cook quinoa according to package instructions.", timer_minutes=15),
                RecipeStep(sort_order=1, instruction="Sauté spinach lightly in olive oil.", timer_minutes=3),
                RecipeStep(sort_order=2, instruction="Assemble quinoa, spinach, and sliced avocado in a bowl.", timer_minutes=2),
            ],
        )

        db.add_all([recipe1, recipe2])
        db.flush()

        # Seed Pantry Items
        pantry_items = [
            PantryItem(owner_id=user_id, name="Salmon Fillet", quantity="2 pcs", category="Meat", expiry_date=date.today() + timedelta(days=2)),
            PantryItem(owner_id=user_id, name="Garlic", quantity="1 bulb", category="Produce", expiry_date=date.today() + timedelta(days=14)),
            PantryItem(owner_id=user_id, name="Lemon", quantity="3 pcs", category="Produce", expiry_date=date.today() + timedelta(days=5)),
            PantryItem(owner_id=user_id, name="Olive Oil", quantity="500 ml", category="Pantry", expiry_date=date.today() + timedelta(days=90)),
            PantryItem(owner_id=user_id, name="Spinach", quantity="1 bag", category="Produce", expiry_date=date.today() + timedelta(days=1)),
        ]
        db.add_all(pantry_items)
        db.flush()

        # Seed Meal Plan
        week_start = date.today() - timedelta(days=date.today().weekday())
        meal_plan = MealPlan(
            id=uuid.uuid4(),
            owner_id=user_id,
            week_start=week_start,
            entries=[
                MealPlanEntry(recipe_id=recipe1.id, day=0, slot="dinner"),
                MealPlanEntry(recipe_id=recipe2.id, day=1, slot="lunch"),
            ],
        )
        db.add(meal_plan)

        db.commit()
        print("Successfully seeded demo data!")

    finally:
        db.close()


if __name__ == "__main__":
    seed_data()
