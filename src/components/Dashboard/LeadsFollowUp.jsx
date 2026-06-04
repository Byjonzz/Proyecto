import React from 'react';
import { useProspectos } from '../../hooks/useProspectos';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip
} from '@mui/material';
import { Edit, Delete, Visibility } from '@mui/icons-material';

const LeadsFollowUp = () => {
  const { prospectos, loading, error, deleteProspecto } = useProspectos();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Cargando prospectos...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 3 }}>
        Error al cargar los prospectos: {error}
      </Alert>
    );
  }

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este prospecto?')) {
      try {
        await deleteProspecto(id);
        alert('Prospecto eliminado correctamente');
      } catch (err) {
        alert('Error al eliminar el prospecto');
      }
    }
  };

  const getEstadoColor = (estado) => {
    const colores = {
      'nuevo': 'primary',
      'contactado': 'info',
      'interesado': 'warning',
      'vendido': 'success',
      'perdido': 'error'
    };
    return colores[estado?.toLowerCase()] || 'default';
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
        Seguimiento de Leads ({prospectos.length})
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>Nombre</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Teléfono</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Dirección</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Estado</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Fecha</TableCell>
              <TableCell align="center" sx={{ fontWeight: 700 }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {prospectos.map((prospecto) => (
              <TableRow key={prospecto.id} hover>
                <TableCell>{prospecto.nombre}</TableCell>
                <TableCell>{prospecto.telefono}</TableCell>
                <TableCell>{prospecto.direccion}</TableCell>
                <TableCell>
                  <Chip 
                    label={prospecto.estado} 
                    color={getEstadoColor(prospecto.estado)} 
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {new Date(prospecto.fecha_creacion).toLocaleDateString()}
                </TableCell>
                <TableCell align="center">
                  <Tooltip title="Ver detalles">
                    <IconButton size="small" color="primary">
                      <Visibility />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Editar">
                    <IconButton size="small" color="info">
                      <Edit />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Eliminar">
                    <IconButton 
                      size="small" 
                      color="error"
                      onClick={() => handleDelete(prospecto.id)}
                    >
                      <Delete />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default LeadsFollowUp;