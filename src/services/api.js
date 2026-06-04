import axios from 'axios';

// Usar variable de entorno 
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';
// Crear instancia de Axios con configuración por defecto
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 segundos de timeout
});

// Interceptor para agregar token de autenticación (si lo necesitas después)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores globalmente
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // El servidor respondió con código de error
      console.error('Error de API:', error.response.status, error.response.data);
      
      if (error.response.status === 401) {
        // No autorizado - redirigir a login
        console.warn('No autorizado');
      }
    } else if (error.request) {
      // La petición fue hecha pero no hay respuesta
      console.error('No hay respuesta del servidor:', error.request);
    } else {
      // Error al configurar la petición
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default api;