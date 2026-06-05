import api from './api';

const ENDPOINT = '/contratos/';

export const contratosService = {
  // Obtener todos los contratos
  getAll: async () => {
    try {
      const response = await api.get(ENDPOINT);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Obtener un contrato por ID
  getById: async (id) => {
    try {
      const response = await api.get(`${ENDPOINT}${id}/`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Crear nuevo contrato
  create: async (data) => {
    try {
      const response = await api.post(ENDPOINT, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Actualizar contrato completo
  update: async (id, data) => {
    try {
      const response = await api.put(`${ENDPOINT}${id}/`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Actualizar parcialmente un contrato (solo algunos campos)
  patch: async (id, data) => {
    try {
      const response = await api.patch(`${ENDPOINT}${id}/`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Eliminar contrato
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
  },

  // ✅ NUEVO: Obtener contratos pendientes de asignar
  getPendientes: async () => {
    try {
      const response = await api.get(`${ENDPOINT}?estatus=Pendiente%20Asignar`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // ✅ NUEVO: Obtener contratos por estatus específico
  getByEstatus: async (estatus) => {
    try {
      const response = await api.get(`${ENDPOINT}?estatus=${encodeURIComponent(estatus)}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // ✅ NUEVO: Obtener contratos asignados a un técnico
  getByTecnico: async (tecnicoId) => {
    try {
      const response = await api.get(`${ENDPOINT}?tecnico=${tecnicoId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // ✅ NUEVO: Obtener contratos por canvaceador
  getByCanvaceador: async (canvaceadorId) => {
    try {
      const response = await api.get(`${ENDPOINT}?canvaceador=${canvaceadorId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // ✅ NUEVO: Asignar técnico y fecha a un contrato
  asignarCita: async (id, data) => {
    try {
      const response = await api.patch(`${ENDPOINT}${id}/`, {
        estatus: 'Asignado',
        ...data
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // ✅ NUEVO: Marcar contrato como completado
  completar: async (id) => {
    try {
      const response = await api.patch(`${ENDPOINT}${id}/`, {
        estatus: 'Completado'
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};