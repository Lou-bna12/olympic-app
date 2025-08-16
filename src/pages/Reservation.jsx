import React, { useState } from 'react';
import { api_create } from '../services/reservations';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Reservation = () => {
  const { token } = useAuth();
  const [offre, setOffre] = useState('solo');
  const [quantite, setQuantite] = useState(1);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const offresDisponibles = {
    solo: 25,
    duo: 50,
    familiale: 150,
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    try {
      const prix_total = offresDisponibles[offre] * quantite;
      const reservationData = {
        offre,
        quantite,
        prix_total,
      };

      const result = await api_create(reservationData, token);
      setMessage(`Réservation confirmée ✅ ID: ${result.id}`);
    } catch (err) {
      console.error(err);

      let errorMsg = 'Erreur lors de la réservation';
      if (err.response?.data?.detail) {
        if (Array.isArray(err.response.data.detail)) {
          errorMsg = err.response.data.detail.map((e) => e.msg).join(', ');
        } else if (typeof err.response.data.detail === 'string') {
          errorMsg = err.response.data.detail;
        } else {
          errorMsg = JSON.stringify(err.response.data.detail);
        }
      }

      setError(errorMsg);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Réserver des billets</h2>

      {error && (
        <div className="bg-red-100 text-red-600 p-2 rounded mb-4">{error}</div>
      )}
      {message && (
        <div className="bg-green-100 text-green-600 p-2 rounded mb-4">
          {message}
          <div className="mt-4">
            <Link
              to="/dashboard"
              className="inline-block bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900"
            >
              Retour au Dashboard
            </Link>
          </div>
        </div>
      )}

      {!message && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-semibold">Offre</label>
            <select
              value={offre}
              onChange={(e) => setOffre(e.target.value)}
              className="border p-2 w-full"
            >
              <option value="solo">Offre Solo — 25 €</option>
              <option value="duo">Offre Duo — 50 €</option>
              <option value="familiale">Offre Familiale — 150 €</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold">Quantité</label>
            <input
              type="number"
              min="1"
              value={quantite}
              onChange={(e) => setQuantite(parseInt(e.target.value))}
              className="border p-2 w-full"
            />
          </div>

          <p className="font-semibold">
            Total : {quantite * offresDisponibles[offre]} €
          </p>

          <button
            type="submit"
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            Confirmer la réservation
          </button>
        </form>
      )}
    </div>
  );
};

export default Reservation;
