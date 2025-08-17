from pydantic import BaseModel, EmailStr

# Schéma pour la création d’utilisateur
class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str

# Schéma pour afficher un utilisateur (sans mot de passe)
class UserOut(BaseModel):
    id: int
    username: str
    email: EmailStr

    class Config:
        from_attributes = True  # anciennement orm_mode

# Schéma pour le login
class UserLogin(BaseModel):
    email: EmailStr
    password: str
