import { useState, useEffect } from 'react';
import { clientesService } from '../services/clientesService';

export const useClientes = () => {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchClientes = async () => {
    try {
      setLoading(true);
      const data = await clientesService.getAll();
      setClientes(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error al cargar clientes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  const createCliente = async (data) => {
    try {
      const nuevoCliente = await clientesService.create(data);
      setClientes([...clientes, nuevoCliente]);
      return nuevoCliente;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateCliente = async (id, data) => {
    try {
      const clienteActualizado = await clientesService.update(id, data);
      setClientes(clientes.map(c => c.id === id ? clienteActualizado : c));
      return clienteActualizado;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const deleteCliente = async (id) => {
    try {
      await clientesService.delete(id);
      setClientes(clientes.filter(c => c.id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return {
    clientes,
    loading,
    error,
    createCliente,
    updateCliente,
    deleteCliente,
    refetch: fetchClientes
  };
};