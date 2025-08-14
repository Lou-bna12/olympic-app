// src/services/reservations.js

const USE_MOCK = String(process.env.REACT_APP_USE_MOCK || '1') === '1';
const API_BASE = process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:8000';
const AUTH_CREDENTIALS = process.env.REACT_APP_AUTH_CREDENTIALS || 'omit';

const LS_KEY = 'mock_reservations_v1';

function sleep(ms = 300) {
  return new Promise((r) => setTimeout(r, ms));
}

function getHeaders(token) {
  const h = { 'Content-Type': 'application/json' };
  if (token) h.Authorization = `Bearer ${token}`;
  return h;
}

/* =========================
   MOCK IMPLEMENTATION
   ========================= */
function __mock_read() {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY) || '[]');
  } catch {
    return [];
  }
}
function __mock_write(rows) {
  localStorage.setItem(LS_KEY, JSON.stringify(rows));
}
function __mock_seedIfEmpty() {
  const rows = __mock_read();
  if (rows.length) return;
  const now = Date.now();
  const base = [
    {
      id: String(now - 1),
      email: 'demo@user.com',
      name: 'Demo User',
      date: '2025-08-25',
      time: '19:30',
      guests: 2,
      note: 'Table près de la fenêtre',
      status: 'approved',
      createdAt: new Date(now - 1000 * 60 * 60 * 24).toISOString(),
    },
    {
      id: String(now - 2),
      email: 'admin@site.com',
      name: 'Admin',
      date: '2025-08-28',
      time: '20:00',
      guests: 4,
      note: '',
      status: 'pending',
      createdAt: new Date(now - 1000 * 60 * 60 * 12).toISOString(),
    },
  ];
  __mock_write(base);
}
__mock_seedIfEmpty();

async function mock_listMine(email) {
  await sleep();
  const all = __mock_read();
  return all
    .filter((r) => r.email === email)
    .sort((a, b) => b.id.localeCompare(a.id));
}
async function mock_listAll() {
  await sleep();
  const all = __mock_read();
  return all.sort((a, b) => b.id.localeCompare(a.id));
}
async function mock_create(data) {
  await sleep();
  const all = __mock_read();
  const row = {
    id: String(Date.now() + Math.floor(Math.random() * 1000)),
    status: 'pending',
    createdAt: new Date().toISOString(),
    ...data,
  };
  all.push(row);
  __mock_write(all);
  return row;
}
async function mock_update(id, patch) {
  await sleep();
  const all = __mock_read();
  const idx = all.findIndex((r) => r.id === String(id));
  if (idx === -1) throw new Error('Reservation introuvable');
  all[idx] = { ...all[idx], ...patch };
  __mock_write(all);
  return all[idx];
}
async function mock_remove(id) {
  await sleep();
  const all = __mock_read();
  const next = all.filter((r) => r.id !== String(id));
  __mock_write(next);
  return { ok: true };
}

/* =========================
   REAL API (pour plus tard)
   ========================= */
async function api_fetch(path, opts = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    credentials: AUTH_CREDENTIALS,
    ...opts,
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`HTTP ${res.status} – ${txt || res.statusText}`);
  }
  return res.status === 204 ? null : res.json();
}

async function api_listMine(email, token) {
  return api_fetch(`/reservations/?email=${encodeURIComponent(email)}`, {
    headers: getHeaders(token),
  });
}
async function api_listAll(token) {
  return api_fetch('/reservations/', { headers: getHeaders(token) });
}
async function api_create(data, token) {
  return api_fetch('/reservations/', {
    method: 'POST',
    headers: getHeaders(token),
    body: JSON.stringify(data),
  });
}
async function api_update(id, patch, token) {
  return api_fetch(`/reservations/${id}`, {
    method: 'PATCH',
    headers: getHeaders(token),
    body: JSON.stringify(patch),
  });
}
async function api_remove(id, token) {
  await api_fetch(`/reservations/${id}`, {
    method: 'DELETE',
    headers: getHeaders(token),
  });
  return { ok: true };
}

/* =========================
   PUBLIC API
   ========================= */
const Reservations = {
  listMine: (...args) =>
    USE_MOCK ? mock_listMine(...args) : api_listMine(...args),
  listAll: (...args) =>
    USE_MOCK ? mock_listAll(...args) : api_listAll(...args),
  create: (...args) => (USE_MOCK ? mock_create(...args) : api_create(...args)),
  update: (...args) => (USE_MOCK ? mock_update(...args) : api_update(...args)),
  remove: (...args) => (USE_MOCK ? mock_remove(...args) : api_remove(...args)),
  __mock: {
    reset: () => __mock_write([]),
  },
};

export default Reservations;
