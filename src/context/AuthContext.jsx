import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Vérifie si un token existe dans localStorage au démarrage
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      console.log('📌 Token trouvé dans localStorage:', token);
      fetchUser(token);
    } else {
      setLoading(false);
    }
  }, []);

  // Fonction pour récupérer le profil utilisateur
  const fetchUser = async (token) => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/auth/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(response.data);
    } catch (error) {
      console.error('❌ Erreur récupération profil:', error);
      setUser(null);
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  // Connexion
  const login = async (email, password) => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/auth/login', {
        email,
        password,
      });
      const { access_token } = response.data;
      localStorage.setItem('token', access_token);
      await fetchUser(access_token);
      return true;
    } catch (error) {
      console.error('❌ Erreur de connexion:', error);
      return false;
    }
  };

  // Inscription
  const register = async (username, email, password) => {
    try {
      await axios.post('http://127.0.0.1:8000/auth/register', {
        username,
        email,
        password,
      });
      return true;
    } catch (error) {
      console.error('❌ Erreur d’inscription:', error.response?.data || error);
      return false;
    }
  };

  // Déconnexion
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// ✅ Hook personnalisé pour utiliser facilement le contexte
export const useAuth = () => {
  return React.useContext(AuthContext);
};

export { AuthContext, AuthProvider };
