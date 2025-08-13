// src/services/api.js
import axios from 'axios';

// CRA lit via process.env.REACT_APP_*
const baseURL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';

const api = axios.create({ baseURL });

// console.log('API baseURL =', api.defaults.baseURL);

export default api;
