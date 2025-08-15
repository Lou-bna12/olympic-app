from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel, ConfigDict, EmailStr
from sqlalchemy import create_engine, Column, Integer, String, Float, func
from sqlalchemy.orm import sessionmaker, declarative_base
from typing import Optional, List
import os
from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext

# ----------------------------
# Config BDD
# ----------------------------
DB_URL = os.getenv(
    "DATABASE_URL",
    "postgresql+psycopg2://postgres:loubna12@localhost:5432/reservations_db",
)

engine = create_engine(DB_URL, echo=True, future=True)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)
Base = declarative_base()

# ----------------------------
# Sécurité & Config JWT
# ----------------------------
SECRET_KEY = os.getenv("JWT_SECRET", "mon_secret_super_securise")
ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("JWT_EXPIRE_MINUTES", "1440"))

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")


def get_password_hash(password):
    return pwd_context.hash(password)


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

# ----------------------------
# Modèles SQLAlchemy
# ----------------------------
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    nom = Column(String, nullable=False)
    prenom = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    mot_de_passe_hache = Column(String, nullable=False)
    role = Column(String, default="user")  # user ou admin


class Reservation(Base):
    __tablename__ = "reservations"
    id = Column(Integer, primary_key=True, index=True)
    offre = Column(String, index=True, nullable=False)
    quantite = Column(Integer, nullable=False)
    prix_total = Column(Float, nullable=False)
    email = Column(String, index=True, nullable=False)


# Création des tables
Base.metadata.create_all(bind=engine)

# ----------------------------
# App FastAPI
# ----------------------------
app = FastAPI()

# CORS pour le front React
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----------------------------
# Sécurité - récupération utilisateur connecté
# ----------------------------
def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token invalide")
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token invalide")

    with SessionLocal() as db:
        user = db.query(User).filter(User.email == email).first()
        if user is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Utilisateur introuvable")
        return user


def get_current_admin(current_user: User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Accès interdit")
    return current_user

# ----------------------------
# Schémas Pydantic
# ----------------------------
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


class ReservationUpdate(BaseModel):
    offre: Optional[str] = None
    quantite: Optional[int] = None
    prix_total: Optional[float] = None


class UserCreate(BaseModel):
    nom: str
    prenom: str
    email: EmailStr
    mot_de_passe: str


class UserLogin(BaseModel):
    email: EmailStr
    mot_de_passe: str


class Token(BaseModel):
    access_token: str
    token_type: str


# prix unitaires
PRICES = {"solo": 25, "duo": 50, "familiale": 150}

# ----------------------------
# Routes
# ----------------------------
@app.get("/ping")
def ping():
    return {"status": "ok"}

# --- Auth ---
@app.post("/signup", response_model=Token)
def signup(user: UserCreate):
    with SessionLocal() as db:
        if db.query(User).filter(User.email == user.email).first():
            raise HTTPException(status_code=400, detail="Email déjà enregistré")

        hashed_pw = get_password_hash(user.mot_de_passe)
        db_user = User(
            nom=user.nom,
            prenom=user.prenom,
            email=user.email,
            mot_de_passe_hache=hashed_pw
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)

        token = create_access_token({"sub": db_user.email})
        return {"access_token": token, "token_type": "bearer"}


@app.post("/login", response_model=Token)
def login(user: UserLogin):
    with SessionLocal() as db:
        db_user = db.query(User).filter(User.email == user.email).first()
        if not db_user or not verify_password(user.mot_de_passe, db_user.mot_de_passe_hache):
            raise HTTPException(status_code=401, detail="Email ou mot de passe incorrect")

        token = create_access_token({"sub": db_user.email})
        return {"access_token": token, "token_type": "bearer"}

# --- CRUD Réservations protégées ---
@app.post("/reservations/", response_model=ReservationOut)
def create_reservation(payload: ReservationCreate, current_user: User = Depends(get_current_user)):
    with SessionLocal() as db:
        r = Reservation(**payload.model_dump())
        db.add(r)
        db.commit()
        db.refresh(r)
        return r


@app.get("/reservations/{reservation_id}", response_model=ReservationOut)
def read_reservation(reservation_id: int, current_user: User = Depends(get_current_user)):
    with SessionLocal() as db:
        r = db.query(Reservation).filter(Reservation.id == reservation_id).first()
        if not r:
            raise HTTPException(status_code=404, detail="Reservation not found")
        return r


@app.get("/reservations/", response_model=List[ReservationOut])
def list_reservations(email: Optional[str] = None, offre: Optional[str] = None, current_user: User = Depends(get_current_user)):
    with SessionLocal() as db:
        q = db.query(Reservation)
        if email:
            q = q.filter(func.lower(Reservation.email) == email.lower())
        if offre:
            q = q.filter(Reservation.offre == offre)
        return q.order_by(Reservation.id.desc()).all()


@app.get("/reservations/all", response_model=List[ReservationOut])
def list_all_reservations(current_admin: User = Depends(get_current_admin)):
    with SessionLocal() as db:
        return db.query(Reservation).order_by(Reservation.id.desc()).all()


@app.patch("/reservations/{res_id}", response_model=ReservationOut)
def update_reservation(res_id: int, payload: ReservationUpdate, current_user: User = Depends(get_current_user)):
    with SessionLocal() as db:
        r = db.query(Reservation).filter(Reservation.id == res_id).first()
        if not r:
            raise HTTPException(status_code=404, detail="Reservation not found")

        data = payload.model_dump(exclude_unset=True)
        new_offre = data.get("offre", r.offre)
        new_quantite = data.get("quantite", r.quantite)

        if new_offre not in PRICES:
            raise HTTPException(status_code=400, detail="Offre invalide")

        if "prix_total" not in data and ("offre" in data or "quantite" in data):
            data["prix_total"] = PRICES[new_offre] * int(new_quantite)

        for k, v in data.items():
            setattr(r, k, v)

        db.commit()
        db.refresh(r)
        return r


@app.put("/reservations/{res_id}", response_model=ReservationOut)
def replace_reservation(res_id: int, payload: ReservationCreate, current_user: User = Depends(get_current_user)):
    with SessionLocal() as db:
        r = db.query(Reservation).filter(Reservation.id == res_id).first()
        if not r:
            raise HTTPException(status_code=404, detail="Reservation not found")

        if payload.offre not in PRICES:
            raise HTTPException(status_code=400, detail="Offre invalide")

        # Remplacer complètement tous les champs
        r.offre = payload.offre
        r.quantite = payload.quantite
        r.prix_total = payload.prix_total
        r.email = payload.email

        db.commit()
        db.refresh(r)
        return r


@app.delete("/reservations/{reservation_id}", status_code=204)
def delete_reservation(reservation_id: int, current_user: User = Depends(get_current_user)):
    with SessionLocal() as db:
        r = db.query(Reservation).filter(Reservation.id == reservation_id).first()
        if not r:
            raise HTTPException(status_code=404, detail="Reservation not found")
        db.delete(r)
        db.commit()
        return None

# ----------------------------
# NOUVELLE ROUTE : profil utilisateur connecté
# ----------------------------
@app.get("/auth/me")
def get_me(current_user: User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "nom": current_user.nom,
        "prenom": current_user.prenom,
        "email": current_user.email,
        "role": current_user.role
    }

# ----------------------------
# NOUVELLE ROUTE : réservations personnelles
# ----------------------------
@app.get("/reservations/mine", response_model=List[ReservationOut])
def list_my_reservations(current_user: User = Depends(get_current_user)):
    with SessionLocal() as db:
        return (
            db.query(Reservation)
            .filter(Reservation.email == current_user.email)
            .order_by(Reservation.id.desc())
            .all()
        )

