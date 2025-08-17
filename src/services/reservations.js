import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000';

// Récupérer toutes les réservations
export const getReservations = async () => {
  const response = await axios.get(`${API_URL}/reservations/`);
  return response.data;
};

// Créer une nouvelle réservation
export const createReservation = async (reservation) => {
  const response = await axios.post(`${API_URL}/reservations/`, reservation);
  return response.data;
};

// Récupérer une réservation par ID
export const getReservationById = async (id) => {
  const response = await axios.get(`${API_URL}/reservations/${id}`);
  return response.data;
};

// Mettre à jour une réservation
export const updateReservation = async (id, updatedData) => {
  const response = await axios.put(
    `${API_URL}/reservations/${id}`,
    updatedData
  );
  return response.data;
};

// Supprimer une réservation
export const deleteReservation = async (id) => {
  const response = await axios.delete(`${API_URL}/reservations/${id}`);
  return response.data;
};
