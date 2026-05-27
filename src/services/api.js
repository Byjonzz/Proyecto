import axios from 'axios';

// Cambiar por la URL de tu backend
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token si es necesario
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Leads
export const leadService = {
  getAll: () => axiosInstance.get('/leads'),
  getById: (id) => axiosInstance.get(`/leads/${id}`),
  create: (data) => axiosInstance.post('/leads', data),
  update: (id, data) => axiosInstance.put(`/leads/${id}`, data),
  delete: (id) => axiosInstance.delete(`/leads/${id}`),
};

// Prospects (Prospectos)
export const prospectService = {
  getAll: () => axiosInstance.get('/prospects'),
  getById: (id) => axiosInstance.get(`/prospects/${id}`),
  create: (data) => axiosInstance.post('/prospects', data),
  update: (id, data) => axiosInstance.put(`/prospects/${id}`, data),
  delete: (id) => axiosInstance.delete(`/prospects/${id}`),
};

// Quotes (Cotizaciones)
export const quoteService = {
  getAll: () => axiosInstance.get('/quotes'),
  getById: (id) => axiosInstance.get(`/quotes/${id}`),
  create: (data) => axiosInstance.post('/quotes', data),
  update: (id, data) => axiosInstance.put(`/quotes/${id}`, data),
};

// Installations (Instalaciones)
export const installationService = {
  getAll: () => axiosInstance.get('/installations'),
  getSchedule: (startDate, endDate) => 
    axiosInstance.get('/installations/schedule', { params: { startDate, endDate } }),
  create: (data) => axiosInstance.post('/installations', data),
  update: (id, data) => axiosInstance.put(`/installations/${id}`, data),
};

// Reports (Reportes)
export const reportService = {
  getMetrics: (dateRange) => axiosInstance.get('/reports/metrics', { params: dateRange }),
  getSalesByPlan: (dateRange) => axiosInstance.get('/reports/sales-by-plan', { params: dateRange }),
  getLeadStatus: () => axiosInstance.get('/reports/lead-status'),
};

// Coverage Map (Mapa de cobertura)
export const coverageService = {
  getZones: () => axiosInstance.get('/coverage/zones'),
  getClients: (zoneId) => axiosInstance.get(`/coverage/zones/${zoneId}/clients`),
};

// Auth (Autenticación)
export const authService = {
  login: (email, password) => axiosInstance.post('/auth/login', { email, password }),
  logout: () => axiosInstance.post('/auth/logout'),
  getProfile: () => axiosInstance.get('/auth/profile'),
};

export default axiosInstance;
