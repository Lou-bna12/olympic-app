// src/components/PrivateRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function PrivateRoute({ component: Component }) {
  const { isAuthenticated, authReady } = useAuth() ?? {};
  const location = useLocation();

  if (!authReady) return null; // ou un spinner

  if (!isAuthenticated) {
    const next = location.pathname + location.search;
    return (
      <Navigate
        to={`/login?next=${encodeURIComponent(next)}`}
        replace
        state={{ from: next }}
      />
    );
  }

  return <Component />;
}
