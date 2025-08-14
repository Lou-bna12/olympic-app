// src/components/GuestRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function GuestRoute({ component: Component }) {
  const { isAuthenticated, authReady } = useAuth() ?? {};
  const location = useLocation();

  // Pendant l’hydratation on peut afficher un mini loader (ou null)
  if (!authReady) {
    return <div className="p-10 text-center text-gray-600">Chargement…</div>;
  }

  // Si déjà connecté → retourne au dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace state={{ from: location }} />;
  }

  // Sinon, affiche la page (login ou register)
  return <Component />;
}
