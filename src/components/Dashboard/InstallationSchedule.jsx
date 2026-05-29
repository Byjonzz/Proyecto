import React, { useState } from 'react';
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, Button, Chip, TextField, MenuItem, Stack, Alert,
  Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Grid, 
  Card, Divider
} from '@mui/material';
import { 
  CalendarMonth, Close, EventAvailableOutlined, AssignmentOutlined,
  PieChartOutlined, BarChartOutlined
} from '@mui/icons-material';

const InstallationSchedule = () => {
  // Lista de contratos listos desde Ventas
  const [ordenes, setOrdenes] = useState([
    { id: 'C-98765', cliente: 'Juan Pérez García', plan: 'Familiar 50MB', direccion: 'Av. Reforma 402, Centro', estatus: 'Pendiente Asignar' },
    { id: 'C-98766', cliente: 'María Elena Solís', plan: 'Ultra Gamer 100MB', direccion: 'Calle 5 Poniente 12, Las Palmas', estatus: 'Pendiente Asignar' },
    { id: 'C-98767', cliente: 'Roberto Gómez', plan: 'Básico 20MB', direccion: 'Privada Juárez 14, San José', estatus: 'Pendiente Asignar' }
  ]);

  // SOLUCIÓN: Convertimos el tablero en un estado para que sea dinámico
  const [tecnicos, setTecnicos] = useState([
    { id: 't1', nombre: 'Téc. Ana Ramírez', m900: 'Disponible', m1130: 'Ocupado', m1400: 'Disponible', m1635: 'Disponible' },
    { id: 't2', nombre: 'Téc. Carlos Soto', m900: 'Ocupado', m1130: 'Ocupado', m1400: 'Disponible', m1635: 'Ocupado' },
    { id: 't3', nombre: 'Téc. Luis Pérez', m900: 'Disponible', m1130: 'Disponible', m1400: 'Ocupado', m1635: 'Disponible' }
  ]);

  // FUNCIÓN INTELIGENTE: Calcula las horas disponibles leyendo el tablero en tiempo real
  const obtenerHorasDisponibles = (idTecnico) => {
    const tech = tecnicos.find(t => t.id === idTecnico);
    if (!tech) return [];
    
    const horasLibres = [];
    if (tech.m900 === 'Disponible') horasLibres.push('09:00 AM');
    if (tech.m1130 === 'Disponible') horasLibres.push('11:30 AM');
    if (tech.m1400 === 'Disponible') horasLibres.push('02:00 PM');
    if (tech.m1635 === 'Disponible') horasLibres.push('04:30 PM');
    return horasLibres;
  };

  // Datos fijos para las gráficas visuales inferiores
  const datosPastel = [
    { label: 'Completadas', value: 55, color: '#10b981' },
    { label: 'Pendientes', value: 30, color: '#f59e0b' }
  ];

  const datosBarras = [
    { dia: 'Lun', cantidad: 12, altura: '60%' },
    { dia: 'Mar', cantidad: 18, altura: '90%' },
    { dia: 'Mié', cantidad: 10, altura: '50%' },
    { dia: 'Jue', cantidad: 20, altura: '100%' },
    { dia: 'Vie', cantidad: 14, altura: '70%' }
  ];

  // Estados de Control de Modal y Formulario
  const [ordenSeleccionada, setOrdenSeleccionada] = useState(null);
  const [fecha, setFecha] = useState('');
  const [tecnico, setTecnico] = useState('');
  const [horaSeleccionada, setHoraSeleccionada] = useState('');
  const [mensajeExito, setMensajeExito] = useState(false);

  const handleAbrirModal = (orden) => {
    setOrdenSeleccionada(orden);
    setFecha('');
    setTecnico('');
    setHoraSeleccionada('');
    setMensajeExito(false);
  };

  const handleCerrarModal = () => setOrdenSeleccionada(null);

  const handleGuardarAsignacion = (e) => {
    e.preventDefault();
    
    // 1. Cambiar estatus de la orden/contrato de instalación
    setOrdenes(ordenes.map(o => o.id === ordenSeleccionada.id ? { ...o, estatus: 'Asignado' } : o));
    
    // 2. SOLUCIÓN: Buscar al técnico asignado y cambiar su celda horaria a "Ocupado"
    setTecnicos(tecnicos.map(t => {
      if (t.id === tecnico) {
        const clonTecnico = { ...t };
        if (horaSeleccionada === '09:00 AM') clonTecnico.m900 = 'Ocupado';
        if (horaSeleccionada === '11:30 AM') clonTecnico.m1130 = 'Ocupado';
        if (horaSeleccionada === '02:00 PM') clonTecnico.m1400 = 'Ocupado';
        if (horaSeleccionada === '04:30 PM') clonTecnico.m1635 = 'Ocupado';
        return clonTecnico;
      }
      return t;
    }));

    setMensajeExito(true);
    handleCerrarModal();
  };

  const getChipStyle = (status) => {
    return status === 'Disponible' 
      ? { bgcolor: '#eff6ff', color: '#1d4ed8', fontWeight: 600 } 
      : { bgcolor: '#f1f5f9', color: '#94a3b8', fontWeight: 500 };
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, width: '100%' }}>
      
      {/* CABECERA */}
      <Box>
        <Typography variant="h5" sx={{ fontWeight: 700, color: '#1e293b', display: 'flex', alignItems: 'center', gap: 1 }}>
          <AssignmentOutlined color="primary" /> Mesa de Control y Asignación de Logística
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Asigna citas y gestiona las agendas de instalación técnica en campo.
        </Typography>
      </Box>

      {mensajeExito && (
        <Alert severity="success" onClose={() => setMensajeExito(false)} sx={{ borderRadius: 2 }}>
          Instalación agendada con éxito. El tablero se ha actualizado y se notificó al técnico.
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
                <TableCell sx={{ fontWeight: 700, color: '#1d4ed8' }}>{orden.id}</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>{orden.cliente}</TableCell>
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

      {/* TABLERO DE DISPONIBILIDAD TÉCNICA */}
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
              {tecnicos.map((tech) => (
                <TableRow key={tech.id} hover>
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

      <Divider sx={{ my: 1 }} />

      {/* REPORTE GRÁFICO INFERIOR */}
      <Box sx={{ width: '100%' }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={5}>
            <Card variant="outlined" sx={{ borderRadius: 3, p: 3, height: '100%' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#475569', mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                <PieChartOutlined color="primary" fontSize="small" /> Estatus Global
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3, flexDirection: { xs: 'column', sm: 'row' } }}>
                <Box sx={{ 
                  width: 120, height: 120, borderRadius: '50%', 
                  background: `conic-gradient(${datosPastel[0].color} 0% ${datosPastel[0].value}%, ${datosPastel[1].color} ${datosPastel[0].value}% 100%)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <Box sx={{ width: 80, height: 80, backgroundColor: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>100%</Typography>
                  </Box>
                </Box>
                <Stack spacing={1}>
                  {datosPastel.map((item, i) => (
                    <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><Box sx={{ width: 12, height: 12, borderRadius: '2px', backgroundColor: item.color }} /><Typography variant="caption" sx={{ fontWeight: 600 }}>{item.label} ({item.value}%)</Typography></Box>
                  ))}
                </Stack>
              </Box>
            </Card>
          </Grid>

          <Grid item xs={12} md={7}>
            <Card variant="outlined" sx={{ borderRadius: 3, p: 3, height: '100%' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#475569', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <BarChartOutlined color="secondary" fontSize="small" /> Volumen por Día
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: 120, borderBottom: '1px solid #e2e8f0', pb: 1 }}>
                {datosBarras.map((barra, index) => (
                  <Box key={index} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5, width: '15%' }}>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: '#3b82f6' }}>{barra.cantidad}</Typography>
                    <Box sx={{ width: '100%', maxWidth: 30, height: barra.altura, backgroundColor: '#3b82f6', borderRadius: '4px 4px 0 0' }} />
                    <Typography variant="caption" sx={{ fontWeight: 600, color: '#64748b', mt: 0.5 }}>{barra.dia}</Typography>
                  </Box>
                ))}
              </Box>
            </Card>
          </Grid>
        </Grid>
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
          <IconButton onClick={handleCerrarModal} size="small"><Close /></IconButton>
        </DialogTitle>
        
        <form onSubmit={handleGuardarAsignacion}>
          <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 3, py: 3 }}>
            <Typography variant="body2" color="text.secondary">
              Cliente: <strong>{ordenSeleccionada?.cliente}</strong><br/>
              Dirección: {ordenSeleccionada?.direccion}
            </Typography>

            <TextField
              type="date"
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
              onChange={(e) => {
                setTecnico(e.target.value);
                setHoraSeleccionada(''); // Limpia la hora si cambias de técnico
              }}
            >
              <MenuItem value="t1">Téc. Ana Ramírez - Zona Centro</MenuItem>
              <MenuItem value="t2">Téc. Carlos Soto - Zona Sur</MenuItem>
              <MenuItem value="t3">Téc. Luis Pérez - Zona Norte</MenuItem>
            </TextField>

            {/* LAS HORAS AHORA SE FILTRAN AUTOMÁTICAMENTE */}
            <TextField
              select
              label="Horas Disponibles del Técnico"
              fullWidth
              required
              disabled={!tecnico}
              value={horaSeleccionada}
              onChange={(e) => setHoraSeleccionada(e.target.value)}
              helperText={!tecnico ? "Por favor, selecciona primero un técnico para ver sus bloques libres" : ""}
            >
              {tecnico && obtenerHorasDisponibles(tecnico).map((hora, index) => (
                <MenuItem key={index} value={hora}>
                  {hora} - Bloque Libre Asignable
                </MenuItem>
              ))}
            </TextField>
          </DialogContent>
          
          <DialogActions sx={{ p: 2, px: 3 }}>
            <Button onClick={handleCerrarModal} color="inherit">Cancelar</Button>
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