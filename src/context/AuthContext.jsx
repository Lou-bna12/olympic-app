import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
} from 'react';
import api, { getProfile } from '../services/api';

const AuthContext = createContext();

const setAuthHeader = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authReady, setAuthReady] = useState(false);
  const [authError, setAuthError] = useState(null);

  const isAdmin = user?.is_admin === true;

  const fetchUser = useCallback(async () => {
    try {
      const userData = await getProfile();
      console.log('User data from API:', userData);

      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(userData));
      setAuthError(null);
    } catch (error) {
      console.error('Erreur récupération profil:', error);

      if (error.response?.status === 401) {
        setAuthError('Session expirée. Veuillez vous reconnecter.');
        logout(); // nettoie token + état
      } else {
        setAuthError('Erreur lors de la récupération du profil utilisateur.');
      }
    } finally {
      setLoading(false);
      setAuthReady(true);
    }
  }, []);

  const isTokenExpired = (token) => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expirationTime = payload.exp * 1000;
      return Date.now() >= expirationTime;
    } catch (error) {
      console.error('Erreur lors de la vérification du token:', error);
      return true;
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');

      if (token) {
        if (isTokenExpired(token)) {
          console.warn('Token expiré, déconnexion automatique');
          logout();
          setAuthError('Votre session a expiré. Veuillez vous reconnecter.');
        } else {
          // IMPORTANT : propager le token sur l’instance Axios
          setAuthHeader(token);
          await fetchUser();
        }
      } else {
        setLoading(false);
        setAuthReady(true);
        setIsAuthenticated(false);
      }
    };

    initAuth();
  }, [fetchUser]);

  // Connexion
  const login = async (email, password) => {
    try {
      setAuthError(null);
      const response = await api.post('/auth/login', { email, password });

      const { access_token } = response.data;

      if (access_token) {
        // 1) Stocker le token
        localStorage.setItem('token', access_token);
        // 2) Le mettre dans Axios pour les prochaines requêtes
        setAuthHeader(access_token);
        // 3) Passer en "authentifié" immédiatement (l’API confirmera avec /auth/me)
        setIsAuthenticated(true);
      } else {
        console.error('❌ Pas de token reçu :', response.data);
        setAuthError('Réponse de login invalide.');
        return { success: false, error: 'Réponse de login invalide' };
      }

      // Récupérer le profil
      await fetchUser();
      return { success: true };
    } catch (error) {
      console.error('Erreur de connexion:', error);

      let errorMessage = 'Erreur de connexion';
      if (error.response?.status === 401) {
        errorMessage = 'Email ou mot de passe incorrect';
      } else if (error.response?.status === 429) {
        errorMessage = 'Trop de tentatives. Veuillez réessayer plus tard.';
      } else if (!error.response) {
        errorMessage = 'Problème de connexion au serveur';
      }

      setAuthError(errorMessage);
      setIsAuthenticated(false);
      return { success: false, error: errorMessage };
    }
  };

  // Inscription
  const register = async (username, email, password) => {
    try {
      setAuthError(null);
      const response = await api.post('/auth/register', {
        username,
        email,
        password,
      });

      if (response.data.access_token) {
        localStorage.setItem('token', response.data.access_token);
        setAuthHeader(response.data.access_token);
        setIsAuthenticated(true);
        await fetchUser();
        return { success: true, autoLogin: true };
      }

      return { success: true, autoLogin: false };
    } catch (error) {
      console.error("Erreur d'inscription:", error.response?.data || error);

      let errorMessage = "Erreur lors de l'inscription";
      if (error.response?.status === 409) {
        errorMessage = "Cet email ou nom d'utilisateur est déjà utilisé";
      } else if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        errorMessage = Object.values(errors).flat().join(', ');
      } else if (!error.response) {
        errorMessage = 'Problème de connexion au serveur';
      }

      setAuthError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Rafraîchir le token (si tu l’utilises)
  const refreshToken = async () => {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) throw new Error('No refresh token available');

      const response = await api.post('/auth/refresh', {
        refresh_token: refreshToken,
      });
      const { access_token } = response.data;

      localStorage.setItem('token', access_token);
      setAuthHeader(access_token);
      return true;
    } catch (error) {
      console.error('Erreur lors du rafraîchissement du token:', error);
      logout();
      return false;
    }
  };

  // Déconnexion
  const logout = () => {
    try {
      api
        .post('/auth/logout')
        .catch((err) =>
          console.error('Erreur lors de la déconnexion API:', err)
        );
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }

    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    setAuthHeader(null);
    setUser(null);
    setIsAuthenticated(false);
    setAuthError(null);
  };

  const clearError = () => setAuthError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated,
        isAdmin,
        authReady,
        authError,
        login,
        register,
        logout,
        refreshToken,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};

export { AuthContext, AuthProvider };
