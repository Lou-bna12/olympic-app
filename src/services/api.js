import axios from 'axios';

// Vérification de la variable injectée par Vercel
console.log(' API URL injectée :', process.env.REACT_APP_API_URL);

const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';

// Création d'une instance Axios
const api = axios.create({
  baseURL: API_URL,
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json',
  },
});

//AUTH

// Register
export const registerUser = (userData) => api.post('/auth/register', userData);

// Login
export const loginUser = (credentials) => api.post('/auth/login', credentials);

// Get current user
export const getCurrentUser = (token) =>
  api.get('/auth/me', {
    headers: { Authorization: `Bearer ${token}` },
  });

// = RESERVATIONS

export const createReservation = (reservationData, token) =>
  api.post('/reservations', reservationData, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const getReservations = (token) =>
  api.get('/reservations', {
    headers: { Authorization: `Bearer ${token}` },
  });

//  TICKETS

export const getMyTickets = (token) =>
  api.get('/tickets/me', {
    headers: { Authorization: `Bearer ${token}` },
  });

export const createTicket = (offerId, token) =>
  api.post(
    `/tickets/?offer_id=${offerId}`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

// PAYMENT MOCK

export const simulatePayment = (paymentData, token) =>
  api.post('/payment/simulate', paymentData, {
    headers: { Authorization: `Bearer ${token}` },
  });

//  ADMIN

export const getAllTickets = (token) =>
  api.get('/tickets', {
    headers: { Authorization: `Bearer ${token}` },
  });

export const updateTicketStatus = (ticketId, status, token) =>
  api.put(
    `/tickets/${ticketId}`,
    { status },
    { headers: { Authorization: `Bearer ${token}` } }
  );

export default api;
