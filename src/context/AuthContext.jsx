// src/context/AuthContext.jsx
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from 'react';

const SESSION_KEY = 'session';
const TOKEN_KEY = 'auth_token';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [authReady, setAuthReady] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  // Config (backend prêt plus tard)
  //const API = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';
  const USE_MOCK =
    String(process.env.REACT_APP_USE_MOCK_AUTH ?? 'true').toLowerCase() ===
    'true';

  // Hydratation depuis le localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (raw) {
        const session = JSON.parse(raw);
        setUser(session.user || null);
        setToken(session.token || null);
        setIsAuthenticated(Boolean(session.token || session.user));
      }
    } catch {
      /* ignore */
    } finally {
      setAuthReady(true);
    }
  }, []);

  const persist = useCallback((newUser, newToken) => {
    const session = { user: newUser, token: newToken || null };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    if (newToken) localStorage.setItem(TOKEN_KEY, newToken);
    else localStorage.removeItem(TOKEN_KEY);
  }, []);

  const login = useCallback(
    async (email, password) => {
      if (USE_MOCK) {
        const fullName =
          localStorage.getItem('register_full_name') ||
          (email ? email.split('@')[0] : 'Utilisateur');
        const newUser = {
          email,
          full_name: fullName,
          nom: fullName,
          role: 'user',
        };
        const newToken = 'local-dev-token';
        setUser(newUser);
        setToken(newToken);
        setIsAuthenticated(true);
        persist(newUser, newToken);
        return { user: newUser, token: newToken };
      }

      throw new Error(
        'Mode backend non activé (REACT_APP_USE_MOCK_AUTH=true).'
      );
    },
    [persist, USE_MOCK /*, API*/]
  );

  const register = useCallback(
    async (fullName, email, password) => {
      if (USE_MOCK) {
        const newUser = {
          email,
          full_name: fullName,
          nom: fullName,
          role: 'user',
        };
        const newToken = 'local-dev-token';
        localStorage.setItem('register_full_name', fullName);
        setUser(newUser);
        setToken(newToken);
        setIsAuthenticated(true);
        persist(newUser, newToken);
        return { user: newUser, token: newToken };
      }

      throw new Error(
        'Mode backend non activé (REACT_APP_USE_MOCK_AUTH=true).'
      );
    },
    [persist, USE_MOCK /*, API*/]
  );

  const logout = useCallback(() => {
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
  }, []);

  // Rôle admin (compatible avec plusieurs conventions backend)
  const isAdmin = useMemo(() => {
    const u = user || {};
    return !!(
      u.is_admin ||
      u.is_staff ||
      u.is_superuser ||
      u.role === 'admin' ||
      (Array.isArray(u.roles) && u.roles.includes('admin')) ||
      (Array.isArray(u.groups) && u.groups.includes('admin'))
    );
  }, [user]);

  const value = useMemo(
    () => ({
      authReady,
      isAuthenticated,
      isAdmin,
      user,
      token,
      login,
      register,
      logout,
    }),
    [authReady, isAuthenticated, isAdmin, user, token, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
