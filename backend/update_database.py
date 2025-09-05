from database import Base, engine
from models import User, Offer, Reservation, Ticket

print("Mise à jour de la base de données...")
Base.metadata.drop_all(bind=engine)
Base.metadata.create_all(bind=engine)
print("Base de données mise à jour avec succès!")