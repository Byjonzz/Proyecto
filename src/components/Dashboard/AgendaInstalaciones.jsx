import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, Button, Chip, TextField, MenuItem, Stack, Alert,
  Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Grid, 
  Card, Divider, CircularProgress
} from '@mui/material';
import { 
  CalendarMonth, Close, EventAvailableOutlined, AssignmentOutlined,
  PieChartOutlined, BarChartOutlined, Pending, AssignmentTurnedIn,
  CheckCircle
} from '@mui/icons-material';
import { useContratos } from '../../hooks/useContratos';

const AgendaInstalaciones = () => {
  const { contratos, loading, error, asignarCita, refetchPendientes } = useContratos();
  
  const [tecnicos, setTecnicos] = useState([
    { id: 't1', nombre: 'Téc. Ana Ramírez', m900: 'Disponible', m1130: 'Ocupado', m1400: 'Disponible', m1635: 'Disponible' },
    { id: 't2', nombre: 'Téc. Carlos Soto', m900: 'Ocupado', m1130: 'Ocupado', m1400: 'Disponible', m1635: 'Ocupado' },
    { id: 't3', nombre: 'Téc. Luis Pérez', m900: 'Disponible', m1130: 'Disponible', m1400: 'Ocupado', m1635: 'Disponible' }
  ]);

  const tecnicoIdMap = {
    't1': 1,
    't2': 2,
    't3': 3
  };

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

  const [ordenSeleccionada, setOrdenSeleccionada] = useState(null);
  const [fecha, setFecha] = useState('');
  const [tecnico, setTecnico] = useState('');
  const [mensajeExito, setMensajeExito] = useState(false);
  const [errorAsignacion, setErrorAsignacion] = useState(null);

  
  const [filtroEstatus, setFiltroEstatus] = useState('pendientes');

  useEffect(() => {
    refetchPendientes();
  }, []);

  const ordenes = contratos.map(contrato => ({
    id: contrato.id || `C-${contrato.id}`,
    cliente: contrato.nombre_completo,
    plan: contrato.plan_contratado,
    direccion: contrato.calle_numero,
    estatus: contrato.estatus,
    contrato_id: contrato.id,
    telefono: contrato.telefono1,
    correo: contrato.correo
  }));

  
  const ordenesFiltradas = ordenes.filter(orden => {
    switch (filtroEstatus) {
      case 'pendientes':
        return orden.estatus === 'Pendiente Asignar' || orden.estatus === 'Pendiente';
      case 'asignadas':
        return orden.estatus === 'Asignado' || orden.estatus === 'Programada' || orden.estatus === 'En Proceso';
      case 'completadas':
        return orden.estatus === 'Completado' || orden.estatus === 'Completada';
      default:
        return true;
    }
  });

  
  const totalPendientes = ordenes.filter(o => o.estatus === 'Pendiente Asignar' || o.estatus === 'Pendiente').length;
  const totalAsignadas = ordenes.filter(o => o.estatus === 'Asignado' || o.estatus === 'Programada' || o.estatus === 'En Proceso').length;
  const totalCompletadas = ordenes.filter(o => o.estatus === 'Completado' || o.estatus === 'Completada').length;

  const handleAbrirModal = (orden) => {
    setOrdenSeleccionada(orden);
    setFecha('');
    setTecnico('');
    setMensajeExito(false);
    setErrorAsignacion(null);
  };

  const handleCerrarModal = () => setOrdenSeleccionada(null);

  const handleGuardarAsignacion = async (e) => {
    e.preventDefault();
    setErrorAsignacion(null);
    
    try {
      const tecnicoSeleccionado = tecnicos.find(t => t.id === tecnico);
      const tecnicoIdReal = tecnicoIdMap[tecnico] || null;
      
   
      
      await asignarCita(ordenSeleccionada.contrato_id, {
        tecnico_id: tecnicoIdReal,
        fecha_asignada: fecha,
        estatus: 'Asignado'
      });
      

      setMensajeExito(true);
      handleCerrarModal();
      refetchPendientes();
      
      setTimeout(() => setMensajeExito(false), 3000);
      
    } catch (err) {
      setErrorAsignacion(`Error al asignar la cita: ${err.message}`);
    }
  };

  const getChipStyle = (status) => {
    return status === 'Disponible' 
      ? { bgcolor: '#eff6ff', color: '#1d4ed8', fontWeight: 600 } 
      : { bgcolor: '#f1f5f9', color: '#94a3b8', fontWeight: 500 };
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Cargando contratos pendientes...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 3 }}>
        Error al cargar contratos: {error}
      </Alert>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, width: '100%' }}>
      
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
          ✅ Instalación agendada con éxito. El tablero se ha actualizado y se notificó al técnico.
        </Alert>
      )}

      {errorAsignacion && (
        <Alert severity="error" onClose={() => setErrorAsignacion(null)} sx={{ borderRadius: 2 }}>
          {errorAsignacion}
        </Alert>
      )}

      {}
      <Paper sx={{ p: 2, borderRadius: 2, border: '1px solid #e2e8f0' }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: '#475569' }}>
          Filtrar por Estatus:
        </Typography>
        <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap', gap: 1 }}>
          {}
          <Button
            variant={filtroEstatus === 'pendientes' ? 'contained' : 'outlined'}
            startIcon={<Pending />}
            onClick={() => setFiltroEstatus('pendientes')}
            sx={{ 
              minWidth: 160,
              bgcolor: filtroEstatus === 'pendientes' ? '#f59e0b' : 'transparent',
              color: filtroEstatus === 'pendientes' ? 'white' : '#f59e0b',
              borderColor: '#f59e0b',
              borderWidth: 2,
              fontWeight: 700,
              '&:hover': {
                bgcolor: filtroEstatus === 'pendientes' ? '#d97706' : 'rgba(245, 158, 11, 0.08)',
                borderColor: '#d97706',
              }
            }}
          >
            Pendientes ({totalPendientes})
          </Button>
          
          {}
          <Button
            variant={filtroEstatus === 'asignadas' ? 'contained' : 'outlined'}
            startIcon={<AssignmentTurnedIn />}
            onClick={() => setFiltroEstatus('asignadas')}
            sx={{ 
              minWidth: 160,
              bgcolor: filtroEstatus === 'asignadas' ? '#3b82f6' : 'transparent',
              color: filtroEstatus === 'asignadas' ? 'white' : '#3b82f6',
              borderColor: '#3b82f6',
              borderWidth: 2,
              fontWeight: 700,
              '&:hover': {
                bgcolor: filtroEstatus === 'asignadas' ? '#2563eb' : 'rgba(59, 130, 246, 0.08)',
                borderColor: '#2563eb',
              }
            }}
          >
            Asignadas ({totalAsignadas})
          </Button>
          
          {}
          <Button
            variant={filtroEstatus === 'completadas' ? 'contained' : 'outlined'}
            startIcon={<CheckCircle />}
            onClick={() => setFiltroEstatus('completadas')}
            sx={{ 
              minWidth: 160,
              bgcolor: filtroEstatus === 'completadas' ? '#10b981' : 'transparent',
              color: filtroEstatus === 'completadas' ? 'white' : '#10b981',
              borderColor: '#10b981',
              borderWidth: 2,
              fontWeight: 700,
              '&:hover': {
                bgcolor: filtroEstatus === 'completadas' ? '#059669' : 'rgba(16, 185, 129, 0.08)',
                borderColor: '#059669',
              }
            }}
          >
            Completadas ({totalCompletadas})
          </Button>
        </Stack>
      </Paper>

      {}
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
            {ordenesFiltradas.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                  <Typography variant="body2" color="text.secondary">
                    No hay contratos {filtroEstatus} para mostrar
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              ordenesFiltradas.map((orden) => (
                <TableRow key={orden.id} hover>
                  <TableCell sx={{ fontWeight: 700, color: '#1d4ed8' }}>{orden.id}</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>{orden.cliente}</TableCell>
                  <TableCell>{orden.plan}</TableCell>
                  <TableCell>{orden.direccion}</TableCell>
                  <TableCell>
                    <Chip
                      label={orden.estatus}
                      color={orden.estatus === 'Asignado' ? 'success' : 
                             orden.estatus === 'Completado' || orden.estatus === 'Completada' ? 'success' : 
                             'warning'}
                      size="small"
                      sx={{ fontWeight: 600 }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Button
                      variant="contained"
                      size="small"
                      disabled={orden.estatus === 'Asignado' || orden.estatus === 'Completado' || orden.estatus === 'Completada'}
                      onClick={() => handleAbrirModal(orden)}
                      sx={{ textTransform: 'none', borderRadius: 1.5 }}
                    >
                      {orden.estatus === 'Completado' || orden.estatus === 'Completada' ? 'Finalizado' : 'Asignar Cita'}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Divider sx={{ my: 1 }} />

      <Box sx={{ width: '100%' }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 5 }}>
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
                    <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ width: 12, height: 12, borderRadius: '2px', backgroundColor: item.color }} />
                      <Typography variant="caption" sx={{ fontWeight: 600 }}>{item.label} ({item.value}%)</Typography>
                    </Box>
                  ))}
                </Stack>
              </Box>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 7 }}>
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

      <Dialog 
        open={Boolean(ordenSeleccionada)} 
        onClose={handleCerrarModal}
        maxWidth="sm"
        fullWidth
        slotProps={{
          paper: { sx: { borderRadius: 3 } }
        }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CalendarMonth color="primary" />
            <Typography variant="h6" component="span" sx={{ fontWeight: 700, color: '#1d4ed8' }}>
              Agendar Folio: {ordenSeleccionada?.id}
            </Typography>
          </Box>
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
              slotProps={{
                inputLabel: { shrink: true }
              }}
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
              }}
            >
              <MenuItem value="t1">Téc. Ana Ramírez - Zona Centro</MenuItem>
              <MenuItem value="t2">Téc. Carlos Soto - Zona Sur</MenuItem>
              <MenuItem value="t3">Téc. Luis Pérez - Zona Norte</MenuItem>
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

export default AgendaInstalaciones;