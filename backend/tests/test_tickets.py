import pytest
from httpx import AsyncClient, ASGITransport
import sys, os

# pour trouver main.py
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from main import app


@pytest.mark.asyncio
async def test_tickets_flow():
    """Test complet du flux de tickets"""

    test_user = {
        "username": "ticket_user",
        "email": "ticket_user@example.com",
        "password": "secret123"
    }

    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        # 1) Register
        await ac.post("/auth/register", json=test_user)

        # 2) Login
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

        # 3) Créer un ticket (⚠️ offer_id en paramètre de query)
        ticket_res = await ac.post(
            "/tickets/?offer_id=1",
            headers=headers
        )
        assert ticket_res.status_code == 200, ticket_res.text
        ticket = ticket_res.json()
        assert "id" in ticket

        # 4) Vérifier mes tickets
        my_tickets = await ac.get("/tickets/me", headers=headers)
        assert my_tickets.status_code == 200, my_tickets.text
        assert any(t["id"] == ticket["id"] for t in my_tickets.json())

        # 5) Simuler un paiement
        payment_res = await ac.post(
            "/payment/simulate",
            json={"ticket_id": ticket["id"]},
            headers=headers
        )
        assert payment_res.status_code == 200, payment_res.text
        assert payment_res.json().get("paid") is True
