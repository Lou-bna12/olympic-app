from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Ticket, User, Offer
from routers.auth import get_current_user
from utils import generate_random_key, generate_qr_code

router = APIRouter(prefix="/tickets", tags=["tickets"])

@router.post("/", response_model=dict)
async def create_ticket(
    offer_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Crée un ticket (système de paiement mocké)
    """
    # Vérifier l'offre
    offer = db.query(Offer).filter(
        Offer.id == offer_id,
        Offer.is_active == True
    ).first()
    
    if not offer:
        raise HTTPException(status_code=404, detail="Offre non trouvée")
    
    # Vérifier le stock
    if offer.capacity <= 0:
        raise HTTPException(status_code=400, detail="Plus de places disponibles")
    
    # Générer les clés
    user_key = current_user.secret_key or generate_random_key()
    reservation_key = generate_random_key()
    final_key = f"{user_key}_{reservation_key}"
    
    # Créer le ticket NON PAYÉ
    ticket = Ticket(
        user_id=current_user.id,
        offer_id=offer.id,
        final_key=final_key,
        qr_code=generate_qr_code(final_key),
        is_paid=False,
        payment_status="pending",
        amount=offer.price
    )
    
    # Réduire la capacité de l'offre
    offer.capacity -= 1
    
    db.add(ticket)
    db.commit()
    db.refresh(ticket)
    
    return {
        "ticket_id": ticket.id,
        "final_key": ticket.final_key,
        "qr_code": ticket.qr_code,
        "is_paid": ticket.is_paid,
        "amount": ticket.amount,
        "offer_name": offer.name,
        "message": "Ticket créé. Veuillez procéder au paiement."
    }