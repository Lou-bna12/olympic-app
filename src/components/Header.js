import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUserCircle, FaSignOutAlt } from 'react-icons/fa';

const Header = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img src="/images/logo.png" alt="Logo" className="w-8 h-8" />
          <span className="font-semibold text-blue-600">JO Paris 2024</span>
        </Link>

        {/* Liens */}
        <div className="flex items-center gap-4">
          {!token ? (
            <>
              <Link
                to="/login"
                className="text-gray-700 hover:text-blue-600 transition duration-200"
              >
                Se connecter
              </Link>
              <Link
                to="/register"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
              >
                S'inscrire
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-4">
              <Link
                to="/dashboard"
                className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition duration-200"
              >
                <FaUserCircle className="w-5 h-5" />
                <span className="hidden sm:inline">
                  {user.username || 'Mon espace'}
                </span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-red-600 hover:text-red-800 transition duration-200"
                title="Se déconnecter"
              >
                <FaSignOutAlt className="w-4 h-4" />
                <span className="hidden sm:inline">Déconnexion</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
