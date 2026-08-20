from datetime import date
from fastapi.testclient import TestClient
from app.main import app


def test_meal_plan_crud_and_entries(auth_client_a):
    # First create a recipe to place in the plan
    recipe_res = auth_client_a.post(
        "/api/v1/recipes/",
        json={"title": "Plan Recipe", "ingredients": [], "steps": []},
    )
    recipe_id = recipe_res.json()["id"]

    plan_payload = {
        "week_start": "2026-08-17",
        "entries": [{"recipe_id": recipe_id, "day": 0, "slot": "dinner"}],
    }

    res_plan = auth_client_a.post("/api/v1/meal-plans/", json=plan_payload)
    assert res_plan.status_code == 201
    plan_data = res_plan.json()
    plan_id = plan_data["id"]
    assert len(plan_data["entries"]) == 1
    assert plan_data["entries"][0]["recipe_title"] == "Plan Recipe"

    # Add another entry
    entry_payload = {"recipe_id": recipe_id, "day": 1, "slot": "lunch"}
    res_entry = auth_client_a.post(f"/api/v1/meal-plans/{plan_id}/entries/", json=entry_payload)
    assert res_entry.status_code == 201
    entry_id = res_entry.json()["id"]

    # Delete entry
    res_del_entry = auth_client_a.delete(f"/api/v1/meal-plans/{plan_id}/entries/{entry_id}")
    assert res_del_entry.status_code == 204

    # List plans
    res_list = auth_client_a.get("/api/v1/meal-plans/")
    assert res_list.status_code == 200
    assert len(res_list.json()) == 1


def test_empty_state_meal_plans(client):
    # Register clean user with no meal plans
    reg_res = client.post(
        "/api/v1/auth/register/",
        json={
            "email": "clean_mealplans@example.com",
            "password": "password123",
            "display_name": "Clean Meal Plan User",
        },
    )
    assert reg_res.status_code == 201
    token = reg_res.json()["access_token"]

    with TestClient(app, headers={"Authorization": f"Bearer {token}"}) as clean_client:
        res = clean_client.get("/api/v1/meal-plans/")
        assert res.status_code == 200
        assert res.json() == []

