import axios from 'axios';

export const BASE_URL = 'http://127.0.0.1:8000';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Login
export const login = async (email, password) => {
  const response = await api.post('/login', {
    email,
    mot_de_passe: password,
  });
  return response.data;
};

// Signup
export const register = async (nom, prenom, email, mot_de_passe) => {
  const response = await api.post('/signup', {
    nom,
    prenom,
    email,
    mot_de_passe,
  });
  return response.data;
};

// Appel API générique avec Axios
export const api_fetch = async (url, options = {}, token = null) => {
  const config = {
    url,
    method: options.method || 'GET',
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  if (options.data) config.data = options.data;

  const response = await api.request(config);
  return response.data;
};

export default api;
