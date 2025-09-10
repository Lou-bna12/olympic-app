from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime

from database import get_db
from models import Ticket, User
from schemas import PaymentSimulation, PaymentResponse

from .auth import get_current_user

router = APIRouter(tags=["payment"])

@router.post("/simulate", response_model=PaymentResponse)
async def simulate_payment(
    payment_data: PaymentSimulation,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    

    ticket = db.query(Ticket).filter(
        Ticket.id == payment_data.ticket_id,
        Ticket.user_id == current_user.id
    ).first()

    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket non trouvé")

    if ticket.is_paid:
        raise HTTPException(status_code=400, detail="Ticket déjà payé")

    # Simulation : le paiement réussit
    ticket.is_paid = True
    ticket.payment_status = "completed"
    ticket.payment_date = datetime.now()

    # Si le montant est 0, une valeur par défaut
    if ticket.amount == 0:
        ticket.amount = 50.0  # Ou récupérer le prix depuis l'offre

    db.commit()
    db.refresh(ticket)

    return {
        "status": "success",
        "message": "Paiement effectué avec succès",
        "ticket_id": ticket.id,
        "amount": ticket.amount,
        "payment_date": ticket.payment_date
    }