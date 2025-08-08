import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword'; // Ajout de la page mot de passe oublié
import ResetPassword from './pages/ResetPassword'; // Page de réinitialisation du mot de passe
import Dashboard from './pages/Dashboard';
import Reservation from './pages/Reservation';
import Confirmation from './pages/Confirmation';
import AdminPage from './pages/Admin';
import Header from './components/Header';
import Footer from './components/Footer';
import PrivateRoute from './components/PrivateRoute'; // Import du composant de route privée
import { UserProvider } from './context/UserContext'; // Import du UserProvider

const App = () => {
  const location = useLocation();
  const hideFooterRoutes = [
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
  ];

  return (
    <UserProvider>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Routes protégées */}
        <Route
          path="/dashboard"
          element={<PrivateRoute component={Dashboard} />}
        />
        <Route
          path="/admin"
          element={<PrivateRoute component={AdminPage} roles={['admin']} />}
        />

        {/* Autres pages */}
        <Route path="/reservation" element={<Reservation />} />
        <Route path="/confirmation" element={<Confirmation />} />
      </Routes>

      {/* Footer visible sauf sur certaines pages */}
      {!hideFooterRoutes.includes(location.pathname) && <Footer />}
    </UserProvider>
  );
};

export default App;
