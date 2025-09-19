from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from pydantic import BaseModel
from database import get_db
from models import Reservation, Offer, Ticket, User
from routers.auth import get_current_user

router = APIRouter(prefix="/admin", tags=["admin"])


# SCHEMAS
class OfferCreate(BaseModel):
    name: str
    description: str
    price: float
    capacity: int
    is_active: bool = True


class OfferUpdate(BaseModel):
    name: str | None = None
    description: str | None = None
    price: float | None = None
    capacity: int | None = None
    is_active: bool | None = None


# ROUTES OFFRES
@router.get("/offers", summary="Get all offers")
def get_offers(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return db.query(Offer).all()


@router.post("/offers", summary="Create new offer")
def create_offer(payload: OfferCreate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    offer = Offer(**payload.dict())
    db.add(offer)
    db.commit()
    db.refresh(offer)
    return offer


@router.put("/offers/{offer_id}", summary="Update offer")
def update_offer(offer_id: int, payload: OfferUpdate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    offer = db.query(Offer).filter(Offer.id == offer_id).first()
    if not offer:
        raise HTTPException(status_code=404, detail="Offer not found")

    for field, value in payload.dict(exclude_unset=True).items():
        setattr(offer, field, value)

    db.commit()
    db.refresh(offer)
    return offer


@router.delete("/offers/{offer_id}", summary="Delete offer")
def delete_offer(offer_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    offer = db.query(Offer).filter(Offer.id == offer_id).first()
    if not offer:
        raise HTTPException(status_code=404, detail="Offer not found")

    db.delete(offer)
    db.commit()
    return {"status": "deleted"}


@router.get("/offers/stats", summary="Get offers statistics")
def offers_stats(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    """
    Retourne les stats : nb réservations, nb tickets, revenu total
    """
    stats = (
        db.query(
            Offer.name.label("offer"),
            func.count(Reservation.id).label("reservations"),
            func.count(Ticket.id).label("tickets"),
            func.coalesce(func.sum(Ticket.amount), 0).label("revenu")
        )
        .outerjoin(Ticket, Ticket.offer_id == Offer.id)
        .outerjoin(Reservation, Reservation.id == Ticket.reservation_id)
        .group_by(Offer.id)
        .all()
    )

    return [
        {
            "offer": s.offer,
            "reservations": int(s.reservations),
            "tickets": int(s.tickets),
            "revenu": float(s.revenu),
        }
        for s in stats
    ]


# ROUTES RESERVATIONS
@router.get("/reservations/all", summary="Get all reservations")
def get_all_reservations(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return db.query(Reservation).all()


@router.delete("/reservations/{reservation_id}", summary="Delete reservation")
def admin_delete_reservation(reservation_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    reservation = db.query(Reservation).filter(Reservation.id == reservation_id).first()
    if not reservation:
        raise HTTPException(status_code=404, detail="Reservation not found")

    # Supprimer d'abord les tickets liés
    db.query(Ticket).filter(Ticket.reservation_id == reservation.id).delete()

    db.delete(reservation)
    db.commit()
    return {"status": "deleted"}
