from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional
from datetime import date as date_type
from pydantic import BaseModel

from database import get_db
from models import User, Reservation, Ticket
from routers.auth import get_current_user

router = APIRouter(prefix="/admin", tags=["admin"])


def require_admin(user: User = Depends(get_current_user)) -> User:
    if not getattr(user, "is_admin", False):
        raise HTTPException(status_code=403, detail="Admin only")
    return user

#Schemas
class AdminReservationUpdate(BaseModel):
    date: Optional[date_type] = None
    offer: Optional[str] = None   # accepte 'offer'
    offre: Optional[str] = None   # accepte 'offre'
    quantity: Optional[int] = None
    status: Optional[str] = None

# STATS
@router.get("/stats", name="admin_stats")
def admin_stats(db: Session = Depends(get_db), _: User = Depends(require_admin)):
    users = db.query(func.count(User.id)).scalar() or 0
    reservations = db.query(func.count(Reservation.id)).scalar() or 0
    tickets = db.query(func.count(Ticket.id)).scalar() or 0
    paid_tickets = db.query(func.count(Ticket.id)).filter(Ticket.is_paid == True).scalar() or 0
    revenue = db.query(func.coalesce(func.sum(Ticket.amount), 0.0)).filter(Ticket.is_paid == True).scalar() or 0.0
    return {"users": users, "reservations": reservations, "tickets": tickets,
            "paid_tickets": paid_tickets, "revenue": float(revenue)}

# LIST ALL RESERVATIONS
@router.get("/reservations/all", name="admin_reservations_all")
def admin_reservations_all(db: Session = Depends(get_db), _: User = Depends(require_admin)) -> List[dict]:
    rows = (
        db.query(Reservation, User.username, User.email)
        .join(User, Reservation.user_id == User.id)
        .order_by(Reservation.id.desc())
        .all()
    )
    out = []
    for res, username, email in rows:
        ticket = (
            db.query(Ticket)
            .filter(Ticket.reservation_id == res.id)
            .order_by(Ticket.id.desc())
            .first()
        )
        out.append({
            "id": res.id,
            "user_id": res.user_id,
            "username": username,
            "email": email,
            "date": res.date,
            "offer": res.offer,
            "quantity": res.quantity,
            "status": res.status,
            "ticket_id": ticket.id if ticket else None,
            "paid": bool(ticket.is_paid) if ticket else False,
        })
    return out

# UPDATE (PUT)
@router.put("/reservations/{reservation_id}", name="admin_update_reservation")
def admin_update_reservation(
    reservation_id: int,
    payload: AdminReservationUpdate,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    res = db.query(Reservation).filter(Reservation.id == reservation_id).first()
    if not res:
        raise HTTPException(status_code=404, detail="Reservation not found")

    if payload.date is not None:
        res.date = payload.date
    # prend 'offer' ou 'offre' depuis le front
    if payload.offer is not None:
        res.offer = payload.offer
    if payload.offre is not None:
        res.offer = payload.offre
    if payload.quantity is not None:
        res.quantity = payload.quantity
    if payload.status is not None:
        res.status = payload.status

    db.commit()
    db.refresh(res)
    return {
        "id": res.id, "user_id": res.user_id, "date": res.date,
        "offer": res.offer, "quantity": res.quantity, "status": res.status,
    }

# DELETE
@router.delete("/reservations/{reservation_id}", name="admin_delete_reservation")
def admin_delete_reservation(
    reservation_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    res = db.query(Reservation).filter(Reservation.id == reservation_id).first()
    if not res:
        raise HTTPException(status_code=404, detail="Reservation not found")
    db.delete(res)
    db.commit()
    return {"message": "Reservation deleted"}
