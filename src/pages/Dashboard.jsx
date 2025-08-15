import React, { useEffect, useState } from 'react';
import { api_listMine, api_listAll } from '../services/reservations';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { isAdmin, token } = useAuth();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        let data;
        if (isAdmin) {
          data = await api_listAll(token);
        } else {
          data = await api_listMine(token);
        }
        setReservations(data);
      } catch (error) {
        console.error(
          'Erreur lors de la récupération des réservations :',
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, [isAdmin, token]);

  if (loading) {
    return <p className="text-center mt-10">Chargement des réservations...</p>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">
        {isAdmin ? 'Toutes les réservations' : 'Mes réservations'}
      </h2>
      {reservations.length === 0 ? (
        <p>Aucune réservation trouvée.</p>
      ) : (
        <table className="w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border">ID</th>
              <th className="p-2 border">Offre</th>
              <th className="p-2 border">Quantité</th>
              <th className="p-2 border">Prix total</th>
              <th className="p-2 border">Email</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((r) => (
              <tr key={r.id} className="text-center">
                <td className="p-2 border">{r.id}</td>
                <td className="p-2 border">{r.offre}</td>
                <td className="p-2 border">{r.quantite}</td>
                <td className="p-2 border">{r.prix_total} €</td>
                <td className="p-2 border">{r.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Dashboard;
