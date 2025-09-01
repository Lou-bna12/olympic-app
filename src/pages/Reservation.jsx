import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Reservation = () => {
  const navigate = useNavigate();

  const PRICES = {
    solo: 25,
    duo: 50,
    familiale: 150,
  };

  const [formData, setFormData] = useState({
    username: '',
    date: '',
    offre: '',
    quantity: 1,
  });

  const totalPrice = formData.offre
    ? PRICES[formData.offre] * formData.quantity
    : 0;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    if (!user || !user.email) {
      alert('Erreur: Utilisateur non connecté ❌');
      navigate('/login');
      return;
    }

    const data = {
      username: formData.username,
      email: user.email,
      date: formData.date,
      offre: formData.offre,
      quantity: formData.quantity,
    };

    console.log('📤 Données envoyées:', data);

    try {
      const response = await fetch('http://127.0.0.1:8000/reservations/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ Erreur API:', errorData);
        alert(
          'Erreur lors de la réservation ❌: ' +
            (errorData.detail || 'Erreur inconnue')
        );
        return;
      }

      const result = await response.json();
      console.log('✅ Réservation réussie:', result);
      alert('Réservation réussie 🎉');
      navigate('/dashboard');
    } catch (err) {
      console.error('⚡ Erreur réseau:', err);
      alert('Erreur réseau ❌');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 text-sm text-blue-600 hover:text-blue-800 flex items-center"
        >
          ⬅ Retour
        </button>

        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Réserver un billet
        </h1>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Nom d'utilisateur"
            className="w-full border rounded-lg px-3 py-2"
            required
          />
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
            required
          />
          <select
            name="offre"
            value={formData.offre}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
            required
          >
            <option value="">Choisir une offre</option>
            <option value="solo">Solo - 25 €</option>
            <option value="duo">Duo - 50 €</option>
            <option value="familiale">Familiale - 150 €</option>
          </select>
          <input
            type="number"
            name="quantity"
            min="1"
            value={formData.quantity}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
            required
          />
          <p className="text-lg font-semibold text-gray-700">
            Total à payer : {totalPrice} €
          </p>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl mt-4 transition duration-200 shadow-md"
          >
            Réserver
          </button>
        </form>
      </div>
    </div>
  );
};

export default Reservation;
