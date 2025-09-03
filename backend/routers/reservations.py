from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db, SECRET_KEY, ALGORITHM
from pydantic import BaseModel
from typing import List
import models
from jose import JWTError, jwt
from fastapi.security import OAuth2PasswordBearer
from datetime import datetime, date
import os
from dotenv import load_dotenv

# Charger les variables d'environnement depuis la racine
load_dotenv('../.env')  

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")
router = APIRouter()

# Schéma Pydantic
class ReservationRequest(BaseModel):
    username: str
    email: str
    date: date  
    offre: str
    quantity: int

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

@router.post("/", response_model=dict)
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
        }
        for r in reservations
    ]

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