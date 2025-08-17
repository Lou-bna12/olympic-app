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
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// --- Fonctions spécifiques Auth ---
export async function login(email, password) {
  const response = await api.post('/auth/login', {
    email,
    password, // ✅ champ attendu par le backend
  });
  return response.data;
}

export async function register(nom, prenom, email, password) {
  const response = await api.post('/auth/register', {
    nom,
    prenom,
    email,
    password, // ✅ champ attendu par le backend
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

export const getProfile = async (token) => {
  const response = await axios.get(`${API_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export default api;
