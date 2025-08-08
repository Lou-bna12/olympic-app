import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

// Composant pour gérer les routes privées
const PrivateRoute = ({ component: Component, roles }) => {
  const { utilisateur } = useContext(UserContext); // Récupérer l'utilisateur du contexte

  // Si l'utilisateur n'est pas connecté, rediriger vers la page de connexion
  if (!utilisateur) {
    return <Navigate to="/login" />;
  }

  // Si l'utilisateur n'a pas les rôles nécessaires, rediriger
  if (roles && !roles.includes(utilisateur.role)) {
    return <Navigate to="/" />;
  }

  // Si tout est ok, rendre le composant
  return <Component />;
};

export default PrivateRoute;
