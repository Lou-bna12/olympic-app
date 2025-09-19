from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from pydantic import BaseModel
import models
from routers.auth import get_current_user
from fastapi.responses import StreamingResponse
from datetime import date as date_type
import io
import qrcode

router = APIRouter()

# ------------------ Schemas ------------------

class ReservationRequest(BaseModel):
    username: str
    email: str
    date: date_type
    offre: str  # ← CORRIGÉ: "offer" → "offre"
    quantity: int

class ReservationUpdate(BaseModel):
    quantity: int

# ------------------ Endpoints ------------------

@router.post("/reservations")
def create_reservation(
    request: ReservationRequest,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    # Normaliser l'offre (Solo, Duo, Familiale)
    normalized_offer = request.offre.strip().capitalize()  # ← CORRIGÉ: request.offer → request.offre

    reservation = models.Reservation(
        user_id=current_user.id,
        date=request.date,
        offer=normalized_offer, 
        quantity=request.quantity,
        status="pending_payment"
    )

    db.add(reservation)
    db.commit()
    db.refresh(reservation)
    return reservation


@router.get("/reservations")
def list_reservations(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    return db.query(models.Reservation).filter(
        models.Reservation.user_id == current_user.id
    ).all()


@router.put("/reservations/{reservation_id}")
def update_reservation(
    reservation_id: int,
    update: ReservationUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    reservation = db.query(models.Reservation).filter(
        models.Reservation.id == reservation_id,
        models.Reservation.user_id == current_user.id
    ).first()

    if not reservation:
        raise HTTPException(status_code=404, detail="Réservation introuvable")

    reservation.quantity = update.quantity
    db.commit()
    db.refresh(reservation)
    return reservation


@router.delete("/reservations/{reservation_id}")
def delete_reservation(
    reservation_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    reservation = db.query(models.Reservation).filter(
        models.Reservation.id == reservation_id,
        models.Reservation.user_id == current_user.id
    ).first()

    if not reservation:
        raise HTTPException(status_code=404, detail="Réservation introuvable")

    # Supprimer les tickets liés avant la réservation
    db.query(models.Ticket).filter(
        models.Ticket.reservation_id == reservation.id
    ).delete()

    db.delete(reservation)
    db.commit()
    return {"message": "Réservation supprimée"}


# ----------- QR Code d'une réservation -----------
@router.get("/reservations/{reservation_id}/qrcode")
def get_reservation_qrcode(
    reservation_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    reservation = db.query(models.Reservation).filter(
        models.Reservation.id == reservation_id,
        models.Reservation.user_id == current_user.id
    ).first()

    if not reservation:
        raise HTTPException(status_code=404, detail="Réservation introuvable")

    ticket = db.query(models.Ticket).filter(
        models.Ticket.reservation_id == reservation_id
    ).first()

    if not ticket or not ticket.qr_code:
        raise HTTPException(status_code=404, detail="QR code introuvable")

    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=10,
        border=4,
    )
    qr.add_data(ticket.qr_code)
    qr.make(fit=True)

    img = qr.make_image(fill_color="black", back_color="white")
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    buf.seek(0)

    return StreamingResponse(buf, media_type="image/png")


# ----------- Stats réservations -----------
@router.get("/reservations/stats")
def stats_reservations(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    total_reservations = db.query(models.Reservation).filter(
        models.Reservation.user_id == current_user.id
    ).count()
    total_tickets = db.query(models.Ticket).filter(
        models.Ticket.user_id == current_user.id
    ).count()
    total_paid = db.query(models.Ticket).filter(
        models.Ticket.user_id == current_user.id,
        models.Ticket.is_paid == True
    ).count()

    return {
        "reservations": total_reservations,
        "tickets": total_tickets,
        "paid_tickets": total_paid
    }