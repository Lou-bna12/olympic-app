import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom'; // Utilisation de Navigate au lieu de Redirect
import { UserContext } from '../context/UserContext'; // Correct import

const PrivateRoute = ({ component: Component, roles, ...rest }) => {
  const { utilisateur } = useContext(UserContext);

  // Si l'utilisateur n'est pas connecté, redirige vers la page login
  if (!utilisateur) {
    return <Navigate to="/login" replace />; // Utilisation de Navigate au lieu de Redirect
  }

  // Si des rôles sont définis et l'utilisateur n'a pas le bon rôle, redirige vers l'accueil
  if (roles && roles.length > 0 && !roles.includes(utilisateur.role)) {
    return <Navigate to="/" replace />; // Utilisation de Navigate pour la redirection
  }

  // Si tout est ok, afficher la page demandée
  return <Component {...rest} />;
};

export default PrivateRoute;
