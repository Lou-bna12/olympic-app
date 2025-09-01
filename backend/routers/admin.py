from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db, SECRET_KEY, ALGORITHM
import models
from jose import JWTError, jwt
from fastapi.security import OAuth2PasswordBearer
from datetime import datetime
from typing import List
import qrcode
import io
import base64
from pydantic import BaseModel

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")
router = APIRouter()

# Vérifier si l'utilisateur est admin
def get_admin_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        user = db.query(models.User).filter(models.User.email == email).first()

        if not user or not getattr(user, 'is_admin', False):
            raise HTTPException(status_code=403, detail="Accès administrateur requis")
        return user
    except JWTError:
        raise HTTPException(status_code=401, detail="Token invalide")

# Schéma pour les statistiques
class AdminStats(BaseModel):
    total_reservations: int
    pending_reservations: int
    total_users: int
    revenue: float

@router.get("/stats", response_model=AdminStats)
def get_admin_stats(
    db: Session = Depends(get_db),
    admin_user: models.User = Depends(get_admin_user)
):
    total_reservations = db.query(models.Reservation).count()
    pending_reservations = db.query(models.Reservation).filter(
        models.Reservation.status == "pending"
    ).count()
    total_users = db.query(models.User).count()
    
    # Calcul du revenue (exemple)
    revenue = db.query(models.Reservation).filter(
        models.Reservation.status == "approved"
    ).count() * 70
    
    return {
        "total_reservations": total_reservations,
        "pending_reservations": pending_reservations,
        "total_users": total_users,
        "revenue": revenue
    }

@router.get("/reservations/all", response_model=List[dict])
def get_all_reservations(
    db: Session = Depends(get_db),
    admin_user: models.User = Depends(get_admin_user)
):
    reservations = db.query(models.Reservation).all()
    return [
        {
            "id": r.id,
            "username": r.username,
            "email": r.email,
            "date": r.date.isoformat() if r.date else None,
            "offre": r.offre,
            "quantity": r.quantity,
            "status": getattr(r, 'status', 'pending')
        }
        for r in reservations
    ]

@router.post("/reservations/{reservation_id}/approve")
def approve_reservation(
    reservation_id: int,
    db: Session = Depends(get_db),
    admin_user: models.User = Depends(get_admin_user)
):
    reservation = db.query(models.Reservation).filter(
        models.Reservation.id == reservation_id
    ).first()
    
    if not reservation:
        raise HTTPException(status_code=404, detail="Réservation non trouvée")
    
    # Mettre à jour le statut
    reservation.status = "approved"
    db.commit()
    db.refresh(reservation)
    
    return {"message": "Réservation approuvée"}

@router.get("/reservations/{reservation_id}/qrcode")
def generate_qrcode(
    reservation_id: int,
    db: Session = Depends(get_db),
    admin_user: models.User = Depends(get_admin_user)
):
    reservation = db.query(models.Reservation).filter(
        models.Reservation.id == reservation_id
    ).first()
    
    if not reservation:
        raise HTTPException(status_code=404, detail="Réservation non trouvée")
    
    # Création du QR code
    qr_data = f"RESERVATION:{reservation_id}:{reservation.email}:{reservation.date}"
    qr = qrcode.QRCode(version=1, box_size=10, border=5)
    qr.add_data(qr_data)
    qr.make(fit=True)
    
    img = qr.make_image(fill_color="black", back_color="white")
    
    # Conversion en base64
    buffered = io.BytesIO()
    img.save(buffered, format="PNG")
    img_str = base64.b64encode(buffered.getvalue()).decode()
    
    return {
        "qrcode": f"data:image/png;base64,{img_str}",
        "reservation_id": reservation_id
    }