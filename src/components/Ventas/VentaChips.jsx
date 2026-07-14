import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Tooltip,
  Stack,
  InputAdornment,
  Stepper,
  Step,
  StepLabel,
  CircularProgress
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Visibility,
  Search,
  SimCard,
  PhoneAndroid,
  Inventory,
  TrendingUp,
  CheckCircle,
  ArrowBack,
  ArrowForward
} from '@mui/icons-material';

import api from '../../services/api'; 

const VentaChips = () => {

  const [chips, setChips] = useState([]);
  const [planesDisponibles, setPlanesDisponibles] = useState({});
  const [cargando, setCargando] = useState(true);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [chipEditando, setChipEditando] = useState(null);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [mensaje, setMensaje] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [pasoActual, setPasoActual] = useState(0);
  const [periodoSeleccionado, setPeriodoSeleccionado] = useState('');

  const [erroresValidacion, setErroresValidacion] = useState({
    nombre: false,
    telefono: false,
    nombreMensaje: '',
    telefonoMensaje: ''
  });

  const [formData, setFormData] = useState({
    numero_telefonico: '',
    cliente_nombre: '',
    cliente_telefono: '',
    plan_seleccionado: null,
    precio_venta: 0,
    estado: 'Vendido'
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    setCargando(true);
    try {
      const resPlanes = await api.get('/sims/');
      const planesApi = resPlanes.data;
      
      const gruposPlanes = {};
      planesApi.forEach(plan => {
        const cat = plan.categoria || 'Otros';
        if (!gruposPlanes[cat]) gruposPlanes[cat] = [];
        
        gruposPlanes[cat].push({
          ...plan,
          precio: parseFloat(plan.precio),
          dias: cat.replace(/\D/g, ''),
          redes: plan.beneficios,
          comparte: plan.beneficios?.toLowerCase().includes('comparte'),
          popular: plan.destacado
        });
      });
      setPlanesDisponibles(gruposPlanes);

      if (Object.keys(gruposPlanes).length > 0) {
        setPeriodoSeleccionado(Object.keys(gruposPlanes)[0]);
      }

      const resVentas = await api.get('/ventaSim/');
      const ventasApi = resVentas.data.map(venta => ({
        id: venta.id,
        numero_telefonico: venta.num_cliente,
        cliente_nombre: venta.nombre,
        cliente_telefono: venta.num_cliente,
        plan_asociado: venta.plan_elejido,
        precio_venta: parseFloat(venta.precio),
        estado: venta.estado ? 'Activado' : 'Inactivo',
        canvaceador_id: venta.canvaceador_id
      }));
      setChips(ventasApi);

    } catch (error) {
      console.error("Error cargando datos:", error);
      mostrarMensaje("Error de conexión al cargar la información", "error");
    } finally {
      setCargando(false);
    }
  };

  const estadisticas = {
    total: chips.length,
    ingresos: chips
      .filter(c => c.estado === 'Vendido' || c.estado === 'Activado')
      .reduce((acc, c) => acc + parseFloat(c.precio_venta || 0), 0)
  };

  const mostrarMensaje = (texto, tipo) => {
    setMensaje({ texto, tipo });
    setTimeout(() => setMensaje(null), 4000);
  };

  const validarSoloNumeros = (valor) => /^\d*$/.test(valor);
  const validarSoloLetras = (valor) => /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]*$/.test(valor);

  const handleNombreChange = (valor) => {
    if (validarSoloLetras(valor)) {
      setFormData({ ...formData, cliente_nombre: valor });
      setErroresValidacion({ ...erroresValidacion, nombre: false, nombreMensaje: '' });
    } else {
      setErroresValidacion({ ...erroresValidacion, nombre: true, nombreMensaje: 'Solo se permiten letras' });
    }
  };

  const handleTelefonoChange = (valor) => {
    if (validarSoloNumeros(valor)) {
      const valorLimpio = valor.replace(/\D/g, '');
      if (valorLimpio.length <= 10) {
        setFormData({ ...formData, cliente_telefono: valorLimpio });
        setErroresValidacion({ ...erroresValidacion, telefono: false, telefonoMensaje: '' });
      }
    } else {
      setErroresValidacion({ ...erroresValidacion, telefono: true, telefonoMensaje: 'Solo se permiten números' });
    }
  };

  const handleOpenDialog = (chip = null) => {
    if (chip) {
      setChipEditando(chip);
      setFormData({
        numero_telefonico: chip.numero_telefonico || '',
        cliente_nombre: chip.cliente_nombre || '',
        cliente_telefono: chip.cliente_telefono || '',
        plan_seleccionado: null,
        precio_venta: chip.precio_venta || 0,
        estado: chip.estado || 'Vendido'
      });
      setModoEdicion(true);
    } else {
      setChipEditando(null);
      setFormData({
        numero_telefonico: '',
        cliente_nombre: '',
        cliente_telefono: '',
        plan_seleccionado: null,
        precio_venta: 0,
        estado: 'Vendido'
      });
      setModoEdicion(false);
    }
    setErroresValidacion({ nombre: false, telefono: false, nombreMensaje: '', telefonoMensaje: '' });
    setPasoActual(0);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setChipEditando(null);
    setModoEdicion(false);
    setPasoActual(0);
  };

  const handleSiguientePaso = () => {
    const nombreValido = formData.cliente_nombre.trim().length > 0 && !erroresValidacion.nombre;
    const telefonoValido = formData.cliente_telefono.length === 10 && !erroresValidacion.telefono;

    if (!nombreValido || !telefonoValido) {
      if (!nombreValido) {
        setErroresValidacion({
          ...erroresValidacion,
          nombre: true,
          nombreMensaje: formData.cliente_nombre.trim() === '' ? 'El nombre es obligatorio' : 'Solo se permiten letras'
        });
      }
      if (!telefonoValido) {
        setErroresValidacion({
          ...erroresValidacion,
          telefono: true,
          telefonoMensaje: formData.cliente_telefono.length === 0 ? 'El teléfono es obligatorio' :
            formData.cliente_telefono.length < 10 ? `Faltan ${10 - formData.cliente_telefono.length} dígitos` :
              'Solo se permiten números'
        });
      }
      mostrarMensaje('Por favor corrige los errores antes de continuar', 'error');
      return;
    }
    setPasoActual(1);
  };

  const handleRegresarPaso = () => setPasoActual(0);

  const handleSeleccionarPlan = (plan) => {
    setFormData({
      ...formData,
      plan_seleccionado: plan,
      precio_venta: plan.precio
    });
  };

  const handleSaveChip = async () => {
    if (!formData.plan_seleccionado) {
      mostrarMensaje('Por favor selecciona un plan', 'error');
      return;
    }

    const payload = {
      num_cliente: formData.cliente_telefono,
      nombre: formData.cliente_nombre,
      plan_elejido: `${formData.plan_seleccionado.nombre} $${formData.plan_seleccionado.precio}`,
      precio: formData.plan_seleccionado.precio.toString(),
      estado: true,
      canvaceador_id: 1 
    };

    try {
      if (modoEdicion && chipEditando) {
        mostrarMensaje('Chip actualizado correctamente', 'success');
      } else {
        await api.post('/ventaSim/', payload);
        mostrarMensaje('Chip registrado correctamente', 'success');
      }
      
      cargarDatos();
      handleCloseDialog();
    } catch (error) {
      console.error("Error al guardar:", error);
      mostrarMensaje('Error de conexión al guardar el registro', 'error');
    }
  };

  const handleDeleteChip = async (chipId) => {
    if (window.confirm('¿Estás seguro de eliminar este chip SIM?')) {
      try {
        await api.delete(`/ventaSim/${chipId}/`);
        setChips(chips.filter(c => c.id !== chipId));
        mostrarMensaje('Chip eliminado correctamente', 'success');
      } catch (error) {
        console.error("Error borrando chip:", error);
        mostrarMensaje("No se pudo eliminar el registro", "error");
      }
    }
  };

  const chipsFiltrados = chips.filter(chip => {
    return (
      chip.numero_telefonico?.includes(busqueda) ||
      chip.cliente_nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
      chip.plan_asociado?.toLowerCase().includes(busqueda.toLowerCase())
    );
  });

  if (cargando) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
            <SimCard color="primary" /> Gestión de Chips SIM
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Control de inventario y ventas de chips/tarjetas SIM
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
          sx={{ fontWeight: 700 }}
        >
          Registrar Nuevo Chip
        </Button>
      </Box>

      {mensaje && (
        <Alert severity={mensaje.tipo} sx={{ mb: 3 }} onClose={() => setMensaje(null)}>
          {mensaje.texto}
        </Alert>
      )}

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={6}>
          <Card sx={{ bgcolor: '#f0f9ff', border: '2px solid #0284c7' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                <Inventory sx={{ color: '#0284c7', fontSize: 32 }} />
                <Typography variant="h6" sx={{ color: '#0284c7', fontWeight: 700 }}>
                  TOTAL DE CHIPS
                </Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 800, color: '#0c4a6e' }}>
                {estadisticas.total}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={6}>
          <Card sx={{ bgcolor: '#fef3c7', border: '2px solid #fde68a' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                <TrendingUp sx={{ color: '#d97706', fontSize: 32 }} />
                <Typography variant="h6" sx={{ color: '#d97706', fontWeight: 700 }}>
                  INGRESOS TOTALES
                </Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 800, color: '#78350f' }}>
                ${estadisticas.ingresos.toLocaleString('es-MX', { minimumFractionDigits: 0 })}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center">
          <TextField
            placeholder="Buscar por número, cliente o plan..."
            size="small"
            fullWidth
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search color="action" />
                </InputAdornment>
              )
            }}
          />
        </Stack>
      </Paper>

      <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead sx={{ backgroundColor: '#f8fafc' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>Número</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Plan</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Cliente</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Precio</TableCell>
              <TableCell align="center" sx={{ fontWeight: 700 }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {chipsFiltrados.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 5 }}>
                  <SimCard sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary">
                    No hay chips SIM registrados
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              chipsFiltrados.map((chip) => (
                <TableRow key={chip.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PhoneAndroid fontSize="small" color="action" />
                      <Typography variant="body2">{chip.numero_telefonico}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{chip.plan_asociado || '-'}</Typography>
                  </TableCell>
                  <TableCell>
                    {chip.cliente_nombre ? (
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {chip.cliente_nombre}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {chip.cliente_telefono}
                        </Typography>
                      </Box>
                    ) : (
                      <Typography variant="caption" color="text.secondary">
                        Sin asignar
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#16a34a' }}>
                      ${parseFloat(chip.precio_venta || 0).toLocaleString('es-MX')}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="Ver detalles">
                      <IconButton size="small" color="primary" onClick={() => handleOpenDialog(chip)}>
                        <Visibility />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Editar">
                      <IconButton size="small" color="info" onClick={() => handleOpenDialog(chip)}>
                        <Edit />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Eliminar">
                      <IconButton size="small" color="error" onClick={() => handleDeleteChip(chip.id)}>
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

      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="lg" fullWidth>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <SimCard color="primary" />
          {modoEdicion ? 'Editar Chip SIM' : 'Registrar Nuevo Chip SIM'}
        </DialogTitle>
        <DialogContent dividers>
          <Stepper activeStep={pasoActual} sx={{ mb: 4 }}>
            <Step>
              <StepLabel>Información del Cliente</StepLabel>
            </Step>
            <Step>
              <StepLabel>Seleccionar Plan</StepLabel>
            </Step>
          </Stepper>

          {pasoActual === 0 && (
            <Box sx={{ pt: 2 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2, color: '#1e293b' }}>
                Datos del Cliente
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Nombre del Cliente *"
                    value={formData.cliente_nombre}
                    onChange={(e) => handleNombreChange(e.target.value)}
                    error={erroresValidacion.nombre}
                    helperText={erroresValidacion.nombreMensaje || 'Solo se permiten letras'}
                    required
                    inputProps={{ maxLength: 50 }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Teléfono del Cliente *"
                    value={formData.cliente_telefono}
                    onChange={(e) => handleTelefonoChange(e.target.value)}
                    error={erroresValidacion.telefono}
                    helperText={erroresValidacion.telefonoMensaje || `${formData.cliente_telefono.length}/10 dígitos`}
                    required
                    placeholder="Ingresa exactamente 10 dígitos"
                    inputProps={{ maxLength: 10 }}
                  />
                </Grid>
              </Grid>
            </Box>
          )}

          {pasoActual === 1 && (
            <Box sx={{ pt: 2 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2, color: '#1e293b' }}>
                Selecciona un Plan
              </Typography>

              <Box sx={{ mb: 3 }}>
                <Stack direction="row" spacing={1} sx={{ overflowX: 'auto' }}>
                  {Object.keys(planesDisponibles).map((periodo) => (
                    <Chip
                      key={periodo}
                      label={periodo}
                      onClick={() => setPeriodoSeleccionado(periodo)}
                      color={periodoSeleccionado === periodo ? 'primary' : 'default'}
                      variant={periodoSeleccionado === periodo ? 'filled' : 'outlined'}
                      sx={{ whiteSpace: 'nowrap' }}
                    />
                  ))}
                </Stack>
              </Box>

              {planesDisponibles[periodoSeleccionado] && planesDisponibles[periodoSeleccionado].length > 0 ? (
                <Grid container spacing={2}>
                  {planesDisponibles[periodoSeleccionado].map((plan) => (
                    <Grid item xs={12} sm={6} md={4} key={plan.id}>
                      <Card
                        onClick={() => handleSeleccionarPlan(plan)}
                        sx={{
                          cursor: 'pointer',
                          border: formData.plan_seleccionado?.id === plan.id ? '3px solid #1976d2' : '2px solid #e0e0e0',
                          backgroundColor: formData.plan_seleccionado?.id === plan.id ? '#e3f2fd' : 'white',
                          transition: 'all 0.3s',
                          transform: formData.plan_seleccionado?.id === plan.id ? 'scale(1.02)' : 'scale(1)',
                          '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 8px 20px rgba(0,0,0,0.15)' },
                          position: 'relative'
                        }}
                      >
                        {plan.popular && (
                          <Chip
                            label="MÁS POPULAR"
                            size="small"
                            sx={{
                              position: 'absolute',
                              top: 8,
                              right: 8,
                              background: plan.dias >= 180 ? '#2563eb' :
                                plan.dias >= 365 ? '#f59e0b' :
                                  plan.dias == 30 ? '#22c55e' : '#3b82f6',
                              color: 'white',
                              fontWeight: 700,
                              fontSize: '0.65rem'
                            }}
                          />
                        )}
                        <CardContent sx={{ p: 2 }}>
                          <Box sx={{
                            background: plan.dias >= 180 ? 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)' :
                              plan.dias >= 365 ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' :
                                plan.dias == 30 && plan.precio <= 200 ? 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)' :
                                  plan.dias == 30 && plan.precio > 200 && plan.precio < 400 ? 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)' :
                                    plan.dias == 30 && plan.precio >= 400 ? 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)' :
                                      'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
                            color: 'white',
                            p: 2,
                            borderRadius: 1,
                            mb: 2,
                            textAlign: 'center'
                          }}>
                            <Typography variant="caption" sx={{ display: 'block', mb: 0.5, fontSize: '0.75rem', fontWeight: 700 }}>
                              {plan.nombre}
                            </Typography>
                            <Typography variant="h3" sx={{ fontWeight: 900, fontSize: '2rem' }}>
                              ${plan.precio.toLocaleString()}
                            </Typography>
                            <Typography variant="caption" sx={{ fontSize: '0.8rem' }}>
                              /{plan.dias} días
                            </Typography>
                          </Box>

                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                            <Box sx={{ textAlign: 'center', flex: 1 }}>
                              <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>Datos</Typography>
                              <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#06b6d4', fontSize: '1rem' }}>
                                {plan.datos}
                              </Typography>
                            </Box>
                            <Box sx={{ textAlign: 'center', flex: 1 }}>
                              <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>Llamadas</Typography>
                              <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#06b6d4', fontSize: '1rem' }}>
                                {plan.llamadas}
                              </Typography>
                            </Box>
                          </Box>

                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                            <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontSize: '0.75rem' }}>
                              <CheckCircle sx={{ fontSize: 14, color: '#22c55e' }} />
                              {plan.datos} a Máxima Velocidad
                            </Typography>
                            <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontSize: '0.75rem' }}>
                              <CheckCircle sx={{ fontSize: 14, color: '#22c55e' }} />
                              Mins ilimitados
                            </Typography>
                            <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontSize: '0.75rem' }}>
                              <CheckCircle sx={{ fontSize: 14, color: '#22c55e' }} />
                              {plan.sms}
                            </Typography>
                            <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontSize: '0.75rem' }}>
                              <CheckCircle sx={{ fontSize: 14, color: '#22c55e' }} />
                              {plan.redes}
                            </Typography>
                            {plan.comparte && (
                              <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontSize: '0.75rem' }}>
                                <CheckCircle sx={{ fontSize: 14, color: '#22c55e' }} />
                                Comparte Internet
                              </Typography>
                            )}
                          </Box>

                          {formData.plan_seleccionado?.id === plan.id && (
                            <Chip
                              label="✓ Seleccionado"
                              color="success"
                              size="small"
                              sx={{ mt: 2, width: '100%', fontWeight: 700 }}
                            />
                          )}
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Box sx={{ textAlign: 'center', py: 5 }}>
                  <Typography variant="body2" color="text.secondary">
                    No hay planes disponibles para este período
                  </Typography>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, px: 3 }}>
          {pasoActual === 1 && (
            <Button
              onClick={handleRegresarPaso}
              startIcon={<ArrowBack />}
            >
              Regresar
            </Button>
          )}
          <Button onClick={handleCloseDialog}>
            Cancelar
          </Button>
          {pasoActual === 0 ? (
            <Button
              onClick={handleSiguientePaso}
              variant="contained"
              endIcon={<ArrowForward />}
            >
              Siguiente
            </Button>
          ) : (
            <Button
              onClick={handleSaveChip}
              variant="contained"
              disabled={!formData.plan_seleccionado}
            >
              {modoEdicion ? 'Actualizar' : 'Registrar'}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default VentaChips;