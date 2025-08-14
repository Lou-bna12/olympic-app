// src/components/Header.js
import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const { user, isAdmin, logout } = useAuth() ?? {};
  const displayName =
    user?.full_name ||
    [user?.first_name, user?.last_name].filter(Boolean).join(' ') ||
    user?.name ||
    null;

  return (
    <header className="border-b bg-white">
      <nav className="mx-auto max-w-6xl px-4 h-14 flex items-center gap-4">
        <Link to="/" className="flex items-center gap-2">
          <img src="/images/logo.png" alt="Logo" className="w-8 h-8" />
          <span className="font-semibold">JO Paris 2024</span>
        </Link>

        {isAdmin && (
          <NavLink
            to="/admin"
            className="ml-2 text-sm text-gray-700 hover:text-black"
          >
            Admin
          </NavLink>
        )}

        <div className="ml-auto flex items-center gap-3">
          {displayName ? (
            <>
              <span className="text-sm">Bonjour, {displayName}</span>
              <button
                onClick={logout}
                className="px-3 py-1 rounded bg-gray-900 text-white"
              >
                Se déconnecter
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Se connecter</Link>
              <Link to="/register">S’inscrire</Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
