import React, { useContext } from 'react';
import { UserContext } from '../context/UserContext'; // Assure-toi du chemin d'importation
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const { setUtilisateur } = useContext(UserContext); // Accède au contexte pour effacer l'utilisateur
  const navigate = useNavigate();

  const handleLogout = () => {
    // Supprimer l'utilisateur de localStorage et du contexte
    localStorage.removeItem('utilisateur');
    setUtilisateur(null);

    // Rediriger l'utilisateur vers la page de connexion après déconnexion
    navigate('/login');
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#f7f9fc]">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-extrabold mb-6 text-center">
          Déconnexion
        </h2>
        <p className="text-lg text-gray-700 mb-6 text-center">
          Êtes-vous sûr de vouloir vous déconnecter ?
        </p>
        <button
          onClick={handleLogout}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded transition duration-300"
        >
          Se déconnecter
        </button>
      </div>
    </div>
  );
};

export default Logout;
