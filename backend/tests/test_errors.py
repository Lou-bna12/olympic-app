import pytest
from httpx import AsyncClient, ASGITransport
import sys, os

# pour trouver main.py
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from main import app


@pytest.mark.asyncio
async def test_auth_errors():
    """Cas d'erreur sur l'authentification"""

    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        # 1) Login avec mauvais mot de passe
        bad_login = await ac.post(
            "/auth/login",
            json={"email": "wrong@example.com", "password": "badpass"}
        )
        assert bad_login.status_code in (400, 401), bad_login.text

        # 2) Accès à /auth/me sans token
        me_res = await ac.get("/auth/me")
        assert me_res.status_code == 401, me_res.text


@pytest.mark.asyncio
async def test_reservation_errors():
    """Cas d'erreur sur les réservations"""

    test_user = {
        "username": "error_user",
        "email": "error_user@example.com",
        "password": "secret123"
    }

    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        # Création user
        await ac.post("/auth/register", json=test_user)
        login = await ac.post("/auth/login", json={"email": test_user["email"], "password": test_user["password"]})
        token = login.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}

        # 1) Réservation sans offre valide
        res1 = await ac.post(
            "/reservations",
            json={
                "username": test_user["username"],
                "email": test_user["email"],
                "date": "2025-09-15",
                "offre": "OffreInexistante",
                "quantity": 1
            },
            headers=headers
        )
        assert res1.status_code in (400, 404), res1.text


@pytest.mark.asyncio
async def test_ticket_errors():
    """Cas d'erreur sur les tickets"""

    test_user = {
        "username": "ticket_error",
        "email": "ticket_error@example.com",
        "password": "secret123"
    }

    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        # Création user
        await ac.post("/auth/register", json=test_user)
        login = await ac.post("/auth/login", json={"email": test_user["email"], "password": test_user["password"]})
        token = login.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}

        # 1) Création d’un ticket avec une offre inexistante
        res1 = await ac.post("/tickets/?offer_id=9999", headers=headers)
        assert res1.status_code in (400, 404), res1.text

        # 2) Paiement sans ticket_id
        pay_res = await ac.post("/payment/simulate", json={"ticket_id": 9999}, headers=headers)
        assert pay_res.status_code in (400, 404), pay_res.text
