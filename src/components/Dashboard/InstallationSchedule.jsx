import React, { useState } from 'react';
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, Button, Chip, TextField, MenuItem, Stack, Alert,
  Dialog, DialogTitle, DialogContent, DialogActions, IconButton
} from '@mui/material';
import { CalendarMonth, Close } from '@mui/icons-material';

const InstallationSchedule = () => {
  const [ordenes, setOrdenes] = useState([
    { id: 'C-98765', cliente: 'Juan Pérez García', plan: 'Familiar 50MB', direccion: 'Av. Reforma 402, Centro', estatus: 'Pendiente Asignar' },
    { id: 'C-98766', cliente: 'María Elena Solís', plan: 'Ultra Gamer 100MB', direccion: 'Calle 5 Poniente 12, Las Palmas', estatus: 'Pendiente Asignar' }
  ]);

  const [ordenSeleccionada, setOrdenSeleccionada] = useState(null);
  const [fecha, setFecha] = useState('');
  const [tecnico, setTecnico] = useState('');
  const [mensajeExito, setMensajeExito] = useState(false);

  const handleAbrirModal = (orden) => {
    setOrdenSeleccionada(orden);
    setFecha(''); // Limpiamos campos
    setTecnico('');
    setMensajeExito(false);
  };

  const handleCerrarModal = () => {
    setOrdenSeleccionada(null);
  };

  const handleGuardarAsignacion = (e) => {
    e.preventDefault();
    setOrdenes(ordenes.map(o => o.id === ordenSeleccionada.id ? { ...o, estatus: 'Asignado' } : o));
    setMensajeExito(true);
    handleCerrarModal(); // Cierra el modal tras guardar
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <div>
        <h2 className="text-xl font-bold text-slate-800">Mesa de Control y Asignación de Logística</h2>
        <p className="text-sm text-slate-500">Asigna fecha, hora y personal técnico a los contratos entrantes.</p>
      </div>

      {mensajeExito && (
        <Alert severity="success" onClose={() => setMensajeExito(false)}>
          Instalación agendada con éxito. Notificación enviada al dispositivo del técnico asignado.
        </Alert>
      )}

      {/* TABLA DE SEGUIMIENTO */}
      <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead sx={{ backgroundColor: '#f8fafc' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>Folio</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Cliente</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Plan contratado</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Dirección de Servicio</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Estatus</TableCell>
              <TableCell align="center" sx={{ fontWeight: 600 }}>Acción</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ordenes.map((orden) => (
              <TableRow key={orden.id} hover>
                <TableCell sx={{ fontWeight: 600 }}>{orden.id}</TableCell>
                <TableCell>{orden.cliente}</TableCell>
                <TableCell>{orden.plan}</TableCell>
                <TableCell>{orden.direccion}</TableCell>
                <TableCell>
                  <Chip
                    label={orden.estatus}
                    color={orden.estatus === 'Asignado' ? 'success' : 'warning'}
                    size="small"
                    sx={{ fontWeight: 600 }}
                  />
                </TableCell>
                <TableCell align="center">
                  <Button
                    variant="contained"
                    size="small"
                    disabled={orden.estatus === 'Asignado'}
                    onClick={() => handleAbrirModal(orden)}
                    sx={{ textTransform: 'none', borderRadius: 1.5 }}
                  >
                    Asignar Cita
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* MODAL (DIALOG) DE ASIGNACIÓN */}
      <Dialog 
        open={Boolean(ordenSeleccionada)} 
        onClose={handleCerrarModal}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#1d4ed8' }}>
            Agendar Folio: {ordenSeleccionada?.id}
          </Typography>
          <IconButton onClick={handleCerrarModal} size="small">
            <Close />
          </IconButton>
        </DialogTitle>
        
        <form onSubmit={handleGuardarAsignacion}>
          <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 3, py: 3 }}>
            <Typography variant="body2" color="text.secondary">
              Cliente: <strong>{ordenSeleccionada?.cliente}</strong><br/>
              Dirección: {ordenSeleccionada?.direccion}
            </Typography>

            <TextField
              label="Programar Fecha y Hora"
              type="datetime-local"
              fullWidth
              required
              InputLabelProps={{ shrink: true }}
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
            />
            
            <TextField
              select
              label="Asignar Técnico Responsable"
              fullWidth
              required
              value={tecnico}
              onChange={(e) => setTecnico(e.target.value)}
            >
              <MenuItem value="t1">Téc. Ana Ramírez - Zona Centro</MenuItem>
              <MenuItem value="t2">Téc. Carlos Soto - Zona Sur</MenuItem>
              <MenuItem value="t3">Téc. Luis Pérez - Zona Norte</MenuItem>
            </TextField>
          </DialogContent>
          
          <DialogActions sx={{ p: 2, px: 3 }}>
            <Button onClick={handleCerrarModal} color="inherit">
              Cancelar
            </Button>
            <Button type="submit" variant="contained" startIcon={<CalendarMonth />}>
              Confirmar Agenda
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default InstallationSchedule;