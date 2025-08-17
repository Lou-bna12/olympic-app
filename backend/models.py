from sqlalchemy import Column, Integer, String, ForeignKey, Date
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)


class Reservation(Base):
    __tablename__ = "reservations"

    id = Column(Integer, primary_key=True, index=True)
    nom = Column(String, nullable=False)
    prenom = Column(String, nullable=False)
    email = Column(String, nullable=False)
    date = Column(Date, nullable=False)
    offer = Column(String, nullable=False)
    quantity = Column(Integer, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"))
