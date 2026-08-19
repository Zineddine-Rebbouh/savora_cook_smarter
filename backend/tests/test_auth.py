def test_health_check(client):
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_register_and_login(client):
    reg_payload = {
        "email": "newuser@example.com",
        "password": "securepassword123",
        "display_name": "New User",
        "diets": ["Vegan", "Gluten-Free"],
    }
    res = client.post("/api/v1/auth/register/", json=reg_payload)
    assert res.status_code == 201
    data = res.json()
    assert "access_token" in data
    assert "refresh_token" in data

    # Login with newly registered user
    login_payload = {"email": "newuser@example.com", "password": "securepassword123"}
    res = client.post("/api/v1/auth/login/", json=login_payload)
    assert res.status_code == 200
    assert "access_token" in res.json()


def test_login_invalid_credentials(client):
    res = client.post("/api/v1/auth/login/", json={"email": "wrong@example.com", "password": "password"})
    assert res.status_code == 401


def test_refresh_token(client, user_a):
    refresh_token = user_a["tokens"]["refresh_token"]
    res = client.post("/api/v1/auth/refresh/", json={"refresh_token": refresh_token})
    assert res.status_code == 200
    assert "access_token" in res.json()


def test_me_endpoint(auth_client_a):
    res = auth_client_a.get("/api/v1/me/")
    assert res.status_code == 200
    data = res.json()
    assert data["display_name"] == "User A"
    assert data["dietary_preferences"] == ["Vegetarian"]

    # Patch profile
    patch_res = auth_client_a.patch("/api/v1/me/", json={"display_name": "Updated User A", "dietary_preferences": ["Vegan"]})
    assert patch_res.status_code == 200
    updated_data = patch_res.json()
    assert updated_data["display_name"] == "Updated User A"
    assert updated_data["dietary_preferences"] == ["Vegan"]


def test_unauthenticated_request(client):
    res = client.get("/api/v1/me/")
    assert res.status_code == 401
