import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Chip,
  Alert,
  Tabs,
  Tab,
  Divider,
  Tooltip,
  Switch,
  FormControlLabel
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Save,
  Close,
  TrendingUp,
  Speed,
  AttachMoney,
  CheckCircle
} from '@mui/icons-material';

// Categorías de planes disponibles
const CATEGORIAS = {
  FIBRA_SIMETRICA: 'Fibra Simétrica',
  FIBRA_ASIMETRICA: 'Fibra Asimétrica',
  SOLIT_TV: 'Solit + TV',
  HIBRIDO: 'Híbrido',
  ANTENA_WIRELESS: 'Antena/Wireless'
};

// Planes iniciales por defecto
const PLANES_INICIALES = [
  // Fibra Simétrica
  { id: 1, nombre: 'INTERMEDIO', categoria: CATEGORIAS.FIBRA_SIMETRICA, precio: 309, descarga: 30, subida: 30, simetrica: true, ift: '1065567', destacado: false, activo: true },
  { id: 2, nombre: 'AVANZADO', categoria: CATEGORIAS.FIBRA_SIMETRICA, precio: 409, descarga: 60, subida: 60, simetrica: true, ift: '1065572', destacado: false, activo: true },
  { id: 3, nombre: 'PLUS', categoria: CATEGORIAS.FIBRA_SIMETRICA, precio: 509, descarga: 100, subida: 100, simetrica: true, ift: '1065577', destacado: true, activo: true },
  
  // Fibra Asimétrica
  { id: 4, nombre: 'BÁSICO', categoria: CATEGORIAS.FIBRA_ASIMETRICA, precio: 310, descarga: 10, subida: 5, simetrica: false, ift: '1065496', destacado: false, activo: true },
  { id: 5, nombre: 'INTERMEDIO', categoria: CATEGORIAS.FIBRA_ASIMETRICA, precio: 410, descarga: 15, subida: 5, simetrica: false, ift: '1065502', destacado: false, activo: true },
  { id: 6, nombre: 'AVANZADO', categoria: CATEGORIAS.FIBRA_ASIMETRICA, precio: 510, descarga: 20, subida: 5, simetrica: false, ift: '1065535', destacado: false, activo: true },
  
  // Solit + TV
  { id: 7, nombre: 'Solit+TV One', categoria: CATEGORIAS.SOLIT_TV, precio: 535, descarga: 30, subida: 30, simetrica: true, canales: '47 (41 HD / 6 SD)', ift: '1462784', destacado: false, activo: true },
  { id: 8, nombre: 'Solit+TV Prime', categoria: CATEGORIAS.SOLIT_TV, precio: 650, descarga: 60, subida: 60, simetrica: true, canales: '47 (41 HD / 6 SD)', ift: '1468403', destacado: true, activo: true },
  { id: 9, nombre: 'Solit+TV Plus', categoria: CATEGORIAS.SOLIT_TV, precio: 760, descarga: 100, subida: 100, simetrica: true, canales: '47 (41 HD / 6 SD)', ift: '1468404', destacado: false, activo: true },
  
  // Híbrido
  { id: 10, nombre: 'Híbrido 5 Mbps', categoria: CATEGORIAS.HIBRIDO, precio: 200, velocidad: 5, ift: 'N/A', destacado: false, activo: true },
  { id: 11, nombre: 'Híbrido 10 Mbps', categoria: CATEGORIAS.HIBRIDO, precio: 250, velocidad: 10, ift: 'N/A', destacado: false, activo: true },
  { id: 12, nombre: 'Híbrido 20 Mbps', categoria: CATEGORIAS.HIBRIDO, precio: 300, velocidad: 20, ift: 'N/A', destacado: false, activo: true },
  { id: 13, nombre: 'Híbrido 40 Mbps', categoria: CATEGORIAS.HIBRIDO, precio: 400, velocidad: 40, ift: 'N/A', destacado: false, activo: true },
  { id: 14, nombre: 'Híbrido 60 Mbps', categoria: CATEGORIAS.HIBRIDO, precio: 500, velocidad: 60, ift: 'N/A', destacado: false, activo: true },
  
  // Antena/Wireless
  { id: 15, nombre: 'WIFI MIX 10 Mbps', categoria: CATEGORIAS.ANTENA_WIRELESS, precio: 250, velocidad: 10, ift: 'N/A', destacado: false, activo: true },
  { id: 16, nombre: 'WIFI MIX 20 Mbps', categoria: CATEGORIAS.ANTENA_WIRELESS, precio: 300, velocidad: 20, ift: 'N/A', destacado: false, activo: true },
  { id: 17, nombre: 'WIFI MIX 40 Mbps', categoria: CATEGORIAS.ANTENA_WIRELESS, precio: 400, velocidad: 40, ift: 'N/A', destacado: false, activo: true },
  { id: 18, nombre: 'WIFI MIX 50 Mbps', categoria: CATEGORIAS.ANTENA_WIRELESS, precio: 500, velocidad: 50, ift: 'N/A', destacado: false, activo: true }
];

const PlansManagement = () => {
  const [planes, setPlanes] = useState([]);
  const [categoriaActiva, setCategoriaActiva] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [planEditando, setPlanEditando] = useState(null);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [mensaje, setMensaje] = useState(null);
  
  // Estado del formulario
  const [formData, setFormData] = useState({
    nombre: '',
    categoria: CATEGORIAS.FIBRA_SIMETRICA,
    precio: '',
    descarga: '',
    subida: '',
    velocidad: '',
    simetrica: false,
    canales: '',
    ift: '',
    destacado: false,
    activo: true
  });

  // Cargar planes al iniciar
  useEffect(() => {
    cargarPlanes();
  }, []);

  const cargarPlanes = () => {
    const planesGuardados = localStorage.getItem('conectanet_planes');
    if (planesGuardados) {
      setPlanes(JSON.parse(planesGuardados));
    } else {
      setPlanes(PLANES_INICIALES);
      localStorage.setItem('conectanet_planes', JSON.stringify(PLANES_INICIALES));
    }
  };

  const guardarPlanes = (nuevosPlanes) => {
    setPlanes(nuevosPlanes);
    localStorage.setItem('conectanet_planes', JSON.stringify(nuevosPlanes));
    mostrarMensaje('Planes guardados correctamente', 'success');
  };

  const mostrarMensaje = (texto, tipo) => {
    setMensaje({ texto, tipo });
    setTimeout(() => setMensaje(null), 3000);
  };

  const handleOpenDialog = (plan = null) => {
    if (plan) {
      setPlanEditando(plan);
      setFormData({ ...plan });
      setModoEdicion(true);
    } else {
      setPlanEditando(null);
      setFormData({
        nombre: '',
        categoria: Object.values(CATEGORIAS)[categoriaActiva] || CATEGORIAS.FIBRA_SIMETRICA,
        precio: '',
        descarga: '',
        subida: '',
        velocidad: '',
        simetrica: false,
        canales: '',
        ift: '',
        destacado: false,
        activo: true
      });
      setModoEdicion(false);
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setPlanEditando(null);
    setModoEdicion(false);
  };

  const handleSavePlan = () => {
    if (!formData.nombre || !formData.precio) {
      mostrarMensaje('Nombre y precio son obligatorios', 'error');
      return;
    }

    if (modoEdicion && planEditando) {
      // Actualizar plan existente
      const planesActualizados = planes.map(p => 
        p.id === planEditando.id ? { ...formData, id: p.id } : p
      );
      guardarPlanes(planesActualizados);
    } else {
      // Crear nuevo plan
      const nuevoPlan = {
        ...formData,
        id: Date.now(), // ID único basado en timestamp
        precio: Number(formData.precio),
        descarga: formData.descarga ? Number(formData.descarga) : null,
        subida: formData.subida ? Number(formData.subida) : null,
        velocidad: formData.velocidad ? Number(formData.velocidad) : null
      };
      guardarPlanes([...planes, nuevoPlan]);
    }
    
    handleCloseDialog();
  };

  const handleDeletePlan = (planId) => {
    if (window.confirm('¿Estás seguro de eliminar este plan?')) {
      const planesActualizados = planes.filter(p => p.id !== planId);
      guardarPlanes(planesActualizados);
    }
  };

  const handleToggleActivo = (planId) => {
    const planesActualizados = planes.map(p => 
      p.id === planId ? { ...p, activo: !p.activo } : p
    );
    guardarPlanes(planesActualizados);
  };

  const categorias = Object.values(CATEGORIAS);
  const planesFiltrados = planes.filter(p => p.categoria === categorias[categoriaActiva]);

  const getCardColor = (categoria) => {
    const colors = {
      [CATEGORIAS.FIBRA_SIMETRICA]: '#d63384',
      [CATEGORIAS.FIBRA_ASIMETRICA]: '#4CAF50',
      [CATEGORIAS.SOLIT_TV]: '#9c27b0',
      [CATEGORIAS.HIBRIDO]: '#26a69a',
      [CATEGORIAS.ANTENA_WIRELESS]: '#7c4dff'
    };
    return colors[categoria] || '#1976d2';
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          Administración de Planes
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Gestiona los planes de internet, precios y características
        </Typography>
      </Box>

      {mensaje && (
        <Alert severity={mensaje.tipo} sx={{ mb: 3 }}>
          {mensaje.texto}
        </Alert>
      )}

      {/* Tabs de categorías */}
      <Tabs 
        value={categoriaActiva} 
        onChange={(e, newValue) => setCategoriaActiva(newValue)}
        sx={{ mb: 3 }}
        variant="scrollable"
        scrollButtons="auto"
      >
        {categorias.map((cat, idx) => (
          <Tab key={idx} label={cat} />
        ))}
      </Tabs>

      {/* Header con botón agregar */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">
          {categorias[categoriaActiva]} ({planesFiltrados.length} planes)
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
          sx={{ 
            background: getCardColor(categorias[categoriaActiva]),
            '&:hover': { opacity: 0.9 }
          }}
        >
          Agregar Plan
        </Button>
      </Box>

      {/* Grid de planes */}
      <Grid container spacing={3}>
        {planesFiltrados.map((plan) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={plan.id}>
            <Card sx={{ 
              position: 'relative',
              border: plan.activo ? '2px solid' : '2px solid #e0e0e0',
              borderColor: plan.activo ? getCardColor(plan.categoria) : '#e0e0e0',
              opacity: plan.activo ? 1 : 0.6,
              transition: 'all 0.3s',
              '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 8px 20px rgba(0,0,0,0.15)' }
            }}>
              {plan.destacado && (
                <Chip 
                  label="DESTACADO" 
                  size="small"
                  sx={{ 
                    position: 'absolute', 
                    top: 8, 
                    right: 8, 
                    background: '#ff9800', 
                    color: 'white',
                    fontWeight: 700,
                    fontSize: '0.7rem'
                  }} 
                />
              )}
              
              <CardContent sx={{ p: 2 }}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                    {plan.nombre}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
                    <Typography variant="h4" sx={{ fontWeight: 900, color: getCardColor(plan.categoria) }}>
                      ${plan.precio}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      /mes
                    </Typography>
                  </Box>
                </Box>

                <Divider sx={{ my: 1.5 }} />

                <Box sx={{ mb: 1.5 }}>
                  {plan.descarga && plan.subida ? (
                    <>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <Speed fontSize="small" sx={{ color: '#9c27b0' }} />
                        <Typography variant="body2">
                          {plan.descarga} Mbps ↓ / {plan.subida} Mbps ↑
                        </Typography>
                      </Box>
                      <Typography variant="caption" color={plan.simetrica ? 'success.main' : 'warning.main'}>
                        {plan.simetrica ? '✓ Simétrica' : '⚠ Asimétrica'}
                      </Typography>
                    </>
                  ) : (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Speed fontSize="small" sx={{ color: '#9c27b0' }} />
                      <Typography variant="body2">
                        {plan.velocidad} Mbps
                      </Typography>
                    </Box>
                  )}
                  
                  {plan.canales && (
                    <Typography variant="body2" sx={{ mt: 0.5 }}>
                      📺 {plan.canales}
                    </Typography>
                  )}
                  
                  <Typography variant="caption" display="block" sx={{ mt: 0.5, color: 'text.secondary' }}>
                    IFT: {plan.ift}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                  <Tooltip title={plan.activo ? 'Desactivar' : 'Activar'}>
                    <IconButton 
                      size="small" 
                      onClick={() => handleToggleActivo(plan.id)}
                      color={plan.activo ? 'success' : 'default'}
                    >
                      {plan.activo ? <CheckCircle /> : <Close />}
                    </IconButton>
                  </Tooltip>
                  
                  <Tooltip title="Editar">
                    <IconButton 
                      size="small" 
                      onClick={() => handleOpenDialog(plan)}
                      color="primary"
                    >
                      <Edit />
                    </IconButton>
                  </Tooltip>
                  
                  <Tooltip title="Eliminar">
                    <IconButton 
                      size="small" 
                      onClick={() => handleDeletePlan(plan.id)}
                      color="error"
                    >
                      <Delete />
                    </IconButton>
                  </Tooltip>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {planesFiltrados.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="body1" color="text.secondary">
            No hay planes en esta categoría
          </Typography>
          <Button 
            variant="outlined" 
            startIcon={<Add />}
            onClick={() => handleOpenDialog()}
            sx={{ mt: 2 }}
          >
            Crear primer plan
          </Button>
        </Box>
      )}

      {/* Dialog para agregar/editar plan */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {modoEdicion ? 'Editar Plan' : 'Agregar Nuevo Plan'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Nombre del Plan"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              sx={{ mb: 2 }}
              required
            />

            <TextField
              select
              fullWidth
              label="Categoría"
              value={formData.categoria}
              onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
              sx={{ mb: 2 }}
            >
              {categorias.map((cat) => (
                <MenuItem key={cat} value={cat}>{cat}</MenuItem>
              ))}
            </TextField>

            <TextField
              fullWidth
              label="Precio Mensual ($)"
              type="number"
              value={formData.precio}
              onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
              sx={{ mb: 2 }}
              required
              InputProps={{ inputProps: { min: 0 } }}
            />

            {/* Campos específicos según categoría */}
            {formData.categoria !== CATEGORIAS.HIBRIDO && formData.categoria !== CATEGORIAS.ANTENA_WIRELESS && (
              <>
                <Grid container spacing={2} sx={{ mb: 2 }}>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Velocidad Descarga (Mbps)"
                      type="number"
                      value={formData.descarga}
                      onChange={(e) => setFormData({ ...formData, descarga: e.target.value })}
                      InputProps={{ inputProps: { min: 0 } }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Velocidad Subida (Mbps)"
                      type="number"
                      value={formData.subida}
                      onChange={(e) => setFormData({ ...formData, subida: e.target.value })}
                      InputProps={{ inputProps: { min: 0 } }}
                    />
                  </Grid>
                </Grid>

                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.simetrica}
                      onChange={(e) => setFormData({ ...formData, simetrica: e.target.checked })}
                    />
                  }
                  label="Conexión Simétrica"
                  sx={{ mb: 2, display: 'block' }}
                />

                {formData.categoria === CATEGORIAS.SOLIT_TV && (
                  <TextField
                    fullWidth
                    label="Canales"
                    value={formData.canales}
                    onChange={(e) => setFormData({ ...formData, canales: e.target.value })}
                    sx={{ mb: 2 }}
                    placeholder="Ej: 47 (41 HD / 6 SD)"
                  />
                )}
              </>
            )}

            {(formData.categoria === CATEGORIAS.HIBRIDO || formData.categoria === CATEGORIAS.ANTENA_WIRELESS) && (
              <TextField
                fullWidth
                label="Velocidad (Mbps)"
                type="number"
                value={formData.velocidad}
                onChange={(e) => setFormData({ ...formData, velocidad: e.target.value })}
                sx={{ mb: 2 }}
                InputProps={{ inputProps: { min: 0 } }}
              />
            )}

            <TextField
              fullWidth
              label="Número IFT"
              value={formData.ift}
              onChange={(e) => setFormData({ ...formData, ift: e.target.value })}
              sx={{ mb: 2 }}
            />

            <FormControlLabel
              control={
                <Switch
                  checked={formData.destacado}
                  onChange={(e) => setFormData({ ...formData, destacado: e.target.checked })}
                />
              }
              label="Marcar como plan destacado"
              sx={{ display: 'block' }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} startIcon={<Close />}>
            Cancelar
          </Button>
          <Button 
            onClick={handleSavePlan} 
            variant="contained" 
            startIcon={<Save />}
            sx={{ background: getCardColor(formData.categoria) }}
          >
            {modoEdicion ? 'Actualizar' : 'Guardar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};


export default PlansManagement;