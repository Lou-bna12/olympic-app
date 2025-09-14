import psycopg2

try:
    conn = psycopg2.connect(
        dbname="olympicdb",
        user="olympicuser",
        password="Loubna123!",
        host="127.0.0.1",
        port="5432"
    )
    print("✅ Connexion réussie à PostgreSQL !")
    conn.close()
except Exception as e:
    print("❌ Erreur :", e)
