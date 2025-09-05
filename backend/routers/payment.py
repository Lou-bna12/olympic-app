from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
from database import get_db
from models import Ticket, User
from schemas import PaymentSimulation, PaymentResponse
from routers.auth import get_current_user

router = APIRouter(prefix="/payment", tags=["payment"])

@router.post("/simulate", response_model=PaymentResponse)
async def simulate_payment(
    payment_data: PaymentSimulation,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Simule un processus de paiement pour un ticket
    """
    # Trouver le ticket
    ticket = db.query(Ticket).filter(
        Ticket.id == payment_data.ticket_id,
        Ticket.user_id == current_user.id
    ).first()
    
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket non trouvé")
    
    if ticket.is_paid:
        raise HTTPException(status_code=400, detail="Ticket déjà payé")
    
    # SIMULATION DU PAIEMENT 
    ticket.is_paid = True
    ticket.payment_status = "completed"
    ticket.payment_date = datetime.now()
    
    # Mettre à jour le montant si nécessaire
    if ticket.offer and ticket.amount == 0:
        ticket.amount = ticket.offer.price
    
    db.commit()
    db.refresh(ticket)
    
    return {
        "status": "success",
        "message": "Paiement simulé avec succès",
        "ticket_id": ticket.id,
        "amount": ticket.amount,
        "payment_date": ticket.payment_date
    }

@router.get("/tickets/{ticket_id}/status")
async def get_payment_status(
    ticket_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Récupère le statut de paiement d'un ticket
    """
    ticket = db.query(Ticket).filter(
        Ticket.id == ticket_id,
        Ticket.user_id == current_user.id
    ).first()
    
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket non trouvé")
    
    return {
        "ticket_id": ticket.id,
        "is_paid": ticket.is_paid,
        "payment_status": ticket.payment_status,
        "payment_date": ticket.payment_date,
        "amount": ticket.amount
    }