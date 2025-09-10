from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import Base, engine
from routers import auth, reservations, admin, payment, tickets

# Création des tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Olympic API", version="1.0.0")

# CORS pour le front
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(reservations.router, prefix="/reservations", tags=["reservations"])
app.include_router(admin.router, prefix="/admin", tags=["admin"])
app.include_router(payment.router, prefix="/payment", tags=["payment"])  # ← GARDEZ ce prefix
app.include_router(tickets.router, tags=["tickets"])

@app.get("/ping")
def ping():
    return {"message": "pong"}

# Debug pratique
@app.get("/__debug/routes")
def debug_routes():
    return [{"path": r.path, "name": r.name} for r in app.router.routes]