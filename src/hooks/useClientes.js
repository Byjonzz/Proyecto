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
      
      
      const canvaceadoresNormalizados = data.map(c => ({
        ...c,
        nombreCompleto: getNombreCompletoCanvaceador(c)
      }));
      
      setCanvaceadores(canvaceadoresNormalizados);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  
  const getNombreCompletoCanvaceador = (canvaceador) => {
    
    if (canvaceador.nombre_completo) return canvaceador.nombre_completo;
    if (canvaceador.nombre) return canvaceador.nombre;
    
    
    if (canvaceador.usuario) {
      const nombre = canvaceador.usuario.nombre || '';
      const apellido = canvaceador.usuario.apellido || '';
      return `${nombre} ${apellido}`.trim() || `Canvaceador #${canvaceador.id}`;
    }
    
    
    if (canvaceador.usuario_id && typeof canvaceador.usuario_id === 'object') {
      const nombre = canvaceador.usuario_id.nombre || '';
      const apellido = canvaceador.usuario_id.apellido || '';
      return `${nombre} ${apellido}`.trim() || `Canvaceador #${canvaceador.id}`;
    }
    
    
    if (canvaceador.numero_empleado) {
      return `Empleado: ${canvaceador.numero_empleado}`;
    }
    
    return `Canvaceador #${canvaceador.id}`;
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