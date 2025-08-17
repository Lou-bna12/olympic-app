// src/App.js
import React, { useEffect, useState } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import MesReservations from './components/MesReservations';

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
import Footer from './components/Footer'; // import Footer

import { useAuth } from './context/AuthContext';

// --- Wrapper pour protéger les routes ---
function RequireAuth({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <p className="text-center mt-10">⏳ Vérification en cours...</p>;
  }

  if (!user) {
    const next = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?next=${next}`} replace />;
  }

  return children;
}

// --- Wrapper pour les routes admin ---
function RequireAdmin({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <p className="text-center mt-10">⏳ Vérification en cours...</p>;
  }

  if (!user) {
    const next = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?next=${next}`} replace />;
  }

  // ⚠️ Ici tu pourras vérifier si user.role === "admin"
  return <Navigate to="/dashboard" replace />;
}

const App = () => {
  const location = useLocation();
  const [backendStatus, setBackendStatus] = useState('Vérification...');

  // Test API backend
  useEffect(() => {
    fetch('http://127.0.0.1:8000/ping')
      .then((res) => res.json())
      .then((data) => setBackendStatus(data.message))
      .catch(() => setBackendStatus('Erreur connexion API'));
  }, []);

  // Les pages où on cache le footer
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

      {/* Status backend */}
      <div
        style={{ textAlign: 'center', padding: '10px', background: '#f1f1f1' }}
      >
        <strong>Backend :</strong> {backendStatus}
      </div>

      <Routes>
        {/* Routes publiques */}
        <Route path="/" element={<Home />} />
        <Route path="/reservation" element={<Reservation />} />
        <Route path="/confirmation" element={<Confirmation />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Routes protégées */}
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
        <Route
          path="/mes-reservations"
          element={
            <RequireAuth>
              <MesReservations />
            </RequireAuth>
          }
        />

        {/* Redirection 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* ✅ Footer affiché sauf sur certaines pages */}
      {!hideFooterRoutes.includes(location.pathname) && <Footer />}
    </>
  );
};

export default App;
