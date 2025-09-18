import React, { useState } from 'react';
import { API_URL } from '../services/api'; // ✅ corrigé : import nommé
import axios from 'axios';

const Reservation = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    date: '',
    offre: '',
    quantity: 1,
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(`${API_URL}/reservations`, formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setMessage('✅ Réservation réussie !');
      console.log('Réservation créée :', res.data);
    } catch (err) {
      console.error('Erreur lors de la réservation :', err);
      setMessage('❌ Erreur lors de la réservation');
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Réserver un billet</h2>
      {message && <p className="mb-4 text-center">{message}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="username"
          placeholder="Nom"
          value={formData.username}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        />
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        />
        <input
          type="text"
          name="offre"
          placeholder="Offre"
          value={formData.offre}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        />
        <input
          type="number"
          name="quantity"
          min="1"
          value={formData.quantity}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Réserver
        </button>
      </form>
    </div>
  );
};

export default Reservation;
