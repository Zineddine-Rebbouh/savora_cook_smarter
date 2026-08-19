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
