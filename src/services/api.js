// src/services/api.js
import axios from 'axios';

export const BASE_URL = (
  process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000'
).replace(/\/+$/, '');

export const AUTH_LOGIN_PATH = process.env.REACT_APP_AUTH_LOGIN_PATH || null;
export const AUTH_REGISTER_PATH =
  process.env.REACT_APP_AUTH_REGISTER_PATH || null;

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: false,
});

api.interceptors.request.use((config) => {
  const t = localStorage.getItem('token');
  if (t && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${t}`;
  }
  return config;
});

export const apiGet = async (path, config) =>
  (await api.get(path, config)).data;
export const apiPost = async (path, data, config) => {
  // 👉 debug utile pour voir exactement ce qui est tenté
  console.debug('[apiPost] POST', `${BASE_URL}${path}`, data);
  return (await api.post(path, data, config)).data;
};
export const apiDelete = async (path, config) =>
  (await api.delete(path, config)).data;

// Réservations (inchangé)
export const searchReservations = (params) => {
  const q = new URLSearchParams(params || {}).toString();
  return apiGet(`/reservations/${q ? `?${q}` : ''}`);
};
export const listAllReservations = () => apiGet('/reservations/all');
export const deleteReservation = (id) => apiDelete(`/reservations/${id}`);
export const createReservation = (payload) =>
  apiPost('/reservations/', payload);
export const getReservation = (id) => apiGet(`/reservations/${id}`);

export default api;
