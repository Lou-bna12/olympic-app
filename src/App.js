// src/App.js
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
import Admin from './pages/Admin';
import Logout from './components/Logout';
import Header from './components/Header';
import Footer from './components/Footer';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';

const App = () => {
  const location = useLocation();
  const hideFooterRoutes = [
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
    '/logout',
  ];

  //  cacher le footer aussi sur tout /admin
  const hideFooter =
    hideFooterRoutes.includes(location.pathname) ||
    location.pathname.startsWith('/admin');

  return (
    <>
      <Header />
      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
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
          path="/reservation"
          element={<PrivateRoute component={Reservation} />}
        />

        {/* Admin protégé */}
        <Route
          path="/admin/*"
          element={
            <AdminRoute>
              <Admin />
            </AdminRoute>
          }
        />

        <Route path="/logout" element={<PrivateRoute component={Logout} />} />
      </Routes>

      {!hideFooter && <Footer />}
    </>
  );
};

export default App;
