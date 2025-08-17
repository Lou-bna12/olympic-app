from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# URL de connexion PostgreSQL
DATABASE_URL = "postgresql://postgres:loubna12@localhost:5432/olympicdb"

engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Dépendance pour récupérer la session DB
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
