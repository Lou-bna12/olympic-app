# Site de Réservation - Jeux Olympiques 2024

Application web de réservation de billets pour les Jeux Olympiques 2024 avec système d'authentification, gestion des réservations et fonctionnalités administrateur.

## Fonctionnalités

### Pour les utilisateurs

- **Inscription et connexion** sécurisée avec JWT
- **Création de réservations** avec choix de date, d'offre et de quantité
- **Visualisation des réservations** personnelles
- **Statistiques personnelles** sur les réservations
- **QR Codes** pour chaque réservation

### Pour les administrateurs

- **Tableau de bord** avec statistiques globales
- **Gestion de toutes les réservations**
- **Génération de QR Codes** pour validation
- **Visualisation du chiffre d'affaires**

## Technologies utilisées

- **Backend**: FastAPI (Python)
- **Base de données**: SQLite avec SQLAlchemy ORM
- **Authentification**: JWT (JSON Web Tokens)
- **Génération de QR Codes**: qrcode library
- **Sécurité**: OAuth2 Password Bearer

## Installation

### Prérequis

- Python 3.8+
- pip (gestionnaire de packages Python)

### Étapes d'installation

1. **Cloner le repository**

   ```bash
   git clone <votre-repository>
   cd olympic-reservation

   ```

2. Créer un environnement virtuel
   python -m venv venv
   venv\Scripts\activate

3. Installer les dépendances
   pip install -r requirements.txt

4. Configurer les variables d'environnement
   Créer un fichier .env à la racine du projet:
   SECRET_KEY=votre_clé_secrète_super_complexe_ici
   ALGORITHM=HS256
   DATABASE_URL=postgres:///./olympicdb

5. Lancer l'application
   .\start.ps1

-Structure de la base de données
Tables principales
Users: Utilisateurs du système (email, mot de passe hashé, rôle admin)

Reservations: Réservations des utilisateurs (date, offre, quantité, statut)

Modèles de données:

# User

id: int (primary key)
email: str (unique)
hashed_password: str
is_admin: bool = False

# Reservation

id: int (primary key)
user_id: int (foreign key)
username: str
email: str
date: Date
offre: str
quantity: int
status: str = "pending"

-API Endpoints
Authentification
POST /auth/register - Création d'un compte

POST /auth/login - Connexion (obtention du token)

Réservations (nécessite authentification)
POST /reservations/ - Créer une réservation

GET /reservations/me - Obtenir ses réservations

GET /reservations/stats - Statistiques personnelles

Administration (nécessite rôle admin)

-Sécurité
.Authentification par JWT avec expiration

.Hashage des mots de passe avec bcrypt

.Validation des données avec Pydantic

.Protection des routes administrateur

.Validation des tokens OAuth2

-Utilisation
Création d'un compte administrateur
Pour créer un compte administrateur, exécutez le script suivant après avoir lancé l'application:
python create_admin.py.

Personnalisation
Modifier les offres disponibles
Editez le modèle Pydantic ReservationRequest dans reservations.py pour ajouter ou modifier les types d'offres.

Personnaliser les QR Codes
Modifiez la fonction generate_qrcode dans admin.py pour changer:

Les données encodées dans le QR code

La taille, les couleurs du QR code

Le format de sortie

Déploiement
Déploiement local avec Docker
Un fichier Dockerfile et docker-compose.yml sont fournis pour un déploiement facile:

bash
docker-compose up -d
Déploiement en production
Modifier les variables d'environnement pour la production

Configurer un serveur web (Nginx)

Utiliser un serveur ASGI (Uvicorn avec Gunicorn)

Configurer une base de données PostgreSQL

 Licence
Ce projet est sous licence MIT. Voir le fichier LICENSE pour plus de détails.

Support
Pour toute question ou problème, veuillez contacter:

Email: loubnasellam49@gmail.com

Issue Tracker: https://github.com/Lou-bna12/olympic-app/tree/master

Note: Ce projet est une démonstration pour les Jeux Olympiques 2024. Certaines fonctionnalités peuvent nécessiter des ajustements pour une utilisation en production.

text

Ce fichier README.md fournit une documentation complète pour le projet, incluant :

- Les fonctionnalités
- Les instructions d'installation
- La structure de la base de données
- Les endpoints API
- Les aspects de sécurité
- Des exemples d'utilisation
- Des instructions de déploiement
