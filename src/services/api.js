import axios from 'axios';

// Base URL  backend FastAPI
const api = axios.create({
  baseURL: 'http://127.0.0.1:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// === AUTH ===

// Login
export const login = async (email, password) => {
  const response = await api.post('/auth/login', {
    email,
    mot_de_passe: password, // correspond au backend
  });
  return response.data;
};

// Register
export const register = async (nom, prenom, email, mot_de_passe) => {
  const response = await api.post('/auth/register', {
    nom,
    prenom,
    email,
    mot_de_passe,
  });
  return response.data;
};

// Profil utilisateur (token requis)
export const getProfile = async (token) => {
  const response = await api.get('/auth/me', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export default api;
