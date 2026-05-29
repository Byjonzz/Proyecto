import React, { useState } from 'react';
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, Button, Chip, TextField, MenuItem, Stack, Alert,
  Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Grid
} from '@mui/material';
import { CalendarMonth, Close, EventAvailableOutlined } from '@mui/icons-material';

const InstallationSchedule = () => {
  const [ordenes, setOrdenes] = useState([
    { id: 'C-98765', cliente: 'Juan Pérez García', plan: 'Familiar 50MB', direccion: 'Av. Reforma 402, Centro', estatus: 'Pendiente Asignar' },
    { id: 'C-98766', cliente: 'María Elena Solís', plan: 'Ultra Gamer 100MB', direccion: 'Calle 5 Poniente 12, Las Palmas', estatus: 'Pendiente Asignar' }
  ]);

  // Datos del Tablero de Disponibilidad Técnica (Imagen 2)
  const disponibilidadTecnicos = [
    { nombre: 'Téc. Ana Ramírez', m900: 'Disponible', m1130: 'Ocupado', m1400: 'Disponible', m1635: 'Disponible' },
    { nombre: 'Téc. Carlos Soto', m900: 'Ocupado', m1130: 'Ocupado', m1400: 'Disponible', m1635: 'Ocupado' },
    { nombre: 'Téc. Luis Pérez', m900: 'Disponible', m1130: 'Disponible', m1400: 'Ocupado', m1635: 'Disponible' }
  ];

  const [ordenSeleccionada, setOrdenSeleccionada] = useState(null);
  const [fecha, setFecha] = useState('');
  const [tecnico, setTecnico] = useState('');
  const [mensajeExito, setMensajeExito] = useState(false);

  const handleAbrirModal = (orden) => {
    setOrdenSeleccionada(orden);
    setFecha('');
    setTecnico('');
    setMensajeExito(false);
  };

  const handleCerrarModal = () => setOrdenSeleccionada(null);

  const handleGuardarAsignacion = (e) => {
    e.preventDefault();
    setOrdenes(ordenes.map(o => o.id === ordenSeleccionada.id ? { ...o, estatus: 'Asignado' } : o));
    setMensajeExito(true);
    handleCerrarModal();
  };

  const getChipStyle = (status) => {
    return status === 'Disponible' 
      ? { bgcolor: '#eff6ff', color: '#1d4ed8', fontWeight: 600 } 
      : { bgcolor: '#f1f5f9', color: '#94a3b8', fontWeight: 500 };
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <div>
        <h2 className="text-xl font-bold text-slate-800">Mesa de Control y Asignación de Logística</h2>
        <p className="text-sm text-slate-500">Asigna fecha, hora y personal técnico a los contratos entrantes de Solit System.</p>
      </div>

      {mensajeExito && (
        <Alert severity="success" onClose={() => setMensajeExito(false)} sx={{ borderRadius: 2 }}>
          Instalación agendada con éxito. Notificación enviada al dispositivo del técnico asignado.
        </Alert>
      )}

      {/* TABLA DE CONTRATOS ENTRANTES */}
      <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead sx={{ backgroundColor: '#f8fafc' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>Folio</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Cliente</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Plan Contratado</TableCell>
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

      {/* NUEVO APARTADO: TABLERO VISUAL DE DISPONIBILIDAD HORARIA POR TÉCNICO (IMAGEN 2) */}
      <Box sx={{ mt: 1 }}>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
          <EventAvailableOutlined color="primary" />
          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1e293b' }}>
            Tablero de Disponibilidad Técnica Diaria
          </Typography>
        </Stack>

        <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
          <Table size="small">
            <TableHead sx={{ backgroundColor: '#f1f5f9' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, py: 1.5 }}>Personal Técnico</TableCell>
                <TableCell align="center" sx={{ fontWeight: 600 }}>09:00 AM</TableCell>
                <TableCell align="center" sx={{ fontWeight: 600 }}>11:30 AM</TableCell>
                <TableCell align="center" sx={{ fontWeight: 600 }}>02:00 PM</TableCell>
                <TableCell align="center" sx={{ fontWeight: 600 }}>04:30 PM</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {disponibilidadTecnicos.map((tech, index) => (
                <TableRow key={index} hover>
                  <TableCell sx={{ fontWeight: 600, py: 1.5, color: '#334155' }}>{tech.nombre}</TableCell>
                  <TableCell align="center"><Chip label={tech.m900} size="small" sx={getChipStyle(tech.m900)} /></TableCell>
                  <TableCell align="center"><Chip label={tech.m1130} size="small" sx={getChipStyle(tech.m1130)} /></TableCell>
                  <TableCell align="center"><Chip label={tech.m1400} size="small" sx={getChipStyle(tech.m1400)} /></TableCell>
                  <TableCell align="center"><Chip label={tech.m1635} size="small" sx={getChipStyle(tech.m1635)} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* MODAL DE AGENDAMIENTO */}
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