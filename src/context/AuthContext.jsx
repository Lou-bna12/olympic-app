import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import { api_fetch } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = useCallback(async (token) => {
    try {
      const data = await api_fetch('/auth/me', {}, token);
      setUser(data);
    } catch (err) {
      console.error('Erreur fetchUserProfile:', err);
      setUser(null);
    }
  }, []);

  useEffect(() => {
    if (token) {
      fetchUserProfile(token);
    }
    setLoading(false);
  }, [token, fetchUserProfile]);

  const login = async (email, password) => {
    const data = await api_fetch('/auth/login', { email, password });
    if (data.access_token) {
      setToken(data.access_token);
      localStorage.setItem('token', data.access_token);
      await fetchUserProfile(data.access_token);
    }
    return data;
  };

  const register = async (username, email, password) => {
    return await api_fetch('/auth/register', { username, email, password });
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider
      value={{ user, token, login, register, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
