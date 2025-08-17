from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import auth, reservations
from database import Base, engine
import models

# Crée les tables dans PostgreSQL au lancement
Base.metadata.create_all(bind=engine)

app = FastAPI()

# CORS
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(reservations.router, prefix="/reservations", tags=["reservations"])

@app.get("/ping")
def ping():
    return {"message": "Parfait 🎉 bon travail Loubna 🎉"}
