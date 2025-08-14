// src/pages/NotFound.jsx
import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="max-w-xl mx-auto px-4 py-16 text-center">
      <h1 className="text-3xl font-bold mb-2">Page introuvable</h1>
      <p className="text-gray-600">
        Oups, la page que vous cherchez n’existe pas (ou plus).
      </p>
      <div className="mt-6 flex items-center justify-center gap-3">
        <Link to="/" className="px-4 py-2 rounded border">
          Accueil
        </Link>
        <Link to="/login" className="px-4 py-2 rounded bg-blue-600 text-white">
          Se connecter
        </Link>
      </div>
    </div>
  );
}
