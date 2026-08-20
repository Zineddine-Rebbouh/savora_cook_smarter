import uuid
from fastapi.testclient import TestClient
from app.main import app
from app.models import Ingredient, RecipeStep


def test_recipe_crud_and_cook_log(auth_client_a):
    recipe_payload = {
        "title": "Test Pasta",
        "description": "Delicious quick pasta",
        "servings": 2,
        "prep_minutes": 5,
        "cook_minutes": 10,
        "difficulty": "Easy",
        "nutrition": [{"label": "Carbs", "grams": 50.0, "color": "#F59E0B"}],
        "ingredients": [
            {"amount": 200, "unit": "g", "name": "Pasta"},
            {"amount": 2, "unit": "cloves", "name": "Garlic"},
        ],
        "steps": [
            {"instruction": "Boil pasta in salted water.", "timer_minutes": 8},
            {"instruction": "Sauté garlic and mix with pasta.", "timer_minutes": 2},
        ],
    }

    # Create recipe
    res = auth_client_a.post("/api/v1/recipes/", json=recipe_payload)
    assert res.status_code == 201
    recipe = res.json()
    recipe_id = recipe["id"]
    assert recipe["title"] == "Test Pasta"
    assert len(recipe["ingredients"]) == 2
    assert len(recipe["steps"]) == 2
    assert recipe["pantry_owned"] == 0

    # Add pasta to pantry
    auth_client_a.post("/api/v1/pantry-items/", json={"name": "Pasta", "quantity": "500g", "category": "Pantry"})

    # Fetch detail again -> pantry_owned should update
    res_detail = auth_client_a.get(f"/api/v1/recipes/{recipe_id}")
    assert res_detail.status_code == 200
    assert res_detail.json()["pantry_owned"] == 1

    # List recipes with search
    res_list = auth_client_a.get("/api/v1/recipes/?search=Pasta")
    assert res_list.status_code == 200
    assert res_list.json()["total"] == 1

    # Log cook
    log_payload = {"rating": 5, "note": "Turned out amazing!"}
    res_log = auth_client_a.post(f"/api/v1/recipes/{recipe_id}/cook-logs/", json=log_payload)
    assert res_log.status_code == 201
    assert res_log.json()["rating"] == 5

    # Delete recipe
    res_del = auth_client_a.delete(f"/api/v1/recipes/{recipe_id}")
    assert res_del.status_code == 204


def test_create_recipe_missing_title(auth_client_a):
    payload = {
        "description": "Recipe with missing title",
        "servings": 2,
        "ingredients": [],
        "steps": [],
    }
    res = auth_client_a.post("/api/v1/recipes/", json=payload)
    assert res.status_code == 422


def test_create_recipe_negative_servings(auth_client_a):
    payload = {
        "title": "Invalid Servings Recipe",
        "servings": -2,
        "ingredients": [],
        "steps": [],
    }
    res = auth_client_a.post("/api/v1/recipes/", json=payload)
    assert res.status_code == 422


def test_recipe_cascading_deletes(auth_client_a, db_session):
    payload = {
        "title": "Cascade Delete Test Recipe",
        "servings": 4,
        "ingredients": [
            {"amount": 100, "unit": "g", "name": "Flour"},
            {"amount": 50, "unit": "g", "name": "Sugar"},
        ],
        "steps": [
            {"instruction": "Mix dry ingredients."},
            {"instruction": "Bake at 350F for 30 minutes."},
        ],
    }

    # Create recipe with 2 ingredients and 2 steps
    res = auth_client_a.post("/api/v1/recipes/", json=payload)
    assert res.status_code == 201
    recipe_id = uuid.UUID(res.json()["id"])

    # Verify rows exist in DB before deletion
    ing_before = db_session.query(Ingredient).filter(Ingredient.recipe_id == recipe_id).all()
    step_before = db_session.query(RecipeStep).filter(RecipeStep.recipe_id == recipe_id).all()
    assert len(ing_before) == 2
    assert len(step_before) == 2

    # Delete recipe via API
    res_del = auth_client_a.delete(f"/api/v1/recipes/{recipe_id}")
    assert res_del.status_code == 204

    # Query DB directly to confirm child rows are deleted (no orphans left behind)
    ing_after = db_session.query(Ingredient).filter(Ingredient.recipe_id == recipe_id).all()
    step_after = db_session.query(RecipeStep).filter(RecipeStep.recipe_id == recipe_id).all()
    assert len(ing_after) == 0
    assert len(step_after) == 0


def test_empty_state_recipes(client):
    # Register clean user with no recipes
    reg_res = client.post(
        "/api/v1/auth/register/",
        json={
            "email": "clean_recipes@example.com",
            "password": "password123",
            "display_name": "Clean Recipe User",
        },
    )
    assert reg_res.status_code == 201
    token = reg_res.json()["access_token"]

    with TestClient(app, headers={"Authorization": f"Bearer {token}"}) as clean_client:
        res = clean_client.get("/api/v1/recipes/")
        assert res.status_code == 200
        data = res.json()
        assert data["items"] == []
        assert data["total"] == 0

