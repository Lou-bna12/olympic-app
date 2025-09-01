import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000';

// Récupérer les réservations de l'utilisateur connecté
export const getMyReservations = async (token) => {
  const response = await axios.get(`${API_URL}/reservations/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// Créer une nouvelle réservation
export const createReservation = async (reservation, token) => {
  const response = await axios.post(`${API_URL}/reservations/`, reservation, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// Récupérer les statistiques
export const getReservationStats = async (token) => {
  const response = await axios.get(`${API_URL}/reservations/stats`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
