from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db, SECRET_KEY, ALGORITHM
import models
from jose import JWTError, jwt
from fastapi.security import OAuth2PasswordBearer
from typing import List
from pydantic import BaseModel

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")
router = APIRouter()

def get_admin_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        user = db.query(models.User).filter(models.User.email == email).first()
        if not user or not user.is_admin:
            raise HTTPException(status_code=403, detail="Accès administrateur requis")
        return user
    except JWTError:
        raise HTTPException(status_code=401, detail="Token invalide")

class AdminStats(BaseModel):
    total_reservations: int
    pending_reservations: int
    total_users: int
    revenue: float

def calculate_price(offre, quantity):
    prices = {"Solo": 25, "Duo": 50, "Familiale": 150}
    return prices.get(offre, 25) * quantity

@router.get("/stats", response_model=AdminStats)
def get_admin_stats(db: Session = Depends(get_db), admin_user: models.User = Depends(get_admin_user)):
    total_reservations = db.query(models.Reservation).count()
    pending_reservations = db.query(models.Reservation).filter(models.Reservation.status == "pending").count()
    total_users = db.query(models.User).count()
    approved_reservations = db.query(models.Reservation).filter(models.Reservation.status == "approved").all()
    revenue = sum(calculate_price(r.offre, r.quantity) for r in approved_reservations)
    return {
        "total_reservations": total_reservations,
        "pending_reservations": pending_reservations,
        "total_users": total_users,
        "revenue": revenue,
    }

@router.get("/reservations/all", response_model=List[dict])
def get_all_reservations(db: Session = Depends(get_db), admin_user: models.User = Depends(get_admin_user)):
    reservations = db.query(models.Reservation).all()
    return [
        {
            "id": r.id,
            "username": r.username,
            "email": r.email,
            "date": r.date.isoformat() if r.date else None,
            "offre": r.offre,
            "quantity": r.quantity,
            "status": getattr(r, "status", "pending"),
        }
        for r in reservations
    ]

@router.post("/reservations/{reservation_id}/approve")
def approve_reservation(reservation_id: int, db: Session = Depends(get_db), admin_user: models.User = Depends(get_admin_user)):
    reservation = db.query(models.Reservation).filter(models.Reservation.id == reservation_id).first()
    if not reservation:
        raise HTTPException(status_code=404, detail="Réservation non trouvée")
    reservation.status = "approved"
    db.commit()
    db.refresh(reservation)
    return {"message": "Réservation approuvée avec succès", "reservation": reservation}

@router.post("/reservations/{reservation_id}/reject")
def reject_reservation(reservation_id: int, db: Session = Depends(get_db), admin_user: models.User = Depends(get_admin_user)):
    reservation = db.query(models.Reservation).filter(models.Reservation.id == reservation_id).first()
    if not reservation:
        raise HTTPException(status_code=404, detail="Réservation non trouvée")
    reservation.status = "rejected"
    db.commit()
    db.refresh(reservation)
    return {"message": "Réservation rejetée avec succès", "reservation": reservation}

@router.put("/reservations/{reservation_id}")
def update_reservation(reservation_id: int, reservation_data: dict, db: Session = Depends(get_db), admin_user: models.User = Depends(get_admin_user)):
    reservation = db.query(models.Reservation).filter(models.Reservation.id == reservation_id).first()
    if not reservation:
        raise HTTPException(status_code=404, detail="Réservation non trouvée")
    for key, value in reservation_data.items():
        if hasattr(reservation, key):
            setattr(reservation, key, value)
    db.commit()
    db.refresh(reservation)
    return {"message": "Réservation modifiée avec succès", "reservation": reservation}

@router.delete("/reservations/{reservation_id}")
def delete_reservation(reservation_id: int, db: Session = Depends(get_db), admin_user: models.User = Depends(get_admin_user)):
    reservation = db.query(models.Reservation).filter(models.Reservation.id == reservation_id).first()
    if not reservation:
        raise HTTPException(status_code=404, detail="Réservation non trouvée")
    db.delete(reservation)
    db.commit()
    return {"message": "Réservation supprimée avec succès"}
