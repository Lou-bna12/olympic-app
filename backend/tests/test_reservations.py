import pytest
from httpx import AsyncClient, ASGITransport
import sys, os

# pour trouver main.py
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from main import app


@pytest.mark.asyncio
async def test_reservations_flow():
    """Test complet du flux de réservation"""

    test_user = {
        "username": "reserv_user",
        "email": "reserv_user@example.com",
        "password": "secret123"
    }

    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        # 1) Register
        await ac.post("/auth/register", json=test_user)

        # 2) Login → format JSON
        login_res = await ac.post(
            "/auth/login",
            json={
                "email": test_user["email"],
                "password": test_user["password"]
            }
        )
        assert login_res.status_code == 200, login_res.text
        token = login_res.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}

        # 3) Créer une réservation
        reserv_res = await ac.post(
            "/reservations",
            json={
                "username": test_user["username"],
                "email": test_user["email"],
                "date": "2025-09-12",
                "offre": "Solo",
                "quantity": 1
            },
            headers=headers
        )
        assert reserv_res.status_code == 200, reserv_res.text
        reservation = reserv_res.json()
        assert "id" in reservation

        # 4) Vérifier mes réservations
        my_reservs = await ac.get("/reservations", headers=headers)
        assert my_reservs.status_code == 200, my_reservs.text
        assert any(r["id"] == reservation["id"] for r in my_reservs.json())

        # 5) Vérifier les stats
        stats_res = await ac.get("/reservations/stats", headers=headers)
        assert stats_res.status_code == 200, stats_res.text
