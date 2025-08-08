import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBars } from 'react-icons/fa';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

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
        </div>
      )}
    </header>
  );
};

export default Header;
