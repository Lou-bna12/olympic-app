import React from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  // Déconnexion → suppression du token + redirection login
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          🎟️ Tableau de bord
        </h1>

        <div className="space-y-4">
          {/* Faire une réservation */}
          <button
            onClick={() => navigate('/reservation')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl transition duration-200 shadow-md"
          >
            Faire une réservation
          </button>

          {/* Voir mes réservations */}
          <button
            onClick={() => navigate('/mes-reservations')}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl transition duration-200 shadow-md"
          >
            Voir mes réservations
          </button>

          {/* Déconnexion */}
          <button
            onClick={handleLogout}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl transition duration-200 shadow-md"
          >
            Déconnexion
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
