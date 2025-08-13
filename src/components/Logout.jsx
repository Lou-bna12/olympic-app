import React, { useContext, useEffect } from 'react';
import { UserContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const { utilisateur, setUtilisateur } = useContext(UserContext);
  const navigate = useNavigate();

  // Si personne n'est connecté, redirige vers /login
  useEffect(() => {
    if (!utilisateur) {
      navigate('/login', { replace: true });
    }
  }, [utilisateur, navigate]);

  const handleLogout = () => {
    try {
      // Ne pas toucher à 'users' (liste des comptes)
      localStorage.removeItem('utilisateur');
    } finally {
      setUtilisateur(null);
      navigate('/login', { replace: true });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#f7f9fc] px-4">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-extrabold mb-6 text-center">
          Déconnexion
        </h2>
        <p className="text-lg text-gray-700 mb-6 text-center">
          Êtes-vous sûr de vouloir vous déconnecter ?
        </p>
        <div className="flex gap-3">
          <button
            onClick={handleLogout}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded transition duration-300"
          >
            Se déconnecter
          </button>
          <button
            onClick={() => navigate(-1)}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 px-4 rounded transition duration-300"
          >
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
};

export default Logout;
