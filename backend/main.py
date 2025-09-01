from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import auth, reservations, admin 
from database import Base, engine
import models

# Crée les tables dans PostgreSQL au lancement
Base.metadata.create_all(bind=engine)

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(reservations.router, prefix="/reservations", tags=["reservations"])
app.include_router(admin.router, prefix="/admin", tags=["admin"])  # ← Nouveau

@app.get("/ping")
def ping():
    return {"message": "Parfait 🎉 bon travail Loubna 🎉"}