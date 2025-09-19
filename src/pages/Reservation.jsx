import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../services/api';

const Reservation = ({ user }) => {
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    date: '',
    offer: '',
    quantity: 1,
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Gestion du changement dans les inputs
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Soumission du formulaire
  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');

      // ✅ Normalisation des données envoyées (CORRIGÉ: "offer" → "offre")
      const data = {
        username: formData.username,
        email: formData.email,
        date: new Date(formData.date).toISOString().split('T')[0], // format YYYY-MM-DD
        offre: formData.offer, // ← CHANGEMENT ICI: "offer" → "offre"
        quantity: parseInt(formData.quantity, 10),
      };

      console.log('Payload envoyé:', data);

      const res = await fetch(`${API_URL}/reservations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        const reservation = await res.json();
        console.log('Réservation créée:', reservation);
        alert('Réservation réussie ✅');
        navigate('/mes-reservations');
      } else {
        const errorText = await res.text();
        console.error('Erreur API:', errorText);
        alert('Erreur lors de la réservation: ' + errorText);
      }
    } catch (err) {
      console.error('Erreur réseau:', err);
      alert('Erreur réseau, veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Réserver un billet
        </h2>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nom complet
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Date
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Offre
            </label>
            <select
              name="offer"
              value={formData.offer}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">-- Choisir une offre --</option>
              <option value="Solo">Solo - 25€</option>
              <option value="Duo">Duo - 50€</option>
              <option value="Familiale">Familiale - 150€</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Quantité
            </label>
            <input
              type="number"
              name="quantity"
              min="1"
              value={formData.quantity}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            {loading ? 'Réservation...' : 'Réserver'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Reservation;
