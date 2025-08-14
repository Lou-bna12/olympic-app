from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, ConfigDict
from sqlalchemy import create_engine, Column, Integer, String, Float, func
from sqlalchemy.orm import sessionmaker, declarative_base
from typing import Optional, List
import os

DB_URL = os.getenv(
    "DATABASE_URL",
    "postgresql+psycopg2://postgres:loubna12@localhost:5432/reservations_db",
)

engine = create_engine(DB_URL, echo=True, future=True)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)
Base = declarative_base()

# --- Modèle SQLAlchemy ---
class Reservation(Base):
    __tablename__ = "reservations"
    id = Column(Integer, primary_key=True, index=True)
    offre = Column(String, index=True, nullable=False)
    quantite = Column(Integer, nullable=False)
    prix_total = Column(Float, nullable=False)
    email = Column(String, index=True, nullable=False)

Base.metadata.create_all(bind=engine)

app = FastAPI()

# CORS pour le front React
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Pydantic Schemas ---
class ReservationCreate(BaseModel):
    offre: str
    quantite: int
    prix_total: float
    email: str

class ReservationOut(BaseModel):
    id: int
    offre: str
    quantite: int
    prix_total: float
    email: str

    model_config = ConfigDict(from_attributes=True)

# schéma pour PATCH
class ReservationUpdate(BaseModel):
    offre: Optional[str] = None
    quantite: Optional[int] = None
    prix_total: Optional[float] = None  # sera recalculé si non fourni

# prix unitaires
PRICES = {"solo": 25, "duo": 50, "familiale": 150}

@app.get("/ping")
def ping():
    return {"status": "ok"}

# --- Créer ---
@app.post("/reservations/", response_model=ReservationOut)
def create_reservation(payload: ReservationCreate):
    with SessionLocal() as db:
        r = Reservation(**payload.model_dump())
        db.add(r)
        db.commit()
        db.refresh(r)
        return r

# --- Lire une réservation ---
@app.get("/reservations/{reservation_id}", response_model=ReservationOut)
def read_reservation(reservation_id: int):
    with SessionLocal() as db:
        r = db.query(Reservation).filter(Reservation.id == reservation_id).first()
        if not r:
            raise HTTPException(status_code=404, detail="Reservation not found")
        return r

# --- Lister (insensible à la casse pour email, et filtre par offre) ---
@app.get("/reservations/", response_model=List[ReservationOut])
def list_reservations(email: Optional[str] = None, offre: Optional[str] = None):
    with SessionLocal() as db:
        q = db.query(Reservation)
        if email:
            q = q.filter(func.lower(Reservation.email) == email.lower())
        if offre:
            q = q.filter(Reservation.offre == offre)
        return q.order_by(Reservation.id.desc()).all()

# --- Lister toutes les réservations (pour Admin) ---
@app.get("/reservations/all", response_model=List[ReservationOut])
def list_all_reservations():
    with SessionLocal() as db:
        return db.query(Reservation).order_by(Reservation.id.desc()).all()

# --- PATCH / éditer une réservation ---
@app.patch("/reservations/{res_id}", response_model=ReservationOut)
def update_reservation(res_id: int, payload: ReservationUpdate):
    with SessionLocal() as db:
        r = db.query(Reservation).filter(Reservation.id == res_id).first()
        if not r:
            raise HTTPException(status_code=404, detail="Reservation not found")

        data = payload.model_dump(exclude_unset=True)

        # Déterminer la nouvelle offre et quantité (soit celles fournies, soit les existantes)
        new_offre = data.get("offre", r.offre)
        new_quantite = data.get("quantite", r.quantite)

        # Validation simple de l'offre
        if new_offre not in PRICES:
            raise HTTPException(status_code=400, detail="Offre invalide")

        # Recalcul automatique si prix_total non fourni mais offre/quantité changent
        if "prix_total" not in data and ("offre" in data or "quantite" in data):
            data["prix_total"] = PRICES[new_offre] * int(new_quantite)

        # Appliquer les changements
        for k, v in data.items():
            setattr(r, k, v)

        db.commit()
        db.refresh(r)
        return r

# --- Supprimer ---
@app.delete("/reservations/{reservation_id}", status_code=204)
def delete_reservation(reservation_id: int):
    with SessionLocal() as db:
        r = db.query(Reservation).filter(Reservation.id == reservation_id).first()
        if not r:
            raise HTTPException(status_code=404, detail="Reservation not found")
        db.delete(r)
        db.commit()
        return None
