import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  useContext,
} from 'react';
import { login, register } from '../services/api';

export const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [authReady, setAuthReady] = useState(false);

  // Récupération du profil utilisateur
  const fetchUserProfile = useCallback(async () => {
    if (!token) {
      setAuthReady(true);
      return;
    }
    try {
      const res = await fetch('http://127.0.0.1:8000/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération du profil :', error);
    } finally {
      setAuthReady(true);
    }
  }, [token]);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  // Connexion
  const loginUser = async (email, password) => {
    const data = await login(email, password);
    setToken(data.access_token);
    localStorage.setItem('token', data.access_token);
    await fetchUserProfile();
  };

  // Inscription
  const registerUser = async (nom, prenom, email, password) => {
    const data = await register(nom, prenom, email, password);
    setToken(data.access_token);
    localStorage.setItem('token', data.access_token);
    await fetchUserProfile();
  };

  // Déconnexion
  const logoutUser = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        authReady,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        loginUser,
        registerUser,
        logoutUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
