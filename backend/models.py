from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Float, Date
from sqlalchemy.orm import relationship
from database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    password = Column(String)
    is_admin = Column(Boolean, default=False)
    secret_key = Column(String, unique=True)
    
    # Relations
    reservations = relationship("Reservation", back_populates="user")
    tickets = relationship("Ticket", back_populates="user")

class Offer(Base):
    __tablename__ = "offers"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(String)
    price = Column(Float)
    capacity = Column(Integer)
    is_active = Column(Boolean, default=True)
    
    # Relations
    tickets = relationship("Ticket", back_populates="offer")

class Reservation(Base):
    __tablename__ = "reservations"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String)
    email = Column(String)
    date = Column(Date)
    offre = Column(String)
    quantity = Column(Integer)
    status = Column(String, default="confirmée")
    user_id = Column(Integer, ForeignKey("users.id"))
    
    # Relation
    user = relationship("User", back_populates="reservations")

class Ticket(Base):
    __tablename__ = "tickets"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    offer_id = Column(Integer, ForeignKey("offers.id"))
    final_key = Column(String, unique=True, index=True)
    qr_code = Column(String, nullable=True)
    is_used = Column(Boolean, default=False)
    
    is_paid = Column(Boolean, default=False)
    payment_status = Column(String, default="pending")  
    payment_date = Column(DateTime, nullable=True)
    amount = Column(Float, default=0.0)
    
    # Relations
    user = relationship("User", back_populates="tickets")
    offer = relationship("Offer", back_populates="tickets")