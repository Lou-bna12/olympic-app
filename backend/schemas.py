from pydantic import BaseModel, EmailStr
from datetime import date, datetime
from typing import Optional

# Utilisateurs
class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str

class UserOut(BaseModel):
    id: int
    username: str
    email: EmailStr
    is_admin: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class UserLogin(BaseModel):
    email: EmailStr
    password: str

# Réservations
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
    user_id: Optional[int] = None

    class Config:
        from_attributes = True

# Paiement
class PaymentSimulation(BaseModel):
    ticket_id: int

class PaymentResponse(BaseModel):
    status: str
    message: str
    ticket_id: int
    amount: float
    payment_date: datetime

    class Config:
        from_attributes = True

class TicketWithPayment(BaseModel):
    id: int
    final_key: str
    qr_code: Optional[str] = None
    is_used: bool
    is_paid: bool
    payment_status: str
    payment_date: Optional[datetime] = None
    amount: float
    offer_name: str
    offer_price: float

    class Config:
        from_attributes = True