// src/components/Logout.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Supprimer le token du localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    // Rediriger vers la page de connexion
    navigate('/login');
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p>Déconnexion en cours...</p>
    </div>
  );
};

export default Logout;
