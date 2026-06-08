import { useState, useEffect } from 'react';
import { contratosService } from '../services/contratosService';

export const useContratos = () => {
  const [contratos, setContratos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchContratos = async () => {
    try {
      setLoading(true);
      const data = await contratosService.getAll();
      setContratos(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error al cargar contratos:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPendientes = async () => {
    try {
      setLoading(true);
      const data = await contratosService.getPendientes();
      setContratos(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error al cargar contratos pendientes:', err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ NUEVA FUNCIÓN: Obtener contratos asignados a un técnico
  const fetchByTecnico = async (tecnicoId) => {
    try {
      setLoading(true);
      const data = await contratosService.getByTecnico(tecnicoId);
      setContratos(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error al cargar contratos del técnico:', err);
    } finally {
      setLoading(false);
    }
  };

  const createContrato = async (data) => {
    try {
      const nuevoContrato = await contratosService.create(data);
      setContratos([...contratos, nuevoContrato]);
      return nuevoContrato;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateContrato = async (id, data) => {
    try {
      const contratoActualizado = await contratosService.update(id, data);
      setContratos(contratos.map(c => c.id === id ? contratoActualizado : c));
      return contratoActualizado;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const asignarCita = async (id, data) => {
    try {
      const contratoActualizado = await contratosService.asignarCita(id, data);
      setContratos(contratos.map(c => c.id === id ? contratoActualizado : c));
      return contratoActualizado;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // ✅ NUEVA FUNCIÓN: Completar instalación
  const completarInstalacion = async (id, data) => {
    try {
      const contratoActualizado = await contratosService.patch(id, {
        estatus: 'Completado',
        ...data
      });
      setContratos(contratos.map(c => c.id === id ? contratoActualizado : c));
      return contratoActualizado;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const deleteContrato = async (id) => {
    try {
      await contratosService.delete(id);
      setContratos(contratos.filter(c => c.id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  useEffect(() => {
    fetchContratos();
  }, []);

  return {
    contratos,
    loading,
    error,
    createContrato,
    updateContrato,
    asignarCita,
    completarInstalacion,
    deleteContrato,
    refetch: fetchContratos,
    refetchPendientes: fetchPendientes,
    refetchByTecnico: fetchByTecnico
  };
};