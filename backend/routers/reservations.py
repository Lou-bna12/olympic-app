from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db, SECRET_KEY, ALGORITHM
from pydantic import BaseModel
from typing import List, Optional
import models
from jose import JWTError, jwt
from fastapi.security import OAuth2PasswordBearer
from datetime import datetime
from datetime import date as date_type  
import os
from dotenv import load_dotenv
import qrcode
from io import BytesIO
import base64
from fastapi.responses import JSONResponse

# Charger les variables d'environnement depuis la racine
load_dotenv('../.env')  

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")
router = APIRouter()

# Schéma Pydantic
class ReservationRequest(BaseModel):
    username: str
    email: str
    date: date_type  
    offre: str
    quantity: int

class ReservationUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[str] = None
    date: Optional[date_type] = None  
    offre: Optional[str] = None
    quantity: Optional[int] = None

# Décode le token et récupère l'email
def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Token invalide")
    except JWTError:
        raise HTTPException(status_code=401, detail="Token invalide")

    user = db.query(models.User).filter(models.User.email == email).first()
    if user is None:
        raise HTTPException(status_code=404, detail="Utilisateur non trouvé")
    return user

@router.post("", response_model=dict)
def create_reservation(
    request: ReservationRequest,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    reservation = models.Reservation(
        username=request.username,
        email=request.email,
        date=request.date,
        offre=request.offre,
        quantity=request.quantity,
        user_id=current_user.id,
    )
    db.add(reservation)
    db.commit()
    db.refresh(reservation)
    return {"message": "Réservation créée avec succès 🎉", "id": reservation.id}

@router.get("/me", response_model=List[dict])
def get_my_reservations(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    reservations = db.query(models.Reservation).filter(
        models.Reservation.user_id == current_user.id
    ).all()
    
    return [
        {
            "id": r.id,
            "username": r.username,
            "email": r.email,
            "date": r.date.isoformat() if r.date else None,
            "offre": r.offre,
            "quantity": r.quantity,
            "status": r.status
        }
        for r in reservations
    ]

@router.put("/{reservation_id}", response_model=dict)
def update_reservation(
    reservation_id: int,
    request: ReservationUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    reservation = db.query(models.Reservation).filter(
        models.Reservation.id == reservation_id,
        models.Reservation.user_id == current_user.id
    ).first()
    
    if not reservation:
        raise HTTPException(status_code=404, detail="Réservation non trouvée")
    
    # Mettre à jour seulement les champs fournis
    if request.username is not None:
        reservation.username = request.username
    if request.email is not None:
        reservation.email = request.email
    if request.date is not None:
        reservation.date = request.date
    if request.offre is not None:
        reservation.offre = request.offre
    if request.quantity is not None:
        reservation.quantity = request.quantity
    
    db.commit()
    db.refresh(reservation)
    
    return {"message": "Réservation modifiée avec succès ✅", "id": reservation.id}

@router.delete("/{reservation_id}", response_model=dict)
def delete_reservation(
    reservation_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    reservation = db.query(models.Reservation).filter(
        models.Reservation.id == reservation_id,
        models.Reservation.user_id == current_user.id
    ).first()
    
    if not reservation:
        raise HTTPException(status_code=404, detail="Réservation non trouvée")
    
    db.delete(reservation)
    db.commit()
    
    return {"message": "Réservation supprimée avec succès 🗑️", "id": reservation_id}

@router.get("/{reservation_id}/qrcode", response_model=dict)
def get_reservation_qrcode(
    reservation_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    reservation = db.query(models.Reservation).filter(
        models.Reservation.id == reservation_id,
        models.Reservation.user_id == current_user.id
    ).first()
    
    if not reservation:
        raise HTTPException(status_code=404, detail="Réservation non trouvée")
    
    # Créer les données pour le QR Code
    qr_data = f"""
    RÉSERVATION OLYMPIC GAMES
    --------------------------
    ID: {reservation.id}
    Nom: {reservation.username}
    Email: {reservation.email}
    Date: {reservation.date}
    Offre: {reservation.offre}
    Quantité: {reservation.quantity}
    Statut: {reservation.status}
    --------------------------
    Merci pour votre réservation !
    """
    
    # Générer le QR Code
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=10,
        border=4,
    )
    qr.add_data(qr_data)
    qr.make(fit=True)
    
    img = qr.make_image(fill_color="black", back_color="white")
    
    # Convertir en base64
    buffered = BytesIO()
    img.save(buffered, format="PNG")
    qr_code_base64 = base64.b64encode(buffered.getvalue()).decode()
    
    return {
        "qr_code": f"data:image/png;base64,{qr_code_base64}",
        "reservation_data": {
            "id": reservation.id,
            "username": reservation.username,
            "email": reservation.email,
            "date": reservation.date.isoformat(),
            "offre": reservation.offre,
            "quantity": reservation.quantity,
            "status": reservation.status
        }
    }

@router.get("/stats", response_model=dict)
def get_reservation_stats(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    reservations = db.query(models.Reservation).filter(
        models.Reservation.user_id == current_user.id
    ).all()
    
    total_reservations = len(reservations)
    
    today = datetime.now().date()
    upcoming_reservations = [
        r for r in reservations 
        if r.date and r.date >= today
    ]
    
    next_reservation = None
    if upcoming_reservations:
        next_reservation = min(upcoming_reservations, key=lambda x: x.date)
    
    return {
        "total_reservations": total_reservations,
        "next_reservation_date": next_reservation.date.isoformat() if next_reservation else None,
        "next_reservation_offre": next_reservation.offre if next_reservation else None,
        "active_reservations": len(upcoming_reservations)
    }