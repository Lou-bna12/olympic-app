import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000';

// --- Axios instance ---
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- Intercepteur pour ajouter le token ---
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // Utilisez 'token' et non 'authToken'
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// --- Gestion des erreurs d'authentification ---
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expiré ou invalide
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login?session=expired';
    }
    return Promise.reject(error);
  }
);

// --- Fonctions spécifiques Auth ---
export async function login(email, password) {
  const response = await api.post('/auth/login', {
    email,
    password,
  });
  return response.data;
}

export async function register(username, email, password) {
  const response = await api.post('/auth/register', {
    username,
    email,
    password,
  });
  return response.data;
}

// --- Fonctions pour les réservations ---
export async function getMyReservations() {
  const response = await api.get('/reservations/me');
  return response.data;
}

export async function createReservation(reservationData) {
  const response = await api.post('/reservations/', reservationData);
  return response.data;
}

export const getProfile = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

export default api;
