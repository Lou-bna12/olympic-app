import React, { useEffect, useState } from 'react';
import { Routes, Route, useLocation, Navigate, Link } from 'react-router-dom';
import MesReservations from './components/MesReservations';
import AdminRoute from './components/AdminRoute';
import CookieBanner from './components/CookieBanner';
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
import Events from './pages/events';

import Header from './components/Header';
import Footer from './components/Footer';

import { useAuth } from './context/AuthContext';

// --- Composant Indicateur de Chargement ---
function IndicateurChargement() {
  return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      <span className="ml-3">Chargement...</span>
    </div>
  );
}

// --- Wrapper pour protéger les routes ---
function RequireAuth({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <IndicateurChargement />;
  }

  if (!user) {
    const next = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?next=${next}`} replace />;
  }

  return children;
}

// --- Page 404 personnalisée ---
function PageNotFound() {
  return (
    <div className="text-center py-20">
      <h1 className="text-2xl font-bold">404 - Page non trouvée</h1>
      <p className="mt-4">La page que vous recherchez n'existe pas.</p>
      <Link to="/" className="text-blue-500 hover:underline mt-4 inline-block">
        Retour à l'accueil
      </Link>
    </div>
  );
}

const App = () => {
  const location = useLocation();
  const [backendStatus, setBackendStatus] = useState('Vérification...');

  // Test API backend avec gestion d'erreurs améliorée
  useEffect(() => {
    const verifierBackend = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const response = await fetch('http://127.0.0.1:8000/ping', {
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }

        const data = await response.json();
        setBackendStatus(data.message);
      } catch (error) {
        setBackendStatus('Erreur de connexion API');
        console.error('Erreur backend:', error);
      }
    };

    verifierBackend();
  }, []);

  // Les pages où on cache le footer
  const routesSansFooter = [
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
    '/logout',
  ];

  const afficherFooter = !routesSansFooter.includes(location.pathname);

  return (
    <>
      <Header />

      {/* Status backend - visible seulement en développement */}
      {process.env.NODE_ENV === 'development' && (
        <div
          style={{
            textAlign: 'center',
            padding: '10px',
            background: '#f1f1f1',
          }}
        >
          <strong>Backend :</strong> {backendStatus}
        </div>
      )}

      <Routes>
        {/* Routes publiques */}
        <Route path="/" element={<Home />} />
        <Route path="/events" element={<Events />} />
        <Route path="/reservation" element={<Reservation />} />
        <Route path="/confirmation" element={<Confirmation />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        {/* Routes protégées (utilisateur connecté) */}
        <Route
          path="/dashboard"
          element={
            <RequireAuth>
              <Dashboard />
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
        <Route
          path="/logout"
          element={
            <RequireAuth>
              <Logout />
            </RequireAuth>
          }
        />
        {/* Routes admin (utilisateur admin) */}
        <Route
          path="/admin/*"
          element={
            <AdminRoute>
              <Admin />
            </AdminRoute>
          }
        />
        {/* Page 404 personnalisée */}
        <Route path="*" element={<PageNotFound />} />
      </Routes>

      {/* Footer affiché sauf sur certaines pages */}
      {afficherFooter && <Footer />}

      {/* Bannière de gestion des cookies */}
      <CookieBanner />
    </>
  );
};

export default App;
