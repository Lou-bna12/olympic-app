from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from database import get_db
from models import Ticket, User, Offer, Reservation


try:
    from .auth import get_current_user  # Import relatif
except ImportError:
    from routers.auth import get_current_user  # Import absolu

import secrets
import qrcode
import io
import base64

router = APIRouter(prefix="/tickets", tags=["tickets"])

def generate_random_key() -> str:
    return secrets.token_hex(12)

def generate_qr_code(data: str) -> str:
    img = qrcode.make(data)
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    buf.seek(0)
    b64 = base64.b64encode(buf.read()).decode("ascii")
    return f"data:image/png;base64,{b64}"

@router.get("/me")
def get_my_tickets(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    tickets = db.query(Ticket).filter(Ticket.user_id == current_user.id).all()
    out = []
    for t in tickets:
        offer_name = t.offer.name if t.offer else "Offre inconnue"
        out.append({
            "id": t.id,
            "offer_name": offer_name,
            "amount": t.amount,
            "is_paid": t.is_paid,
            "payment_status": t.payment_status,
            "payment_date": t.payment_date,
            "qr_code": t.qr_code if t.is_paid else None,
            "final_key": t.final_key,
            "is_used": t.is_used,
        })
    return out

def create_ticket(
    offer_id: int = Query(..., description="ID de l'offre"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    # Vérifie l'offre
    offer = db.query(Offer).filter(Offer.id == offer_id, Offer.is_active == True).first()
    if not offer:
        raise HTTPException(status_code=404, detail="Offre non trouvée")
    
    if offer.capacity <= 0:
        raise HTTPException(status_code=400, detail="Plus de places disponibles")

    # Clés & QR
    final_key = f"{current_user.id}_{secrets.token_hex(8)}"
    qr_data = f"TICKET:{final_key}|USER:{current_user.id}|OFFER:{offer_id}"

    ticket = Ticket(
        user_id=current_user.id,
        offer_id=offer.id,
        final_key=final_key,
        qr_code=generate_qr_code(qr_data),
        is_paid=False,
        payment_status="pending",
        amount=offer.price,
    )

    offer.capacity -= 1

    db.add(ticket)
    db.commit()
    db.refresh(ticket)

    return {
        "id": ticket.id,
        "final_key": ticket.final_key,
        "qr_code": None,
        "is_paid": ticket.is_paid,
        "amount": ticket.amount,
        "offer_name": offer.name,
        "message": "Ticket créé. Veuillez procéder au paiement.",
    }