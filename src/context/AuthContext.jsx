import React, { createContext, useState, useEffect, useContext } from 'react';
import api, { getProfile } from '../services/api'; // Importez depuis votre utilitaire

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authReady, setAuthReady] = useState(false);

  const isAdmin = user?.is_admin === true;

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUser();
    } else {
      setLoading(false);
      setAuthReady(true);
      setIsAuthenticated(false);
    }
  }, []);

  const fetchUser = async () => {
    try {
      const userData = await getProfile(); // Utilisez la fonction de votre utilitaire
      console.log('User data from API:', userData); // Debug

      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      console.error('Erreur récupération profil:', error);
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } finally {
      setLoading(false);
      setAuthReady(true);
    }
  };

  // Connexion
  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', {
        email,
        password,
      });
      const { access_token } = response.data;
      localStorage.setItem('token', access_token);
      await fetchUser();
      return true;
    } catch (error) {
      console.error('Erreur de connexion:', error);
      setIsAuthenticated(false);
      return false;
    }
  };

  // Inscription
  const register = async (username, email, password) => {
    try {
      await api.post('/auth/register', {
        username,
        email,
        password,
      });
      return true;
    } catch (error) {
      console.error("Erreur d'inscription:", error.response?.data || error);
      return false;
    }
  };

  // Déconnexion
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated,
        isAdmin,
        authReady,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook personnalisé
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { AuthContext, AuthProvider };
