import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api_listMine } from '../services/reservations';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { token, user } = useAuth();
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const data = await api_listMine(token); // ✅ token ajouté
        setReservations(data);
      } catch (err) {
        console.error('Erreur lors de la récupération des réservations :', err);
      }
    };

    if (token) {
      fetchReservations();
    }
  }, [token]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">
        Tableau de bord — {user?.name || user?.email}
      </h2>

      <div className="mb-6">
        <Link
          to="/reservation"
          className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Nouvelle réservation
        </Link>
      </div>

      <h3 className="text-xl font-semibold mb-2">Mes réservations</h3>
      {reservations.length === 0 ? (
        <p className="text-gray-600">Aucune réservation pour le moment.</p>
      ) : (
        <table className="w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-3 py-2">ID</th>
              <th className="border px-3 py-2">Offre</th>
              <th className="border px-3 py-2">Quantité</th>
              <th className="border px-3 py-2">Prix total (€)</th>
              <th className="border px-3 py-2">Email</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((r) => (
              <tr key={r.id}>
                <td className="border px-3 py-2">{r.id}</td>
                <td className="border px-3 py-2">{r.offre}</td>
                <td className="border px-3 py-2">{r.quantite}</td>
                <td className="border px-3 py-2">{r.prix_total}</td>
                <td className="border px-3 py-2">{r.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
