from datetime import datetime
from uuid import uuid4

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from database import get_db
from models import Ticket, Reservation, User, Offer
from routers.auth import get_current_user

router = APIRouter(prefix="/payment", tags=["payment"])

class PaymentSimulation(BaseModel):
    ticket_id: int | None = None
    reservation_id: int | None = None

@router.post("/simulate", summary="Simulate Payment (+ QR activation)")
def simulate_payment(
    payload: PaymentSimulation,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    ticket: Ticket | None = None

    if payload.ticket_id is not None:
        ticket = (
            db.query(Ticket)
            .filter(Ticket.id == payload.ticket_id, Ticket.user_id == user.id)
            .first()
        )
        if not ticket:
            raise HTTPException(status_code=404, detail="Ticket non trouvé")

    elif payload.reservation_id is not None:
        # 1) réservation (appartenance)
        res = (
            db.query(Reservation)
            .filter(Reservation.id == payload.reservation_id, Reservation.user_id == user.id)
            .first()
        )
        if not res:
            raise HTTPException(status_code=404, detail="Reservation not found")

        # 2) ticket existant lié à la réservation
        ticket = (
            db.query(Ticket)
            .filter(Ticket.reservation_id == res.id, Ticket.user_id == user.id)
            .order_by(Ticket.id.desc())
            .first()
        )

        # 3) auto-création si absent
        if not ticket:
            offer = db.query(Offer).filter(Offer.name.ilike(res.offer)).first()
            offer_id = offer.id if offer else 1  # fallback offre "Solo" (id=1)
            ticket = Ticket(
                user_id=user.id,
                offer_id=offer_id,
                reservation_id=res.id,
                final_key=None,
                qr_code=None,
                is_used=False,
                is_paid=False,
                payment_status="pending",
                payment_date=None,
                amount=0.0,
            )
            db.add(ticket)
            db.flush()  # pour obtenir ticket.id sans commit

    else:
        raise HTTPException(status_code=400, detail="ticket_id ou reservation_id requis")

    # 4) marquer payé + final_key + QR payload
    if not ticket.final_key:
        ticket.final_key = f"T{user.id}-{ticket.offer_id}-{uuid4().hex[:10]}"

    ticket.is_paid = True
    ticket.payment_status = "paid"
    ticket.payment_date = datetime.utcnow()

    qr_payload = f"OLY-{ticket.id}-{ticket.final_key}"
    ticket.qr_code = qr_payload

    # 5) statut de la réservation liée
    if ticket.reservation_id:
        res = db.query(Reservation).filter(Reservation.id == ticket.reservation_id).first()
        if res and res.user_id == user.id:
            res.status = "confirmed"

    db.commit()
    db.refresh(ticket)

    return {
        "status": "ok",
        "ticket_id": ticket.id,
        "reservation_id": ticket.reservation_id,
        "payment_status": ticket.payment_status,
        "paid": ticket.is_paid,
        "qr_payload": ticket.qr_code,
        "amount": ticket.amount,
        "payment_date": ticket.payment_date.isoformat() if ticket.payment_date else None,
    }