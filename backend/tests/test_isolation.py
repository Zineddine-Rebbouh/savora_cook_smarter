def test_user_data_isolation(auth_client_a, auth_client_b):
    # User A creates a recipe, pantry item, and meal plan
    r_res = auth_client_a.post("/api/v1/recipes/", json={"title": "User A Special", "ingredients": [], "steps": []})
    recipe_id = r_res.json()["id"]

    p_res = auth_client_a.post("/api/v1/pantry-items/", json={"name": "User A Item", "quantity": "1", "category": "Pantry"})
    pantry_id = p_res.json()["id"]

    m_res = auth_client_a.post("/api/v1/meal-plans/", json={"week_start": "2026-08-17", "entries": []})
    plan_id = m_res.json()["id"]

    # User B attempts to access User A's resources -> should get 404 for all
    assert auth_client_b.get(f"/api/v1/recipes/{recipe_id}").status_code == 404
    assert auth_client_b.patch(f"/api/v1/recipes/{recipe_id}", json={"title": "Hacked"}).status_code == 404
    assert auth_client_b.delete(f"/api/v1/recipes/{recipe_id}").status_code == 404

    assert auth_client_b.get(f"/api/v1/pantry-items/{pantry_id}").status_code == 404
    assert auth_client_b.delete(f"/api/v1/pantry-items/{pantry_id}").status_code == 404

    assert auth_client_b.get(f"/api/v1/meal-plans/{plan_id}").status_code == 404
    assert auth_client_b.delete(f"/api/v1/meal-plans/{plan_id}").status_code == 404

    # User B lists recipes -> should see 0 items
    list_res = auth_client_b.get("/api/v1/recipes/")
    assert list_res.status_code == 200
    assert list_res.json()["total"] == 0
