import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import Reservation from './pages/Reservation';
import Confirmation from './pages/Confirmation';
import AdminPage from './pages/Admin';
import Logout from './components/Logout';
import Header from './components/Header';
import Footer from './components/Footer';
import PrivateRoute from './components/PrivateRoute';
import { UserProvider } from './context/UserContext';

const App = () => {
  const location = useLocation();

  const hideFooterRoutes = [
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
    '/logout', // on masque aussi le footer sur la page de déconnexion
  ];

  return (
    <UserProvider>
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
          element={<PrivateRoute component={Dashboard} />}
        />
        <Route
          path="/admin"
          element={<PrivateRoute component={AdminPage} roles={['admin']} />}
        />
        <Route path="/logout" element={<PrivateRoute component={Logout} />} />
      </Routes>

      {!hideFooterRoutes.includes(location.pathname) && <Footer />}
    </UserProvider>
  );
};

export default App;
