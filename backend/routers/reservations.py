from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional
from datetime import date as date_type
from pydantic import BaseModel
from io import BytesIO
import qrcode

from database import get_db
from models import Reservation, User, Ticket
from routers.auth import get_current_user

router = APIRouter(prefix="/reservations", tags=["reservations"])

# -------- Schemas --------
class ReservationCreate(BaseModel):
    date: date_type
    offer: Optional[str] = None
    offre: Optional[str] = None
    quantity: int = 1
    model_config = {"extra": "ignore"}

class ReservationUpdate(BaseModel):
    date: Optional[date_type] = None
    offer: Optional[str] = None
    offre: Optional[str] = None
    quantity: Optional[int] = None
    status: Optional[str] = None
    model_config = {"extra": "ignore"}

class ReservationOut(BaseModel):
    id: int
    user_id: int
    date: date_type
    offer: str
    quantity: int
    status: Optional[str] = None
    class Config:
        from_attributes = True  # Pydantic v2

# -------- STATS (mettre AVANT la route dynamique) --------
@router.get("/stats", name="reservations_stats")
def reservations_stats(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    total = db.query(func.count(Reservation.id))\
              .filter(Reservation.user_id == user.id).scalar() or 0
    pending = db.query(func.count(Reservation.id))\
               .filter(Reservation.user_id == user.id, Reservation.status == "pending_payment").scalar() or 0
    confirmed = db.query(func.count(Reservation.id))\
                 .filter(Reservation.user_id == user.id, Reservation.status == "confirmed").scalar() or 0
    return {"total": total, "pending": pending, "confirmed": confirmed}

# -------- LIST --------
@router.get("", response_model=List[ReservationOut], name="list_reservations")
def list_reservations(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    return (
        db.query(Reservation)
        .filter(Reservation.user_id == user.id)
        .order_by(Reservation.id.desc())
        .all()
    )

# -------- CREATE --------
@router.post("", response_model=ReservationOut, name="create_reservation")
def create_reservation(
    payload: ReservationCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    offer_value = payload.offer or payload.offre
    if not offer_value:
        raise HTTPException(status_code=422, detail="Champ 'offer' (ou 'offre') manquant")

    new_res = Reservation(
        user_id=user.id,
        date=payload.date,
        offer=offer_value,   # map vers colonne 'offre'
        quantity=payload.quantity,
        status="pending_payment",
    )
    db.add(new_res)
    db.commit()
    db.refresh(new_res)
    return new_res

# -------- DETAIL --------
@router.get("/{reservation_id:int}", response_model=ReservationOut, name="get_reservation_detail")
def get_reservation_detail(
    reservation_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    res = (
        db.query(Reservation)
        .filter(Reservation.id == reservation_id, Reservation.user_id == user.id)
        .first()
    )
    if not res:
        raise HTTPException(status_code=404, detail="Reservation not found")
    return res

# -------- UPDATE --------
@router.put("/{reservation_id:int}", response_model=ReservationOut, name="update_reservation")
def update_reservation(
    reservation_id: int,
    payload: ReservationUpdate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    res = (
        db.query(Reservation)
        .filter(Reservation.id == reservation_id, Reservation.user_id == user.id)
        .first()
    )
    if not res:
        raise HTTPException(status_code=404, detail="Reservation not found")

    if payload.date is not None:
        res.date = payload.date
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
    return res

# -------- DELETE --------
@router.delete("/{reservation_id:int}", name="delete_reservation")
def delete_reservation(
    reservation_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    res = (
        db.query(Reservation)
        .filter(Reservation.id == reservation_id, Reservation.user_id == user.id)
        .first()
    )
    if not res:
        raise HTTPException(status_code=404, detail="Reservation not found")

    db.delete(res)
    db.commit()
    return {"message": "Reservation deleted"}

# -------- QR CODE PNG (pour <img src="/reservations/{id}/qrcode">) --------
@router.get("/{reservation_id:int}/qrcode", name="reservation_qrcode")
def reservation_qrcode(
    reservation_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    # chercher un ticket payé lié à cette réservation et à l'utilisateur
    t = (
        db.query(Ticket)
        .filter(Ticket.reservation_id == reservation_id, Ticket.user_id == user.id)
        .order_by(Ticket.id.desc())
        .first()
    )
    if not t or not t.is_paid or not t.qr_code:
        # pas de ticket, ou non payé, ou pas de payload → pas d'image
        raise HTTPException(status_code=404, detail="QR indisponible pour cette réservation")

    img = qrcode.make(t.qr_code)
    buf = BytesIO()
    img.save(buf, format="PNG")
    buf.seek(0)
    return StreamingResponse(buf, media_type="image/png")
