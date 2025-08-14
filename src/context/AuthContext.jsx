// src/context/AuthContext.jsx
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

const TOKEN_KEY = 'auth_token';
const SESSION_KEY = 'session';

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [authReady, setAuthReady] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (raw) {
        const session = JSON.parse(raw);
        setUser(session.user || null);
        setToken(session.token || null);
      }
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

  // --- MOCK login/register (backend plus tard)
  const login = useCallback(
    async (email, _password, role = 'user') => {
      const fullName =
        localStorage.getItem('register_full_name') || email.split('@')[0];
      const newUser = { email, full_name: fullName, nom: fullName, role };
      const newToken = 'local-dev-token';
      setUser(newUser);
      setToken(newToken);
      persist(newUser, newToken);
      return { user: newUser, token: newToken };
    },
    [persist]
  );

  const register = useCallback(
    async (fullName, email, _password, role = 'user') => {
      const newUser = { email, full_name: fullName, nom: fullName, role };
      const newToken = 'local-dev-token';
      localStorage.setItem('register_full_name', fullName);
      setUser(newUser);
      setToken(newToken);
      persist(newUser, newToken);
      return { user: newUser, token: newToken };
    },
    [persist]
  );

  const logout = useCallback(() => {
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
    setToken(null);
  }, []);

  const isAuthenticated = !!user;

  // 🔐 Calcul du rôle admin (fonctionne aussi quand on branchera un vrai backend)
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

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export const useAuth = () => useContext(AuthCtx);
