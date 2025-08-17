import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const MesReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          alert('Vous devez être connecté !');
          navigate('/login');
          return;
        }

        const response = await fetch('http://127.0.0.1:8000/reservations/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setReservations(data);
        } else {
          console.error('Erreur API:', await response.json());
        }
      } catch (err) {
        console.error('Erreur réseau:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Chargement de vos réservations...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Mes Réservations
        </h1>

        {reservations.length === 0 ? (
          <p className="text-center text-gray-600">
            Vous n’avez aucune réservation pour le moment.
          </p>
        ) : (
          <ul className="space-y-4">
            {reservations.map((res) => (
              <li
                key={res.id}
                className="border rounded-lg p-4 shadow-sm bg-gray-50"
              >
                <p>
                  <span className="font-semibold">Nom :</span> {res.nom}{' '}
                  {res.prenom}
                </p>
                <p>
                  <span className="font-semibold">Offre :</span> {res.offer}
                </p>
                <p>
                  <span className="font-semibold">Quantité :</span>{' '}
                  {res.quantity}
                </p>
                <p>
                  <span className="font-semibold">Date :</span>{' '}
                  {new Date(res.date).toLocaleDateString('fr-FR')}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default MesReservations;
