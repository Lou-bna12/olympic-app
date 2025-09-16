import axios from 'axios';

// On récupère l'URL depuis la variable d’environnement ou fallback localhost
const API_URL = process.env.REACT_APP_API_URL || 'https://api.olympicapp.shop';

console.log('🌍 API URL utilisée :', API_URL);

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login?session=expired';
    }
    return Promise.reject(error);
  }
);

// Auth
export async function login(email, password) {
  const { data } = await api.post('/auth/login', { email, password });
  return data;
}

export async function register(username, email, password) {
  const { data } = await api.post('/auth/register', {
    username,
    email,
    password,
  });
  return data;
}

export async function getProfile() {
  const { data } = await api.get('/auth/me');
  return data;
}

// Réservations
export async function getMyReservations() {
  const { data } = await api.get('/reservations');
  return data;
}

export async function createReservation(payload) {
  const { data } = await api.post('/reservations', payload);
  return data;
}

// Tickets
export async function getMyTickets() {
  const { data } = await api.get('/tickets/me');
  return data;
}

// Paiement mock
export async function simulatePayment(ticketId) {
  const { data } = await api.post('/payment/simulate', { ticket_id: ticketId });
  return data;
}

// Admin
export async function getAdminStats() {
  const { data } = await api.get('/admin/stats');
  return data;
}

export async function getAllReservations() {
  const { data } = await api.get('/admin/reservations/all');
  return data;
}

export async function approveReservation(reservationId) {
  const { data } = await api.post(
    `/admin/reservations/${reservationId}/approve`
  );
  return data;
}

export async function rejectReservation(reservationId) {
  const { data } = await api.post(
    `/admin/reservations/${reservationId}/reject`
  );
  return data;
}

export async function deleteReservation(reservationId) {
  const { data } = await api.delete(`/admin/reservations/${reservationId}`);
  return data;
}

export async function updateReservation(reservationId, updatedData) {
  const { data } = await api.put(
    `/admin/reservations/${reservationId}`,
    updatedData
  );
  return data;
}

export async function generateQRCode(reservationId) {
  const { data } = await api.get(`/admin/reservations/${reservationId}/qrcode`);
  return data;
}

export default api;
