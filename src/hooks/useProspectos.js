import { useState, useEffect } from 'react';
import { prospectosService } from '../services/prospectosService';

export const useProspectos = () => {
  const [prospectos, setProspectos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProspectos = async () => {
    try {
      setLoading(true);
      const data = await prospectosService.getAll();
      setProspectos(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProspectos();
  }, []);

  const createProspecto = async (data) => {
    try {
      const nuevoProspecto = await prospectosService.create(data);
      setProspectos([...prospectos, nuevoProspecto]);
      return nuevoProspecto;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateProspecto = async (id, data) => {
    try {
      const prospectoActualizado = await prospectosService.update(id, data);
      setProspectos(prospectos.map(p => p.id === id ? prospectoActualizado : p));
      return prospectoActualizado;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const deleteProspecto = async (id) => {
    try {
      await prospectosService.delete(id);
      setProspectos(prospectos.filter(p => p.id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return {
    prospectos,
    loading,
    error,
    createProspecto,
    updateProspecto,
    deleteProspecto,
    refetch: fetchProspectos
  };
};