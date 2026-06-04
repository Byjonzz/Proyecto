import api from './api';

const ENDPOINT = '/prospectos/';

export const prospectosService = {
  // Obtener todos los prospectos
  getAll: async () => {
    try {
      const response = await api.get(ENDPOINT);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Obtener un prospecto por ID
  getById: async (id) => {
    try {
      const response = await api.get(`${ENDPOINT}${id}/`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Crear nuevo prospecto
  create: async (data) => {
    try {
      const response = await api.post(ENDPOINT, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Actualizar prospecto
  update: async (id, data) => {
    try {
      const response = await api.put(`${ENDPOINT}${id}/`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Eliminar prospecto
  delete: async (id) => {
    try {
      const response = await api.delete(`${ENDPOINT}${id}/`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Filtrar prospectos por estado
  getByEstado: async (estado) => {
    try {
      const response = await api.get(`${ENDPOINT}?estado=${estado}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};