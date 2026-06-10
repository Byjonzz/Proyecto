import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

export const usePlanes = () => {
  const [planes, setPlanes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);

  const fetchPlanes = useCallback(async () => {
    try {
      setLoading(true);
      console.log('📡 [usePlanes] Solicitando planes desde API...');
      
      const response = await api.get('/planes/');
      console.log('✅ [usePlanes] Total de planes recibidos:', response.data.length);
      
      if (!Array.isArray(response.data)) {
        setPlanes([]);
        return;
      }
      
      const planesActivos = response.data.filter(p => p.activo === true);
      console.log('✅ [usePlanes] Planes activos:', planesActivos.length);
      
      const categoriasUnicas = [...new Set(planesActivos.map(p => p.categoria))];
      console.log('📊 [usePlanes] Categorías:', categoriasUnicas);
      
      setPlanes(planesActivos);
      setLastUpdate(new Date());
    } catch (err) {
      console.error('❌ [usePlanes] Error:', err);
      setError(err.message);
      setPlanes([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPlanes();
    
    // ✅ Refrescar cada 30 segundos automáticamente
    const interval = setInterval(() => {
      console.log('🔄 [usePlanes] Refrescando planes...');
      fetchPlanes();
    }, 30000); // 30 segundos
    
    return () => clearInterval(interval);
  }, [fetchPlanes]);

  // ✅ Escuchar cambios en localStorage (cuando se crea un plan)
  useEffect(() => {
    const handleStorageChange = () => {
      console.log('🔄 [usePlanes] Detectado cambio, refrescando...');
      fetchPlanes();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('planesUpdated', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('planesUpdated', handleStorageChange);
    };
  }, [fetchPlanes]);

  const coincideCategoria = (categoriaPlan, categoriaBuscada) => {
    const plan = (categoriaPlan || '').toLowerCase().trim();
    const buscada = (categoriaBuscada || '').toLowerCase().trim();
    return plan === buscada;
  };

  const obtenerPlanesPorCategoria = (categoria) => {
    return planes.filter(p => coincideCategoria(p.categoria, categoria));
  };

  const transformarPlan = (plan) => {
    const categoriaLower = (plan.categoria || '').toLowerCase().trim();
    
    const colores = {
      'fibra simétrica': { 
        color: '#d63384', 
        colorGradient: 'linear-gradient(135deg, #d63384 0%, #e83e8c 100%)' 
      },
      'fibra asimétrica': { 
        color: '#4CAF50', 
        colorGradient: 'linear-gradient(135deg, #4CAF50 0%, #66bb6a 100%)' 
      },
      'solit + tv': { 
        color: '#9c27b0', 
        colorGradient: 'linear-gradient(135deg, #9c27b0 0%, #ba68c8 100%)' 
      },
      'solit+tv': { 
        color: '#9c27b0', 
        colorGradient: 'linear-gradient(135deg, #9c27b0 0%, #ba68c8 100%)' 
      },
      'híbrido': { 
        color: '#26a69a', 
        colorGradient: 'linear-gradient(135deg, #26a69a 0%, #4db6ac 100%)' 
      },
      'antena/wireless': { 
        color: '#7c4dff', 
        colorGradient: 'linear-gradient(135deg, #7c4dff 0%, #9575cd 100%)' 
      }
    };

    const colorData = colores[categoriaLower] || { 
      color: '#1976d2', 
      colorGradient: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)' 
    };

    return {
      id: plan.id,
      nombre: plan.nombre || 'Sin nombre',
      categoria: plan.categoria || 'Fibra Simétrica',
      precio: parseFloat(plan.precio) || 0,
      descarga: parseInt(plan.descarga) || parseInt(plan.velocidad) || 0,
      subida: parseInt(plan.subida) || parseInt(plan.velocidad) || 0,
      velocidad: parseInt(plan.velocidad) || 0,
      simetrica: plan.simetrica || false,
      canales: plan.canales || '',
      ift: plan.ift || '',
      destacado: plan.destacado || false,
      ...colorData
    };
  };

  const planesFibraSimetrica = obtenerPlanesPorCategoria('Fibra Simétrica').map(transformarPlan);
  const planesFibraAsimetrica = obtenerPlanesPorCategoria('Fibra Asimétrica').map(transformarPlan);
  const planesSolitTV = obtenerPlanesPorCategoria('Solit + TV').map(transformarPlan);
  const planesHibridos = obtenerPlanesPorCategoria('Híbrido').map(transformarPlan);
  const planesAntenaWireless = obtenerPlanesPorCategoria('Antena/Wireless').map(transformarPlan);

  console.log('📊 [usePlanes] Resumen:', {
    fibraSimetrica: planesFibraSimetrica.length,
    fibraAsimetrica: planesFibraAsimetrica.length,
    solitTV: planesSolitTV.length,
    hibridos: planesHibridos.length,
    antenaWireless: planesAntenaWireless.length,
    lastUpdate: lastUpdate
  });

  return {
    planes,
    planesFibraSimetrica,
    planesFibraAsimetrica,
    planesSolitTV,
    planesHibridos,
    planesAntenaWireless,
    loading,
    error,
    refetch: fetchPlanes,
    lastUpdate
  };
};