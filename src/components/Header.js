import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBars } from 'react-icons/fa';
import { UserContext } from '../context/UserContext'; // Assure-toi du chemin correct

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { utilisateur, setUtilisateur } = useContext(UserContext); // Récupère l'utilisateur du contexte
  const navigate = useNavigate();

  const handleLogout = () => {
    // Supprimer les données utilisateur du localStorage et du contexte
    localStorage.removeItem('utilisateur');
    setUtilisateur(null); // Effacer l'utilisateur du contexte
    navigate('/login'); // Redirige vers la page de login
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo personnalisé */}
        <Link to="/" className="flex items-center gap-2">
          <img src="/images/logo.png" alt="Logo JO" className="h-10 w-auto" />
          <span className="text-xl font-bold text-black">JO</span>
        </Link>

        {/* Bouton menu mobile */}
        <button
          className="md:hidden text-2xl text-gray-700"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <FaBars />
        </button>

        {/* Menu desktop */}
        <nav className="hidden md:flex gap-6 text-sm text-gray-800">
          <Link to="/" className="hover:text-blue-700">
            Accueil
          </Link>
          <Link to="/login" className="hover:text-blue-700">
            Connexion
          </Link>
          <Link to="/register" className="hover:text-blue-700">
            Inscription
          </Link>
          <Link to="/reservation" className="hover:text-blue-700">
            Réservation
          </Link>

          {/* Si l'utilisateur est connecté, afficher le bouton Déconnexion */}
          {utilisateur && (
            <button
              onClick={handleLogout}
              className="text-blue-600 hover:text-blue-800"
            >
              Déconnexion
            </button>
          )}
        </nav>
      </div>

      {/* Menu mobile */}
      {menuOpen && (
        <div className="md:hidden px-4 pb-4 space-y-2 bg-white shadow">
          <Link to="/" className="block hover:text-blue-700">
            Accueil
          </Link>
          <Link to="/login" className="block hover:text-blue-700">
            Connexion
          </Link>
          <Link to="/register" className="block hover:text-blue-700">
            Inscription
          </Link>
          <Link to="/reservation" className="block hover:text-blue-700">
            Réservation
          </Link>

          {/* Afficher le bouton Déconnexion dans le menu mobile */}
          {utilisateur && (
            <button
              onClick={handleLogout}
              className="block text-blue-600 hover:text-blue-800"
            >
              Déconnexion
            </button>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
