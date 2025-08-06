import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-[#FDF8F2] shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo JO + icône */}
        <Link
          to="/"
          className="flex items-center space-x-2 text-xl font-bold text-blue-600"
        >
          {/* Icône Médaille */}

          <span>🥇JO</span>
        </Link>

        {/* Burger menu (mobile) */}
        <button
          className="md:hidden text-gray-700"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d={menuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
            />
          </svg>
        </button>

        {/* Navigation menu */}
        <nav
          className={`${
            menuOpen ? 'block' : 'hidden'
          } md:flex md:items-center md:space-x-6 w-full md:w-auto mt-4 md:mt-0`}
        >
          <Link
            to="/"
            className="block py-2 md:py-0 text-gray-700 hover:text-blue-600"
            onClick={() => setMenuOpen(false)}
          >
            Accueil
          </Link>
          <Link
            to="/reservation"
            className="block py-2 md:py-0 text-gray-700 hover:text-blue-600"
            onClick={() => setMenuOpen(false)}
          >
            Réservation
          </Link>
          <Link
            to="/dashboard"
            className="block py-2 md:py-0 text-gray-700 hover:text-blue-600"
            onClick={() => setMenuOpen(false)}
          >
            Tableau de bord
          </Link>
          <Link
            to="/admin"
            className="block py-2 md:py-0 text-gray-700 hover:text-blue-600"
            onClick={() => setMenuOpen(false)}
          >
            Admin
          </Link>
          <Link
            to="/login"
            className="block py-2 md:py-0 text-blue-600 font-semibold hover:underline"
            onClick={() => setMenuOpen(false)}
          >
            Connexion
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
