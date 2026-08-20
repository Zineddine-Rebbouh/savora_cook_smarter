from datetime import date, timedelta
from fastapi.testclient import TestClient
from app.main import app


def test_pantry_crud_and_alerts(auth_client_a):
    today = date.today()

    # Item expiring in 2 days (high alert)
    item1 = {
        "name": "Milk",
        "quantity": "1L",
        "category": "Dairy",
        "expiry_date": (today + timedelta(days=2)).isoformat(),
    }
    res1 = auth_client_a.post("/api/v1/pantry-items/", json=item1)
    assert res1.status_code == 201
    assert res1.json()["alert"] == "high"

    # Item expiring in 5 days (medium alert)
    item2 = {
        "name": "Eggs",
        "quantity": "12 pcs",
        "category": "Dairy",
        "expiry_date": (today + timedelta(days=5)).isoformat(),
    }
    res2 = auth_client_a.post("/api/v1/pantry-items/", json=item2)
    assert res2.status_code == 201
    assert res2.json()["alert"] == "medium"

    # Item expiring in 15 days (low alert)
    item3 = {
        "name": "Rice",
        "quantity": "1kg",
        "category": "Pantry",
        "expiry_date": (today + timedelta(days=15)).isoformat(),
    }
    res3 = auth_client_a.post("/api/v1/pantry-items/", json=item3)
    assert res3.status_code == 201
    assert res3.json()["alert"] == "low"

    # List items
    res_list = auth_client_a.get("/api/v1/pantry-items/")
    assert res_list.status_code == 200
    assert res_list.json()["total"] == 3

    item_id = res1.json()["id"]

    # Patch item quantity
    res_patch = auth_client_a.patch(f"/api/v1/pantry-items/{item_id}", json={"quantity": "500ml"})
    assert res_patch.status_code == 200
    assert res_patch.json()["quantity"] == "500ml"

    # Delete item
    res_del = auth_client_a.delete(f"/api/v1/pantry-items/{item_id}")
    assert res_del.status_code == 204


def test_create_pantry_item_invalid_expiry(auth_client_a):
    item = {
        "name": "Cheese",
        "quantity": "200g",
        "category": "Dairy",
        "expiry_date": "not-a-valid-date",
    }
    res = auth_client_a.post("/api/v1/pantry-items/", json=item)
    assert res.status_code == 422


def test_empty_state_pantry(client):
    # Register clean user with no pantry items
    reg_res = client.post(
        "/api/v1/auth/register/",
        json={
            "email": "clean_pantry@example.com",
            "password": "password123",
            "display_name": "Clean Pantry User",
        },
    )
    assert reg_res.status_code == 201
    token = reg_res.json()["access_token"]

    with TestClient(app, headers={"Authorization": f"Bearer {token}"}) as clean_client:
        res = clean_client.get("/api/v1/pantry-items/")
        assert res.status_code == 200
        data = res.json()
        assert data["items"] == []
        assert data["total"] == 0

