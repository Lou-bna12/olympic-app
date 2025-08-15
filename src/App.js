// src/App.js
import React from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import Reservation from './pages/Reservation';
import Confirmation from './pages/Confirmation';
import Admin from './pages/Admin';
import Logout from './components/Logout';

import Header from './components/Header';
import Footer from './components/Footer';

import { useAuth } from './context/AuthContext';

// --- Wrappers locaux pour éviter tout problème d'import ---
function RequireAuth({ children }) {
  const { isAuthenticated, authReady } = useAuth() ?? {};
  const location = useLocation();

  if (!authReady) return null;

  if (!isAuthenticated) {
    const next = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?next=${next}`} replace />;
  }
  return children;
}

function RequireAdmin({ children }) {
  const { isAuthenticated, isAdmin, authReady } = useAuth() ?? {};
  const location = useLocation();

  if (!authReady) return null;

  if (!isAuthenticated) {
    const next = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?next=${next}`} replace />;
  }
  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}

const App = () => {
  const location = useLocation();

  const hideFooterRoutes = [
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
    '/logout',
  ];

  return (
    <>
      <Header />

      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/reservation" element={<Reservation />} />
        <Route path="/confirmation" element={<Confirmation />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Protégées */}
        <Route
          path="/dashboard"
          element={
            <RequireAuth>
              <Dashboard />
            </RequireAuth>
          }
        />
        <Route
          path="/admin/*"
          element={
            <RequireAdmin>
              <Admin />
            </RequireAdmin>
          }
        />
        <Route
          path="/logout"
          element={
            <RequireAuth>
              <Logout />
            </RequireAuth>
          }
        />

        {/* 404 simple (optionnel) */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {!hideFooterRoutes.includes(location.pathname) && <Footer />}
    </>
  );
};

export default App;
