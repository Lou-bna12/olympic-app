from pydantic import BaseModel, EmailStr
from datetime import date, datetime
from typing import Optional

# ---------------------------
# Utilisateurs
# ---------------------------

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str

class UserOut(BaseModel):
    id: int
    username: str
    email: EmailStr
    is_admin: bool  

    class Config:
        from_attributes = True

class UserLogin(BaseModel):
    email: EmailStr
    password: str

# ---------------------------
# Réservations
# ---------------------------

class ReservationBase(BaseModel):
    username: str
    date: date
    offre: str
    quantity: int

class ReservationCreate(ReservationBase):
    email: str  

class ReservationOut(ReservationBase):
    id: int
    email: str
    status: str  

    class Config:
        from_attributes = True