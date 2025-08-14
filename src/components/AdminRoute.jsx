// src/components/AdminRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminRoute({ children }) {
  const { authReady, isAuthenticated, isAdmin } = useAuth() ?? {};

  if (!authReady) return null; // ou un petit loader si tu veux
  if (!isAuthenticated || !isAdmin) return <Navigate to="/dashboard" replace />;

  return children ?? <Outlet />;
}
