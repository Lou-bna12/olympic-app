import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

const PrivateRoute = ({ component: Component, roles }) => {
  const { utilisateur } = useContext(UserContext);
  const location = useLocation();

  // Non connecté → login
  if (!utilisateur) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Contrôle de rôles (admin, etc.)
  if (roles?.length) {
    const role = utilisateur.role || 'user';
    if (!roles.includes(role)) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  // OK → rendre la page demandée
  return <Component />;
};

export default PrivateRoute;
