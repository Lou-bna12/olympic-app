from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, ConfigDict  
from sqlalchemy import create_engine, Column, Integer, String, Float
from sqlalchemy.orm import sessionmaker, declarative_base
from typing import Optional
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

# --- Schémas Pydantic ---
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

# --- Lister (optionnellement filtré par email) ---
@app.get("/reservations/", response_model=list[ReservationOut])
def list_reservations(email: Optional[str] = None):
    with SessionLocal() as db:
        q = db.query(Reservation)
        if email:
            q = q.filter(Reservation.email == email)
        return q.order_by(Reservation.id.desc()).all()

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
