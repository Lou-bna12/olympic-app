from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import models
from routers.auth import get_current_user

router = APIRouter()

# --- Créer un ticket ---
@router.post("/tickets/")
def create_ticket(
    offer_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    offer = db.query(models.Offer).filter(models.Offer.id == offer_id).first()
    if not offer:
        raise HTTPException(status_code=404, detail="Offer not found")

    ticket = models.Ticket(
        user_id=current_user.id,
        offer_id=offer.id,
        amount=offer.price
    )
    db.add(ticket)
    db.commit()
    db.refresh(ticket)
    return ticket


# --- Récupérer les tickets de l'utilisateur connecté ---
@router.get("/tickets/me")
def get_my_tickets(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    return db.query(models.Ticket).filter(models.Ticket.user_id == current_user.id).all()


# --- Supprimer un ticket ---
@router.delete("/tickets/{ticket_id}")
def delete_ticket(
    ticket_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    ticket = db.query(models.Ticket).filter(
        models.Ticket.id == ticket_id,
        models.Ticket.user_id == current_user.id
    ).first()

    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")

    db.delete(ticket)
    db.commit()
    return {"message": "Ticket deleted successfully"}