# database.py - Version simplifiée
import os
from dotenv import load_dotenv

# Chargez d'abord les variables d'environnement
load_dotenv('../.env')

# Définissez les variables AVANT d'importer SQLAlchemy
SECRET_KEY = os.getenv("SECRET_KEY")  
ALGORITHM = os.getenv("ALGORITHM")  
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 1440))

# Maintenant importez SQLAlchemy
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# URL de connexion PostgreSQL
DATABASE_URL = "postgresql://postgres:loubna12@localhost:5432/olympicdb"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

__all__ = [
    'get_db', 
    'SECRET_KEY', 
    'ALGORITHM', 
    'ACCESS_TOKEN_EXPIRE_MINUTES',
    'Base',
    'engine',
    'SessionLocal'
]