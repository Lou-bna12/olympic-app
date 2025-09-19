import axios from 'axios';

export const API_URL =
  process.env.REACT_APP_API_URL || 'https://api.olympicapp.shop';

console.log(' API URL utilisée :', API_URL);

// Création d'une instance axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

//  Intercepteur pour ajouter automatiquement le token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// AUTH
export const loginUser = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

export const registerUser = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

export const getProfile = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

// RESERVATIONS
export const createReservation = async (reservationData, token) => {
  const response = await api.post('/reservations', reservationData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getReservations = async (token) => {
  const response = await api.get('/reservations', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getMyReservations = async (token) => {
  const response = await api.get('/reservations', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// TICKETS
export const getMyTickets = async (token) => {
  const response = await api.get('/tickets/me', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const createTicket = async (offerId, token) => {
  const response = await api.post(
    `/tickets/?offer_id=${offerId}`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

//PAYMENTS
export const simulatePayment = async ({ ticketId, reservationId }, token) => {
  const payload = {};
  if (ticketId) payload.ticket_id = ticketId;
  if (reservationId) payload.reservation_id = reservationId;

  const response = await api.post('/payment/simulate', payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// ADMIN
export const getAllUsers = async (token) => {
  const response = await api.get('/admin/users', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const deleteUser = async (userId, token) => {
  const response = await api.delete(`/admin/users/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getAdminStats = async (token) => {
  const response = await api.get('/admin/stats', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getAllReservations = async (token) => {
  const response = await api.get('/admin/reservations', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const approveReservation = async (reservationId, token) => {
  const response = await api.put(
    `/admin/reservations/${reservationId}/approve`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

export const updateReservation = async (reservationId, updateData, token) => {
  const response = await api.put(
    `/admin/reservations/${reservationId}`,
    updateData,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

export const rejectReservation = async (reservationId, token) => {
  const response = await api.put(
    `/admin/reservations/${reservationId}/reject`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

export const deleteReservation = async (reservationId, token) => {
  const response = await api.delete(`/admin/reservations/${reservationId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export default api;
