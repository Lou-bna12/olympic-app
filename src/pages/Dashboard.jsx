import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Dashboard = () => {
  const { utilisateur } = useContext(UserContext);
  const navigate = useNavigate();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  const fetchReservations = async () => {
    if (!utilisateur?.email) return;
    setLoading(true);
    setErr('');
    try {
      const emailRaw = (utilisateur.email || '').trim();
      const emailLower = emailRaw.toLowerCase();

      const req1 = api.get('/reservations/', { params: { email: emailRaw } });
      const req2 =
        emailLower !== emailRaw
          ? api.get('/reservations/', { params: { email: emailLower } })
          : Promise.resolve({ data: [] });

      const [r1, r2] = await Promise.all([req1, req2]);

      const merged = [...(r1.data || []), ...(r2.data || [])].filter(
        (r, i, arr) => arr.findIndex((x) => x.id === r.id) === i
      );

      setReservations(merged);
    } catch (e) {
      setErr('Impossible de charger vos réservations.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!utilisateur) {
      navigate('/login');
      return;
    }
    fetchReservations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [utilisateur, navigate]);

  const handleDelete = async (id) => {
    if (!window.confirm('Annuler cette réservation ?')) return;
    try {
      await api.delete(`/reservations/${id}`);
      setReservations((prev) => prev.filter((r) => r.id !== id));
    } catch {
      alert('Suppression impossible, réessayez.');
    }
  };

  if (!utilisateur) return null;

  return (
    <div className="min-h-screen px-4 py-8 bg-[#f7f9fc] flex flex-col items-center">
      <h2 className="text-3xl font-bold text-center text-[#0051BA] mb-2">
        Espace personnel
      </h2>
      <p className="text-gray-700 text-center mb-6">
        Bienvenue, <span className="font-semibold">{utilisateur.nom}</span>
      </p>

      <div className="mb-6">
        <button
          onClick={fetchReservations}
          className="px-4 py-2 bg-[#0051BA] text-white rounded-lg hover:bg-[#003f8a]"
        >
          Rafraîchir
        </button>
      </div>

      {loading && <p className="text-gray-600">Chargement…</p>}
      {err && <p className="text-red-500">{err}</p>}

      {!loading && reservations.length === 0 && (
        <div className="bg-white rounded-xl shadow-md p-6 w-full max-w-3xl text-center">
          <p className="text-gray-600 mb-4">
            Aucune réservation pour l’instant.
          </p>
          <button
            onClick={() => navigate('/reservation')}
            className="px-4 py-2 bg-[#0051BA] text-white rounded-lg hover:bg-[#003f8a]"
          >
            Réserver un billet
          </button>
        </div>
      )}

      {reservations.length > 0 && (
        <div className="w-full max-w-5xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {reservations.map((r) => (
            <div key={r.id} className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-800">#{r.id}</h3>
                <span className="text-sm px-2 py-1 rounded bg-blue-50 text-blue-700">
                  {r.offre?.toUpperCase()}
                </span>
              </div>
              <p className="text-gray-700">
                Quantité : <b>{r.quantite}</b>
              </p>
              <p className="text-gray-700">
                Total : <b>{r.prix_total} €</b>
              </p>
              <p className="text-gray-500 text-sm mt-2">Email : {r.email}</p>
              <button
                onClick={() => handleDelete(r.id)}
                className="mt-4 w-full border border-red-200 text-red-600 hover:bg-red-50 rounded-lg py-2"
              >
                Annuler
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
