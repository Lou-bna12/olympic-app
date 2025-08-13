// src/components/Header.jsx
import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { FaBars } from 'react-icons/fa';
import { UserContext } from '../context/UserContext';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { utilisateur } = useContext(UserContext);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2" onClick={closeMenu}>
          <img src="/images/logo.png" alt="Logo JO" className="h-10 w-auto" />
          <span className="text-xl font-bold text-black">JO</span>
        </Link>

        {/* Bouton menu mobile */}
        <button
          className="md:hidden text-2xl text-gray-700"
          aria-label="Ouvrir le menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <FaBars />
        </button>

        {/* Menu desktop */}
        <nav className="hidden md:flex gap-6 text-sm text-gray-800">
          <Link to="/" className="hover:text-blue-700">
            Accueil
          </Link>
          <Link to="/reservation" className="hover:text-blue-700">
            Réservation
          </Link>

          {!utilisateur ? (
            <>
              <Link to="/login" className="hover:text-blue-700">
                Connexion
              </Link>
              <Link to="/register" className="hover:text-blue-700">
                Inscription
              </Link>
            </>
          ) : (
            <>
              <Link to="/dashboard" className="hover:text-blue-700">
                Espace personnel
              </Link>
              <Link to="/logout" className="hover:text-blue-700">
                Déconnexion
              </Link>
            </>
          )}
        </nav>
      </div>

      {/* Menu mobile */}
      {menuOpen && (
        <div className="md:hidden px-4 pb-4 space-y-2 bg-white shadow">
          <Link
            to="/"
            className="block hover:text-blue-700"
            onClick={closeMenu}
          >
            Accueil
          </Link>
          <Link
            to="/reservation"
            className="block hover:text-blue-700"
            onClick={closeMenu}
          >
            Réservation
          </Link>

          {!utilisateur ? (
            <>
              <Link
                to="/login"
                className="block hover:text-blue-700"
                onClick={closeMenu}
              >
                Connexion
              </Link>
              <Link
                to="/register"
                className="block hover:text-blue-700"
                onClick={closeMenu}
              >
                Inscription
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/dashboard"
                className="block hover:text-blue-700"
                onClick={closeMenu}
              >
                Espace personnel
              </Link>
              <Link
                to="/logout"
                className="block hover:text-blue-700"
                onClick={closeMenu}
              >
                Déconnexion
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
