import api from './api';

const ENDPOINT = '/contratos/';

export const contratosService = {
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

  // Obtener contratos por cliente
  getByCliente: async (clienteId) => {
    try {
      const response = await api.get(`${ENDPOINT}?cliente=${clienteId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};