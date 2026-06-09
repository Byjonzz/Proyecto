import api from './api';

const ENDPOINT = '/instalaciones/';

export const instalacionesService = {
  getAll: async () => {
    try {
      const response = await api.get(ENDPOINT);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const response = await api.get(`${ENDPOINT}${id}/`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  create: async (data) => {
    try {
      const response = await api.post(ENDPOINT, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  update: async (id, data) => {
    try {
      const response = await api.put(`${ENDPOINT}${id}/`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const response = await api.delete(`${ENDPOINT}${id}/`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  
  getByTecnico: async (tecnicoId) => {
    try {
      const response = await api.get(`${ENDPOINT}?tecnico=${tecnicoId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  
  getByEstado: async (estado) => {
    try {
      const response = await api.get(`${ENDPOINT}?estado=${estado}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};