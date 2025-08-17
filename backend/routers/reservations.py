from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from pydantic import BaseModel
from typing import List
import models
from jose import JWTError, jwt
from fastapi.security import OAuth2PasswordBearer

# même clé que dans auth.py
SECRET_KEY = "supersecretkey"
ALGORITHM = "HS256"

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

router = APIRouter()

# Schéma Pydantic
class ReservationRequest(BaseModel):
    nom: str
    prenom: str
    date: str
    offer: str
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
        nom=request.nom,
        prenom=request.prenom,
        email=current_user.email,  # récupéré automatiquement
        date=request.date,
        offer=request.offer,
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
    reservations = db.query(models.Reservation).filter(models.Reservation.user_id == current_user.id).all()
    return [
        {
            "id": r.id,
            "nom": r.nom,
            "prenom": r.prenom,
            "email": r.email,
            "date": r.date,
            "offer": r.offer,
            "quantity": r.quantity,
        }
        for r in reservations
    ]
