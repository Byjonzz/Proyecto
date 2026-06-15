import React, { useState } from 'react';
import axios from 'axios';
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
  TextField,
  Stack,
  Divider,
  Alert,
  CircularProgress
} from '@mui/material';

import { Visibility, WhatsApp, Phone } from '@mui/icons-material';

const SegumientoProspecto = ({ usuarioActual }) => {
  const { prospectos, loading, error } = useProspectos();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [prospectoSeleccionado, setProspectoSeleccionado] = useState(null);

  const [tipoInteraccion, setTipoInteraccion] = useState('');
  const [notas, setNotas] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [mensaje, setMensaje] = useState(null);

  const handleView = (prospecto) => {
    setProspectoSeleccionado(prospecto);
    setTipoInteraccion('');
    setNotas('');
    setMensaje(null);
    setDialogOpen(true);
  };

  const prospectosFiltrados = prospectos.filter(prospecto => {
    const rol = usuarioActual?.rol?.toLowerCase() || '';
    if (rol === 'canvaceador') {
      return prospecto.canvaceador_id === Number(usuarioActual?.perfil_id);
    }
    return true;
  });

  const handleGuardarSeguimiento = async () => {
    if (!tipoInteraccion || !notas.trim()) {
      setMensaje({ tipo: 'error', texto: 'Selecciona el tipo de contacto y escribe una nota.' });
      return;
    }

    setEnviando(true);
    setMensaje(null);

    const datosInteraccion = {
      prospecto_id: prospectoSeleccionado.id,
      tipo_interaccion: tipoInteraccion,
      notas_comerciales: notas
    };

    try {
      await axios.post('http://10.144.86.55:1423/api/interacciones/', datosInteraccion);

      setMensaje({ tipo: 'success', texto: ' Seguimiento registrado con éxito.' });
      setNotas('');
      setTipoInteraccion('');


    } catch (err) {
      console.error('Error al guardar seguimiento:', err);
      setMensaje({ tipo: 'error', texto: ' Hubo un error al guardar. Verifica tu conexión.' });
    }
    setEnviando(false);
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
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Cargando prospectos...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">Error al cargar los prospectos: {error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
        Seguimiento de Prospectos ({prospectosFiltrados.length})
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
            {prospectosFiltrados.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography sx={{ py: 3, color: 'text.secondary' }}>
                    No tienes prospectos registrados.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              prospectosFiltrados.map((prospecto) => (
                <TableRow key={prospecto.id} hover>
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
                    <Tooltip title="Llamar al prospecto">
                      <IconButton
                        size="small"
                        color="success"
                        onClick={() => handleView(prospecto)}
                      >
                        <Phone />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
          Gestión del Prospecto
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          {prospectoSeleccionado && (
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, color: '#334155' }}>
                Información del Contacto
              </Typography>
              <Typography variant="body2"><strong>Nombre:</strong> {prospectoSeleccionado.nombre_completo}</Typography>
              <Typography variant="body2"><strong>Teléfono:</strong> {prospectoSeleccionado.telefono_whatsapp}</Typography>
              <Typography variant="body2"><strong>Dirección:</strong> {prospectoSeleccionado.direccion_calle_numero}, {prospectoSeleccionado.direccion_colonia}</Typography>
              <Typography variant="body2"><strong>Interés:</strong> {prospectoSeleccionado.plan_interes || 'N/A'}</Typography>

              <Divider sx={{ my: 2 }} />

              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2, color: '#1e293b' }}>
                Registrar Nuevo Seguimiento
              </Typography>

              <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                <Button
                  variant={tipoInteraccion === 'WhatsApp' ? 'contained' : 'outlined'}
                  color="success"
                  startIcon={<WhatsApp />}
                  onClick={() => setTipoInteraccion('WhatsApp')}
                  fullWidth
                >
                  WhatsApp
                </Button>
                <Button
                  variant={tipoInteraccion === 'Llamada' ? 'contained' : 'outlined'}
                  color="primary"
                  startIcon={<Phone />}
                  onClick={() => setTipoInteraccion('Llamada')}
                  fullWidth
                >
                  Llamada
                </Button>
              </Stack>

              <TextField
                label="Notas Comerciales (Ej. 'Le marqué y pidió que le llame mañana')"
                multiline
                rows={3}
                fullWidth
                size="small"
                value={notas}
                onChange={(e) => setNotas(e.target.value)}
                sx={{ mb: 2 }}
              />

              <Button
                variant="contained"
                color="secondary"
                fullWidth
                onClick={handleGuardarSeguimiento}
                disabled={enviando || !tipoInteraccion || !notas.trim()}
              >
                {enviando ? 'Guardando...' : 'Guardar Seguimiento'}
              </Button>

              {mensaje && (
                <Alert severity={mensaje.tipo} sx={{ mt: 2 }}>
                  {mensaje.texto}
                </Alert>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: '1px solid #e2e8f0' }}>
          <Button onClick={() => setDialogOpen(false)} color="inherit">Cerrar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SegumientoProspecto;