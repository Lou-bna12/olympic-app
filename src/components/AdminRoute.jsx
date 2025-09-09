import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Loader() {
  return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2"></div>
      <span className="ml-3">Chargement…</span>
    </div>
  );
}

/**
 * Protège les routes admin.
 * - Redirige vers /login si non connecté
 * - Redirige vers /dashboard si connecté mais pas admin
 */
export default function AdminRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <Loader />;

  // pas connecté → login avec retour vers la page demandée
  if (!user) {
    const next = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?next=${next}`} replace />;
  }

  // selon ton backend, le flag peut s'appeler is_admin (Python) ou isAdmin (JS)
  const isAdmin = user?.is_admin ?? user?.isAdmin ?? false;
  if (!isAdmin) return <Navigate to="/dashboard" replace />;

  return children;
}
