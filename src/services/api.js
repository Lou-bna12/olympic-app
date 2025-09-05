import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000';

// --- Axios instance ---
const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
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

//  Auth
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

export const getProfile = async () => {
  const { data } = await api.get('/auth/me');
  return data;
};

export async function getMyReservations() {
  const { data } = await api.get('/reservations/me');
  return data;
}

export async function createReservation(reservationData) {
  const { data } = await api.post('/reservations/', reservationData);
  return data;
}

//  Admin
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

export async function generateQRCode(reservationId) {
  const { data } = await api.get(`/admin/reservations/${reservationId}/qrcode`);
  return data;
}

export async function updateReservation(reservationId, updatedData) {
  const { data } = await api.put(
    `/admin/reservations/${reservationId}`,
    updatedData
  );
  return data;
}

export default api;
