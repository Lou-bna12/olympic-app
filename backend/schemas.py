from datetime import datetime, date
from typing import Optional, List
from pydantic import BaseModel

# -------------------------------
# Utilisateurs
# -------------------------------
class UserBase(BaseModel):
    username: str
    email: str

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class UserOut(UserBase):  # <- renommé ici
    id: int
    is_admin: bool

    class Config:
        from_attributes = True


# -------------------------------
# Réservations
# -------------------------------
class ReservationBase(BaseModel):
    username: str
    email: str
    date: date
    offre: str
    quantity: int

class ReservationCreate(ReservationBase):
    pass

class ReservationUpdate(BaseModel):
    quantity: Optional[int] = None
    status: Optional[str] = None

class ReservationResponse(ReservationBase):
    id: int
    user_id: int
    status: str

    class Config:
        from_attributes = True


# -------------------------------
# Tickets
# -------------------------------
class TicketCreate(BaseModel):
    offer_id: int
    reservation_id: Optional[int] = None

class TicketResponse(BaseModel):
    id: int
    user_id: int
    offer_id: int
    reservation_id: Optional[int] = None
    qr_code: Optional[str] = None
    is_used: bool
    is_paid: bool
    amount: float

    class Config:
        from_attributes = True


# -------------------------------
# Paiement
# -------------------------------
class PaymentSimulation(BaseModel):
    ticket_id: Optional[int] = None
    reservation_id: Optional[int] = None

class PaymentResponse(BaseModel):
    status: str
    ticket_id: int
    reservation_id: Optional[int] = None
    payment_status: str
    paid: bool
    qr_payload: Optional[str] = None
    amount: float
    payment_date: Optional[datetime] = None

    class Config:
        from_attributes = True
