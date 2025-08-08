import React, { useContext, useEffect } from 'react';
import { UserContext } from '../UserContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { utilisateur } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!utilisateur) {
      navigate('/login');
    }
  }, [utilisateur, navigate]);

  if (!utilisateur) {
    return null;
  }

  return (
    <div className="min-h-screen px-4 py-8 bg-[#f7f9fc] flex flex-col items-center">
      <h2 className="text-3xl font-bold text-center text-[#0051BA] mb-2">
        Espace personnel
      </h2>
      <p className="text-gray-700 text-center mb-8">
        Bienvenue, <span className="font-semibold">{utilisateur.email}</span>
      </p>

      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Bloc Réservations */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Vos réservations
          </h3>
          <p className="text-gray-500 text-sm">
            Aucune réservation pour l’instant.
          </p>
        </div>

        {/* Bloc Infos Perso */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Informations personnelles
          </h3>
          <p className="text-gray-500 text-sm">Email : {utilisateur.email}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
