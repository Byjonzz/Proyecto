import React, { useState } from 'react';
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
  MenuItem,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Tooltip,
  Stack,
  InputAdornment
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
  TrendingUp
} from '@mui/icons-material';

const CHIPS_INICIALES = [
  {
    id: 1,
    numero_telefonico: '5551234567',
    operador: 'Telcel',
    plan_asociado: 'Plan Amigo Sin Límite',
    precio_venta: 250,
    estado: 'Disponible',
    cliente_nombre: '',
    cliente_telefono: '',
    notas: 'Chip nuevo en inventario'
  },
  {
    id: 2,
    numero_telefonico: '5552345678',
    operador: 'AT&T',
    plan_asociado: 'Plan Más 300',
    precio_venta: 300,
    estado: 'Vendido',
    cliente_nombre: 'Juan Pérez García',
    cliente_telefono: '5559876543',
    notas: 'Cliente solicitó portabilidad'
  },
  {
    id: 3,
    numero_telefonico: '5553456789',
    operador: 'Movistar',
    plan_asociado: 'Plan Freedom 20GB',
    precio_venta: 350,
    estado: 'Activado',
    cliente_nombre: 'María López Hernández',
    cliente_telefono: '5558765432',
    notas: 'Activación exitosa'
  },
  {
    id: 4,
    numero_telefonico: '5554567890',
    operador: 'Telcel',
    plan_asociado: 'Plan Max 30',
    precio_venta: 400,
    estado: 'Vendido',
    cliente_nombre: 'Carlos Ramírez Torres',
    cliente_telefono: '5557654321',
    notas: ''
  },
  {
    id: 5,
    numero_telefonico: '5555678901',
    operador: 'Altan Redes',
    plan_asociado: 'Plan Datos 50GB',
    precio_venta: 200,
    estado: 'Disponible',
    cliente_nombre: '',
    cliente_telefono: '',
    notas: 'Chip para venta inmediata'
  },
  {
    id: 6,
    numero_telefonico: '5556789012',
    operador: 'AT&T',
    plan_asociado: 'Plan Unlimited',
    precio_venta: 450,
    estado: 'Cancelado',
    cliente_nombre: 'Ana Martínez Ruiz',
    cliente_telefono: '5556543210',
    notas: 'Cliente canceló por cambio de domicilio'
  },
  {
    id: 7,
    numero_telefonico: '5557890123',
    operador: 'Telcel',
    plan_asociado: 'Plan Amigo Sin Límite',
    precio_venta: 250,
    estado: 'Activado',
    cliente_nombre: 'Roberto Sánchez Gómez',
    cliente_telefono: '5555432109',
    notas: 'Instalación completada'
  },
  {
    id: 8,
    numero_telefonico: '5558901234',
    operador: 'Movistar',
    plan_asociado: 'Plan Freedom 50GB',
    precio_venta: 500,
    estado: 'Disponible',
    cliente_nombre: '',
    cliente_telefono: '',
    notas: 'Plan premium'
  }
];

const SimSales = () => {
  const [chips, setChips] = useState(CHIPS_INICIALES);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [chipEditando, setChipEditando] = useState(null);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [mensaje, setMensaje] = useState(null);
  const [busqueda, setBusqueda] = useState('');

  const [formData, setFormData] = useState({
    numero_telefonico: '',
    operador: '',
    plan_asociado: '',
    precio_venta: '',
    estado: 'Disponible',
    cliente_nombre: '',
    cliente_telefono: '',
    notas: ''
  });

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

  const handleOpenDialog = (chip = null) => {
    if (chip) {
      setChipEditando(chip);
      setFormData({
        numero_telefonico: chip.numero_telefonico || '',
        operador: chip.operador || '',
        plan_asociado: chip.plan_asociado || '',
        precio_venta: chip.precio_venta || '',
        estado: chip.estado || 'Disponible',
        cliente_nombre: chip.cliente_nombre || '',
        cliente_telefono: chip.cliente_telefono || '',
        notas: chip.notas || ''
      });
      setModoEdicion(true);
    } else {
      setChipEditando(null);
      setFormData({
        numero_telefonico: '',
        operador: '',
        plan_asociado: '',
        precio_venta: '',
        estado: 'Disponible',
        cliente_nombre: '',
        cliente_telefono: '',
        notas: ''
      });
      setModoEdicion(false);
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setChipEditando(null);
    setModoEdicion(false);
  };

  const handleSaveChip = () => {
    if (!formData.numero_telefonico || !formData.operador || !formData.plan_asociado) {
      mostrarMensaje('Número, operador y plan son obligatorios', 'error');
      return;
    }

    if (modoEdicion && chipEditando) {
      const chipsActualizados = chips.map(c => 
        c.id === chipEditando.id ? { ...c, ...formData } : c
      );
      setChips(chipsActualizados);
      mostrarMensaje('Chip SIM actualizado correctamente', 'success');
    } else {
      const nuevoChip = {
        ...formData,
        id: Date.now(),
        precio_venta: parseFloat(formData.precio_venta) || 0
      };
      setChips([...chips, nuevoChip]);
      mostrarMensaje('Chip SIM registrado correctamente', 'success');
    }

    handleCloseDialog();
  };

  const handleDeleteChip = (chipId) => {
    if (window.confirm('¿Estás seguro de eliminar este chip SIM?')) {
      setChips(chips.filter(c => c.id !== chipId));
      mostrarMensaje('Chip SIM eliminado correctamente', 'success');
    }
  };

  const chipsFiltrados = chips.filter(chip => {
    return (
      chip.numero_telefonico?.includes(busqueda) ||
      chip.cliente_nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
      chip.plan_asociado?.toLowerCase().includes(busqueda.toLowerCase()) ||
      chip.operador?.toLowerCase().includes(busqueda.toLowerCase())
    );
  });

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
            placeholder="Buscar por número, cliente, plan u operador..."
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
                  <Typography variant="body2" color="text.secondary">
                    {busqueda ? 'No se encontraron resultados con la búsqueda' : 'Comienza registrando tu primer chip SIM'}
                  </Typography>
                  {!busqueda && (
                    <Button 
                      variant="contained" 
                      startIcon={<Add />} 
                      onClick={() => handleOpenDialog()}
                      sx={{ mt: 2 }}
                    >
                      Registrar Chip
                    </Button>
                  )}
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

      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <SimCard color="primary" />
          {modoEdicion ? 'Editar Chip SIM' : 'Registrar Nuevo Chip SIM'}
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ pt: 2 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2, color: '#1e293b' }}>
              Información del Chip
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Número Telefónico *"
                  value={formData.numero_telefonico}
                  onChange={(e) => setFormData({ ...formData, numero_telefonico: e.target.value })}
                  placeholder="10 dígitos"
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  fullWidth
                  label="Operador *"
                  value={formData.operador}
                  onChange={(e) => setFormData({ ...formData, operador: e.target.value })}
                  required
                >
                  <MenuItem value="Telcel">Telcel</MenuItem>
                  <MenuItem value="AT&T">AT&T</MenuItem>
                  <MenuItem value="Movistar">Movistar</MenuItem>
                  <MenuItem value="Altan Redes">Altan Redes</MenuItem>
                  <MenuItem value="Otro">Otro</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Plan Asociado *"
                  value={formData.plan_asociado}
                  onChange={(e) => setFormData({ ...formData, plan_asociado: e.target.value })}
                  placeholder="Ej: Plan Amigo Sin Límite"
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Precio de Venta ($)"
                  type="number"
                  value={formData.precio_venta}
                  onChange={(e) => setFormData({ ...formData, precio_venta: e.target.value })}
                  InputProps={{ inputProps: { min: 0, step: 0.01 } }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  fullWidth
                  label="Estado"
                  value={formData.estado}
                  onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                >
                  <MenuItem value="Disponible">Disponible</MenuItem>
                  <MenuItem value="Vendido">Vendido</MenuItem>
                  <MenuItem value="Activado">Activado</MenuItem>
                  <MenuItem value="Cancelado">Cancelado</MenuItem>
                </TextField>
              </Grid>
            </Grid>

            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2, mt: 3, color: '#1e293b' }}>
              Información del Cliente
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Nombre del Cliente"
                  value={formData.cliente_nombre}
                  onChange={(e) => setFormData({ ...formData, cliente_nombre: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Teléfono del Cliente"
                  value={formData.cliente_telefono}
                  onChange={(e) => setFormData({ ...formData, cliente_telefono: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Notas"
                  multiline
                  rows={3}
                  value={formData.notas}
                  onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
                  placeholder="Observaciones adicionales..."
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, px: 3 }}>
          <Button onClick={handleCloseDialog}>
            Cancelar
          </Button>
          <Button 
            onClick={handleSaveChip} 
            variant="contained"
          >
            {modoEdicion ? 'Actualizar' : 'Registrar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SimSales;