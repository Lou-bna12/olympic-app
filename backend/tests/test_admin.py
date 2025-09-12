import pytest
from httpx import AsyncClient, ASGITransport
import sys, os

# pour trouver main.py
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from main import app


@pytest.mark.asyncio
async def test_admin_endpoints():
    """Tests complets des endpoints Admin"""

    # ⚠️ Mets ici l'email + mot de passe de ton vrai admin existant
    ADMIN_EMAIL = "contact@jo-paris2024.com"
    ADMIN_PASSWORD = "France-2026*"

    # Un utilisateur normal pour créer une réservation à manipuler ensuite
    test_user = {
        "username": "normal_user",
        "email": "normal_user@example.com",
        "password": "secret123"
    }

    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        # 1) Création d’un utilisateur normal
        await ac.post("/auth/register", json=test_user)

        # 2) Login utilisateur normal
        user_login = await ac.post(
            "/auth/login",
            json={"email": test_user["email"], "password": test_user["password"]}
        )
        assert user_login.status_code == 200, user_login.text
        user_token = user_login.json()["access_token"]
        user_headers = {"Authorization": f"Bearer {user_token}"}

        # 3) L’utilisateur normal crée une réservation
        reserv_res = await ac.post(
            "/reservations",
            json={
                "username": test_user["username"],
                "email": test_user["email"],
                "date": "2025-09-15",
                "offre": "Solo",
                "quantity": 1
            },
            headers=user_headers
        )
        assert reserv_res.status_code == 200, reserv_res.text
        reservation = reserv_res.json()

        # 4) Connexion en admin
        admin_login = await ac.post(
            "/auth/login",
            json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}
        )
        assert admin_login.status_code == 200, admin_login.text
        admin_token = admin_login.json()["access_token"]
        admin_headers = {"Authorization": f"Bearer {admin_token}"}

        # 5) Admin récupère toutes les réservations
        all_res = await ac.get("/admin/reservations/all", headers=admin_headers)
        assert all_res.status_code == 200, all_res.text
        assert any(r["id"] == reservation["id"] for r in all_res.json())

        # 6) Admin met à jour la réservation
        update_res = await ac.put(
            f"/admin/reservations/{reservation['id']}",
            json={"quantity": 2},
            headers=admin_headers
        )
        assert update_res.status_code == 200, update_res.text
        assert update_res.json()["quantity"] == 2

        # 7) Admin consulte les stats
        stats_res = await ac.get("/admin/stats", headers=admin_headers)
        assert stats_res.status_code == 200, stats_res.text
        stats = stats_res.json()
        assert "reservations" in stats
        assert "tickets" in stats
        assert "paid_tickets" in stats
        assert "revenue" in stats


        # 8) Admin supprime la réservation
        delete_res = await ac.delete(
            f"/admin/reservations/{reservation['id']}",
            headers=admin_headers
        )
        assert delete_res.status_code == 200, delete_res.text
