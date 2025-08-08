from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from sqlalchemy import create_engine, Column, Integer, String, Float
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Configuration de la base de données PostgreSQL
DATABASE_URL = "postgresql://username:password@localhost:5432/reservations_db"  # Remplace avec tes infos
engine = create_engine(DATABASE_URL, echo=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Modèle de la table Reservation
class Reservation(Base):
    __tablename__ = "reservations"
    id = Column(Integer, primary_key=True, index=True)
    offre = Column(String, index=True)
    quantite = Column(Integer)
    prix_total = Column(Float)
    email = Column(String, index=True)

# Créer la table
Base.metadata.create_all(bind=engine)

# Création de l'application FastAPI
app = FastAPI()

# Pydantic model pour la validation des données
class ReservationCreate(BaseModel):
    offre: str
    quantite: int
    prix_total: float
    email: str

@app.post("/reservations/")
def create_reservation(reservation: ReservationCreate):
    db = SessionLocal()
    db_reservation = Reservation(**reservation.dict())
    db.add(db_reservation)
    db.commit()
    db.refresh(db_reservation)
    db.close()
    return db_reservation

@app.get("/reservations/{reservation_id}")
def read_reservation(reservation_id: int):
    db = SessionLocal()
    db_reservation = db.query(Reservation).filter(Reservation.id == reservation_id).first()
    db.close()
    if db_reservation is None:
        raise HTTPException(status_code=404, detail="Reservation not found")
    return db_reservation
