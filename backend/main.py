from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import auth, reservations, admin, payment, tickets
from database import Base, engine

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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
app.include_router(admin.router, prefix="/admin", tags=["admin"])  
app.include_router(payment.router, tags=["payment"])
app.include_router(tickets.router, tags=["tickets"])

@app.get("/ping")
def ping():
    return {"message": "Parfait 🎉 bon travail Loubna 🎉"}