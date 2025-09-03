// src/components/AdminRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import IndicateurChargement from './IndicateurChargement';

export default function AdminRoute({ children }) {
  const { isAuthenticated, isAdmin, authReady, loading } = useAuth();
  const location = useLocation();

  if (loading || !authReady) {
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
