import { useState, useEffect } from 'react';
import { canvaceadoresService } from '../services/canvaceadoresService';

export const useCanvaceadores = () => {
  const [canvaceadores, setCanvaceadores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCanvaceadores = async () => {
    try {
      setLoading(true);
      const data = await canvaceadoresService.getAll();
      setCanvaceadores(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCanvaceadores();
  }, []);

  return {
    canvaceadores,
    loading,
    error,
    refetch: fetchCanvaceadores
  };
};