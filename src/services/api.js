import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';

console.log(' API URL utilisée :', API_URL);

//  AUTH
export const loginUser = async (credentials) => {
  const response = await axios.post(`${API_URL}/auth/login`, credentials);
  return response.data;
};

export const registerUser = async (userData) => {
  const response = await axios.post(`${API_URL}/auth/register`, userData);
  return response.data;
};

export const getProfile = async (token) => {
  const response = await axios.get(`${API_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// RESERVATIONS
export const createReservation = async (reservationData, token) => {
  const response = await axios.post(
    `${API_URL}/reservations`,
    reservationData,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

export const getReservations = async (token) => {
  const response = await axios.get(`${API_URL}/reservations`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// TICKETS
export const getMyTickets = async (token) => {
  const response = await axios.get(`${API_URL}/tickets/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const createTicket = async (offerId, token) => {
  const response = await axios.post(
    `${API_URL}/tickets/?offer_id=${offerId}`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

// PAYMENTS MOCK
export const simulatePayment = async (ticketId, token) => {
  const response = await axios.post(
    `${API_URL}/payment/simulate`,
    { ticket_id: ticketId },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

// ADMIN
export const getAllUsers = async (token) => {
  const response = await axios.get(`${API_URL}/admin/users`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const deleteUser = async (userId, token) => {
  const response = await axios.delete(`${API_URL}/admin/users/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

//  Export par défaut obligatoire pour tes imports
const api = {
  loginUser,
  registerUser,
  getProfile,
  createReservation,
  getReservations,
  getMyTickets,
  createTicket,
  simulatePayment,
  getAllUsers,
  deleteUser,
};

export default api;
