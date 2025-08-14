// src/components/Header.js
import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBars } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth() ?? {};

  const displayName = useMemo(() => {
    const n = user?.nom || user?.full_name || user?.name;
    if (n) return String(n).trim();
    if (user?.email) return user.email.split('@')[0];
    return '';
  }, [user]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Marque (logo facultatif) */}
        <Link to="/" className="flex items-center gap-2" onClick={closeMenu}>
          {<img src="/images/logo.png" alt="Logo" className="w-8 h-8" />}
          <span className="font-bold text-lg text-gray-800">JO Paris 2024</span>
        </Link>

        {/* Desktop : seulement Connexion / Inscription (ou Bonjour + Déconnexion si connecté) */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              {displayName && (
                <div className="text-sm text-gray-700">
                  Bonjour, <strong>{displayName}</strong>
                </div>
              )}
              <button
                onClick={() => {
                  closeMenu();
                  logout?.();
                }}
                className="px-3 py-2 rounded bg-gray-100 text-gray-800 font-semibold"
              >
                Se déconnecter
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="px-3 py-2 rounded border border-gray-300 text-gray-800"
                onClick={closeMenu}
              >
                Se connecter
              </Link>
              <Link
                to="/register"
                className="px-3 py-2 rounded bg-blue-600 text-white font-semibold"
                onClick={closeMenu}
              >
                S’inscrire
              </Link>
            </>
          )}
        </div>

        {/* Burger mobile */}
        <button
          className="md:hidden text-2xl text-gray-700"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Ouvrir le menu"
        >
          <FaBars />
        </button>
      </div>

      {/* Menu mobile (pareil: uniquement Connexion / Inscription ou Déconnexion) */}
      {menuOpen && (
        <div className="md:hidden px-4 pb-4 space-y-2 bg-white shadow">
          {user ? (
            <>
              <div className="text-sm text-gray-700 mb-1">
                {displayName && (
                  <>
                    Bonjour, <strong>{displayName}</strong>
                  </>
                )}
              </div>
              <button
                onClick={() => {
                  closeMenu();
                  logout?.();
                }}
                className="w-full px-3 py-2 rounded bg-gray-100 text-gray-800 text-center font-semibold"
              >
                Se déconnecter
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="block hover:text-blue-700"
                onClick={closeMenu}
              >
                Se connecter
              </Link>
              <Link
                to="/register"
                className="block hover:text-blue-700"
                onClick={closeMenu}
              >
                S’inscrire
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
