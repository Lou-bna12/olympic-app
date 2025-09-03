import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authReady, setAuthReady] = useState(false);

  // Supprimer l'état isAdmin séparé et le calculer à partir de user
  const isAdmin = user?.is_admin === true;

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUser(token);
    } else {
      setLoading(false);
      setAuthReady(true);
      setIsAuthenticated(false);
    }
  }, []);

  const fetchUser = async (token) => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log('User data from API:', response.data); // Debug

      setUser(response.data);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(response.data));
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
      const response = await axios.post('http://127.0.0.1:8000/auth/login', {
        email,
        password,
      });
      const { access_token } = response.data;
      localStorage.setItem('token', access_token);
      await fetchUser(access_token);
      return true;
    } catch (error) {
      console.error('Erreur de connexion:', error);
      setIsAuthenticated(false);
      return false;
    }
  };

  // Inscription
  const register = async (username, email, password) => {
    // SUPPRIMER le paramètre role
    try {
      await axios.post('http://127.0.0.1:8000/auth/register', {
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
        isAdmin, // Maintenant calculé à partir de user
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
