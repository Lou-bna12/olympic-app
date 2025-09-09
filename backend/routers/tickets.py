from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Ticket, User, Offer
from routers.auth import get_current_user
from utils import generate_random_key, generate_qr_code

router = APIRouter(prefix="/tickets", tags=["tickets"])

@router.get("/me")
async def get_my_tickets(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Récupère tous les tickets de l'utilisateur connecté
    """
    tickets = db.query(Ticket).filter(
        Ticket.user_id == current_user.id
    ).all()
    
    result = []
    for ticket in tickets:

        offer_name = ticket.offer.name if ticket.offer else "Offre inconnue"
        
        result.append({
            "id": ticket.id,
            "offer_name": offer_name,
            "amount": ticket.amount,
            "is_paid": ticket.is_paid,
            "payment_status": ticket.payment_status,
            "payment_date": ticket.payment_date,
            "qr_code": ticket.qr_code,
            "final_key": ticket.final_key,
            "is_used": ticket.is_used
        })
    
    return result

@router.post("/", response_model=dict)
async def create_ticket(
    offer_id: int,  
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Crée un ticket (système de paiement mocké)
    """

    offer = db.query(Offer).filter(
        Offer.id == offer_id,
        Offer.is_active == True
    ).first()
    
    if not offer:
        raise HTTPException(status_code=404, detail="Offre non trouvée")
    

    if offer.capacity <= 0:
        raise HTTPException(status_code=400, detail="Plus de places disponibles")

    user_key = current_user.secret_key or generate_random_key()
    reservation_key = generate_random_key()
    final_key = f"{user_key}_{reservation_key}"
    
    ticket = Ticket(
        user_id=current_user.id,
        offer_id=offer.id,
        final_key=final_key,
        qr_code=generate_qr_code(final_key),
        is_paid=False,
        payment_status="pending",
        amount=offer.price
    )
    

    offer.capacity -= 1
    
    db.add(ticket)
    db.commit()
    db.refresh(ticket)
    
    return {
        "id": ticket.id,
        "final_key": ticket.final_key,
        "qr_code": ticket.qr_code,
        "is_paid": ticket.is_paid,
        "amount": ticket.amount,
        "offer_name": offer.name,
        "message": "Ticket créé. Veuillez procéder au paiement."
    }