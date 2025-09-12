from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional

from database import get_db
import models
from routers.auth import get_current_user
from models import User

router = APIRouter(prefix="/tickets", tags=["tickets"])

class CreateTicketBody(BaseModel):
    reservation_id: Optional[int] = None
    amount: Optional[float] = 0.0

@router.post("/", name="create_ticket")
def create_ticket(
    body: Optional[CreateTicketBody] = None,  
    offer_id: int = Query(..., description="Offer ID"),
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    
    reservation_id = body.reservation_id if body else None
    amount = (body.amount if body and body.amount is not None else 0.0)


    if reservation_id is not None:
        res = db.query(models.Reservation).filter(models.Reservation.id == reservation_id).first()
        if not res:
            raise HTTPException(status_code=404, detail="Reservation not found")

    ticket = models.Ticket(
        user_id=user.id,
        offer_id=offer_id,
        reservation_id=reservation_id,
        final_key=None,
        qr_code=None,         
        is_used=False,
        is_paid=False,
        payment_status="pending",
        payment_date=None,
        amount=amount,
    )
    db.add(ticket)
    db.commit()
    db.refresh(ticket)

    return {
        "id": ticket.id,
        "offer_id": ticket.offer_id,
        "reservation_id": ticket.reservation_id,
        "is_paid": ticket.is_paid,
        "payment_status": ticket.payment_status,
        "qr_code": ticket.qr_code,  # None tant que non payé
    }

@router.get("/me", name="get_my_tickets")
def get_my_tickets(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    tickets = db.query(models.Ticket).filter(models.Ticket.user_id == user.id).all()
    return [
        {
            "id": t.id,
            "offer_id": t.offer_id,
            "reservation_id": t.reservation_id,
            "is_paid": t.is_paid,
            "payment_status": t.payment_status,
            "qr_code": t.qr_code if t.is_paid else None,
            "final_key": t.final_key if t.is_paid else None,
        }
        for t in tickets
    ]


@router.delete("/{ticket_id}", name="delete_ticket")
def delete_ticket(
    ticket_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    ticket = (
        db.query(models.Ticket)
        .filter(models.Ticket.id == ticket_id, models.Ticket.user_id == user.id)
        .first()
    )
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")

    db.delete(ticket)
    db.commit()
    return {"message": "Ticket deleted"}

