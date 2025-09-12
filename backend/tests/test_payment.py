import pytest
from httpx import AsyncClient, ASGITransport
import sys, os

# pour trouver main.py
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from main import app


@pytest.mark.asyncio
async def test_payment_flow():
    """Test complet du paiement"""

    test_user = {
        "username": "pay_user",
        "email": "pay_user@example.com",
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

        # 3) Créer un ticket (offre id=1 doit exister)
        ticket_res = await ac.post("/tickets/?offer_id=1", headers=headers)
        assert ticket_res.status_code == 200, ticket_res.text
        ticket = ticket_res.json()
        assert ticket["is_paid"] is False

        # 4) Simuler le paiement
        pay_res = await ac.post(
            "/payment/simulate",
            json={"ticket_id": ticket["id"]},
            headers=headers
        )
        assert pay_res.status_code == 200, pay_res.text
        pay_data = pay_res.json()
        assert pay_data["paid"] is True
        assert "qr_payload" in pay_data

        # 5) Vérifier que le ticket est bien marqué payé
        my_tickets = await ac.get("/tickets/me", headers=headers)
        assert my_tickets.status_code == 200
        updated_ticket = next(t for t in my_tickets.json() if t["id"] == ticket["id"])
        assert updated_ticket["is_paid"] is True
