from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import Base, engine
from routers.auth import router as auth_router
from routers.reservations import router as reservations_router
from routers.admin import router as admin_router
from routers.payment import router as payment_router
from routers.tickets import router as tickets_router

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Olympic API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(reservations_router)
app.include_router(admin_router)
app.include_router(payment_router)
app.include_router(tickets_router)

# Routes
@app.get("/ping", tags=["health"])

def ping():
    return {"message": "PARFAIT 👌"}

@app.get("/healthz", tags=["health"])
def healthz():
    return {"ok": True}

#Debug des routes
@app.get("/__debug/routes")
def debug_routes():
    return [
        {"path": r.path, "name": r.name, "methods": list(getattr(r, "methods", []))}
        for r in app.router.routes
    ]
