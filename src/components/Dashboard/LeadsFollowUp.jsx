import React, { useState, useEffect } from 'react';
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
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField
} from '@mui/material';
import { Edit, Delete, Visibility } from '@mui/icons-material';

const LeadsFollowUp = () => {
  const { prospectos, loading, error, deleteProspecto } = useProspectos();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [prospectoSeleccionado, setProspectoSeleccionado] = useState(null);

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

  const handleView = (prospecto) => {
    setProspectoSeleccionado(prospecto);
    setDialogOpen(true);
  };

  const getEstadoColor = (estado) => {
    const colores = {
      'Nuevo': 'primary',
      'Contactado': 'info',
      'Interesado': 'warning',
      'Vendido': 'success',
      'Perdido': 'error'
    };
    return colores[estado] || 'default';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Sin fecha';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-MX', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Fecha inválida';
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography>Cargando prospectos...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">Error al cargar los prospectos: {error}</Typography>
      </Box>
    );
  }

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
            {prospectos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography sx={{ py: 3, color: 'text.secondary' }}>
                    No hay prospectos registrados
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              prospectos.map((prospecto) => (
                <TableRow key={prospecto.id} hover>
                  {/* ✅ Usar los nombres correctos del modelo Django */}
                  <TableCell>{prospecto.nombre_completo || 'Sin nombre'}</TableCell>
                  <TableCell>{prospecto.telefono_whatsapp || 'Sin teléfono'}</TableCell>
                  <TableCell>
                    {prospecto.direccion_calle_numero 
                      ? `${prospecto.direccion_calle_numero}, ${prospecto.direccion_colonia || ''}`
                      : 'Sin dirección'
                    }
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={prospecto.estado || 'Nuevo'} 
                      color={getEstadoColor(prospecto.estado)} 
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{formatDate(prospecto.fecha_captura)}</TableCell>
                  <TableCell align="center">
                    <Tooltip title="Ver detalles">
                      <IconButton 
                        size="small" 
                        color="primary"
                        onClick={() => handleView(prospecto)}
                      >
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
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog para ver detalles */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Detalles del Prospecto</DialogTitle>
        <DialogContent>
          {prospectoSeleccionado && (
            <Box sx={{ pt: 2 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                Información Personal
              </Typography>
              <Typography variant="body2"><strong>Nombre:</strong> {prospectoSeleccionado.nombre_completo}</Typography>
              <Typography variant="body2"><strong>Teléfono:</strong> {prospectoSeleccionado.telefono_whatsapp}</Typography>
              <Typography variant="body2"><strong>Dirección:</strong> {prospectoSeleccionado.direccion_calle_numero}, {prospectoSeleccionado.direccion_colonia}</Typography>
              <Typography variant="body2"><strong>Referencias:</strong> {prospectoSeleccionado.referencia_domicilio || 'N/A'}</Typography>
              
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mt: 2, mb: 1 }}>
                Información de Captura
              </Typography>
              <Typography variant="body2"><strong>Método de ubicación:</strong> {prospectoSeleccionado.metodo_ubicacion}</Typography>
              <Typography variant="body2"><strong>Plan de interés:</strong> {prospectoSeleccionado.plan_interes || 'N/A'}</Typography>
              <Typography variant="body2"><strong>Estado:</strong> {prospectoSeleccionado.estado}</Typography>
              <Typography variant="body2"><strong>Fecha de captura:</strong> {formatDate(prospectoSeleccionado.fecha_captura)}</Typography>
              
              {prospectoSeleccionado.notas_canvaceador && (
                <>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, mt: 2, mb: 1 }}>
                    Notas del Canvaceador
                  </Typography>
                  <Typography variant="body2">{prospectoSeleccionado.notas_canvaceador}</Typography>
                </>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default LeadsFollowUp;