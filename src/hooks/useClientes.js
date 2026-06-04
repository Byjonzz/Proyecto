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
      
      // ✅ Normalizar los datos para tener el nombre completo
      const canvaceadoresNormalizados = data.map(c => ({
        ...c,
        nombreCompleto: getNombreCompletoCanvaceador(c)
      }));
      
      setCanvaceadores(canvaceadoresNormalizados);
      setError(null);
      console.log('✅ Canvaceadores cargados:', canvaceadoresNormalizados);
    } catch (err) {
      setError(err.message);
      console.error('❌ Error al cargar canvaceadores:', err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Función robusta para extraer el nombre del canvaceador
  const getNombreCompletoCanvaceador = (canvaceador) => {
    // Intenta diferentes estructuras posibles del serializer
    if (canvaceador.nombre_completo) return canvaceador.nombre_completo;
    if (canvaceador.nombre) return canvaceador.nombre;
    
    // Si viene el objeto usuario anidado
    if (canvaceador.usuario) {
      const nombre = canvaceador.usuario.nombre || '';
      const apellido = canvaceador.usuario.apellido || '';
      return `${nombre} ${apellido}`.trim() || `Canvaceador #${canvaceador.id}`;
    }
    
    // Si viene como usuario_id (solo el ID)
    if (canvaceador.usuario_id && typeof canvaceador.usuario_id === 'object') {
      const nombre = canvaceador.usuario_id.nombre || '';
      const apellido = canvaceador.usuario_id.apellido || '';
      return `${nombre} ${apellido}`.trim() || `Canvaceador #${canvaceador.id}`;
    }
    
    // Fallback: usar número de empleado
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