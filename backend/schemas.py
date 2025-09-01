from pydantic import BaseModel, EmailStr
from datetime import date  # pour gérer les vraies dates


# ---------------------------
# Utilisateurs
# ---------------------------

# Création d’utilisateur (register)
class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str


# Affichage utilisateur (sans mot de passe)
class UserOut(BaseModel):
    id: int
    username: str
    email: EmailStr

    class Config:
        from_attributes = True  # anciennement orm_mode (permet conversion depuis SQLAlchemy)


# Login (connexion)
class UserLogin(BaseModel):
    email: EmailStr
    password: str


# ---------------------------
# Réservations
# ---------------------------

class ReservationBase(BaseModel):
    username: str
    date: date       # Pydantic valide directement (format YYYY-MM-DD)
    offre: str
    quantity: int


class ReservationCreate(ReservationBase):
    pass


class ReservationOut(ReservationBase):
    id: int
    email: str

    class Config:
        from_attributes = True
