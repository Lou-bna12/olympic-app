import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import IndicateurChargement from './IndicateurChargement';

export default function AdminRoute({ children }) {
  const { isAuthenticated, isAdmin, loading, authToken } = useAuth(); // ← Récupérez authToken
  const location = useLocation();

  // Stocker le token dans localStorage pour être sûr qu'il est accessible
  if (authToken && !localStorage.getItem('authToken')) {
    localStorage.setItem('authToken', authToken);
  }

  if (loading) {
    return <IndicateurChargement />;
  }

  if (!isAuthenticated) {
    const next = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?next=${next}`} replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
