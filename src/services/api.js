import axios from 'axios';

// URL de l'API (Vercel => prend REACT_APP_API_URL, sinon localhost)
const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';
console.log(' API URL utilisée :', API_URL);

// Création d'une instance Axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

//  AUTH
export async function registerUser(userData) {
  try {
    const response = await api.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    console.error('Erreur registerUser:', error);
    throw error;
  }
}

export async function loginUser(credentials) {
  try {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  } catch (error) {
    console.error('Erreur loginUser:', error);
    throw error;
  }
}

//Récupérer le profil utilisateur connecté
export async function getProfile(token) {
  try {
    const response = await api.get('/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Erreur getProfile:', error);
    throw error;
  }
}

//  RESERVATIONS
export async function createReservation(data, token) {
  try {
    const response = await api.post('/reservations', data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Erreur createReservation:', error);
    throw error;
  }
}

export async function getReservations(token) {
  try {
    const response = await api.get('/reservations', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Erreur getReservations:', error);
    throw error;
  }
}

//  TICKETS
export async function getMyTickets(token) {
  try {
    const response = await api.get('/tickets/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Erreur getMyTickets:', error);
    throw error;
  }
}

export async function createTicket(offerId, token) {
  try {
    const response = await api.post(
      `/tickets/?offer_id=${offerId}`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Erreur createTicket:', error);
    throw error;
  }
}

//  PAYMENT MOCK
export async function simulatePayment(ticketId, token) {
  try {
    const response = await api.post(
      '/payment/simulate',
      { ticket_id: ticketId },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Erreur simulatePayment:', error);
    throw error;
  }
}

//  ADMIN
export async function getAllTickets(token) {
  try {
    const response = await api.get('/tickets', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Erreur getAllTickets:', error);
    throw error;
  }
}
export default api;
