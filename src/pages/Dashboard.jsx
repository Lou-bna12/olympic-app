import React from 'react';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* ✅ Message de Bienvenue */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Bienvenue{user?.username ? `, ${user.username}` : ''} ! 👋
          </h1>
          <p className="text-gray-600">
            Gérez vos réservations pour les Jeux Olympiques 2024
          </p>
        </div>

        {/* Cartes de statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Mes Réservations
            </h2>
            <p className="text-3xl font-bold text-blue-600">2</p>
            <p className="text-gray-600">réservations actives</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Prochaine Réservation
            </h2>
            <p className="text-2xl font-bold text-green-600">
              30 septembre 2025
            </p>
            <p className="text-gray-600">Offre: Solo</p>
          </div>
        </div>

        {/* Actions rapides */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Actions rapides
          </h2>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => (window.location.href = '/reservation')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Nouvelle réservation
            </button>
            <button
              onClick={() => (window.location.href = '/mes-reservations')}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
            >
              Voir mes réservations
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
