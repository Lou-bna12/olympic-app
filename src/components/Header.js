import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login'); // redirection vers login après déconnexion
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img src="/images/logo.png" alt="Logo" className="w-8 h-8" />
          <span className="font-semibold">JO Paris 2024</span>
        </Link>
        {/* Liens */}
        <div className="space-x-4">
          {!token ? (
            <>
              <Link to="/login" className="text-gray-700 hover:text-blue-600">
                Se connecter
              </Link>
              <Link
                to="/register"
                className="text-gray-700 hover:text-blue-600"
              >
                S’inscrire
              </Link>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="text-red-600 font-semibold hover:underline"
            >
              Se déconnecter
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
