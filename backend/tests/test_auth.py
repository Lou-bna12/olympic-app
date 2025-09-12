import sys, os
import pytest
from httpx import AsyncClient, ASGITransport

# Permet de trouver main.py
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from main import app


def make_test_user():
    """Fabrique un utilisateur de test unique à chaque run"""
    import random
    return {
        "username": f"testuser_{random.randint(1, 1_000_000)}",
        "email": f"test_{random.randint(1, 1_000_000)}@example.com",
        "password": "secret123"
    }


@pytest.mark.asyncio
async def test_register_user():
    """Test inscription utilisateur"""
    user = make_test_user()
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.post("/auth/register", json=user)

    assert response.status_code == 200, response.text
    data = response.json()
    assert "id" in data
    assert data["email"] == user["email"]


@pytest.mark.asyncio
async def test_login_user():
    """Test connexion utilisateur"""
    user = make_test_user()
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        # 1) Enregistrement
        await ac.post("/auth/register", json=user)

        # 2) Connexion avec JSON (schéma UserLogin attend email + password)
        response = await ac.post(
            "/auth/login",
            json={
                "email": user["email"],     # ⚠️ email attendu par ton schéma
                "password": user["password"]
            }
        )

    # Vérifications
    assert response.status_code == 200, response.text
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
