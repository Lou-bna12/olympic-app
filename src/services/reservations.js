import { api_fetch } from './api';

export function api_listAll(token) {
  return api_fetch('/reservations/', { method: 'GET' }, token);
}

export function api_listMine(token) {
  return api_fetch('/reservations/mine', { method: 'GET' }, token);
}

export function api_read(id, token) {
  return api_fetch(`/reservations/${id}`, { method: 'GET' }, token);
}

export function api_create(reservationData, token) {
  return api_fetch(
    '/reservations/',
    {
      method: 'POST',
      data: reservationData,
    },
    token
  );
}

export function api_update(id, reservationData, token) {
  return api_fetch(
    `/reservations/${id}`,
    {
      method: 'PATCH',
      data: reservationData,
    },
    token
  );
}

export function api_replace(id, reservationData, token) {
  return api_fetch(
    `/reservations/${id}`,
    {
      method: 'PUT',
      data: reservationData,
    },
    token
  );
}

export function api_delete(id, token) {
  return api_fetch(
    `/reservations/${id}`,
    {
      method: 'DELETE',
    },
    token
  );
}
