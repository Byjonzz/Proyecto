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
  FormControlLabel,
  CircularProgress
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Save,
  Close,
  Speed,
  CheckCircle
} from '@mui/icons-material';
import api from '../../services/api';

// Categorías de planes disponibles
const CATEGORIAS = {
  FIBRA_SIMETRICA: 'Fibra Simétrica',
  FIBRA_ASIMETRICA: 'Fibra Asimétrica',
  SOLIT_TV: 'Solit + TV',
  HIBRIDO: 'Híbrido',
  ANTENA_WIRELESS: 'Antena/Wireless'
};

const PlansManagement = () => {
  const [planes, setPlanes] = useState([]);
  const [categoriaActiva, setCategoriaActiva] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [planEditando, setPlanEditando] = useState(null);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [mensaje, setMensaje] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Estado del formulario
  const [formData, setFormData] = useState({
    nombre: '',
    categoria: CATEGORIAS.FIBRA_SIMETRICA,
    precio: '',
    descarga: '',
    subida: '',
    velocidad: '',
    simetrica: true,
    canales: '',
    ift: '',
    destacado: false,
    activo: true
  });

  // ✅ Cargar planes desde la API al iniciar
  useEffect(() => {
    cargarPlanes();
  }, []);

  const cargarPlanes = async () => {
    try {
      setLoading(true);
      console.log('📡 Cargando planes desde API...');
      
      const response = await api.get('/planes/');
      console.log('✅ Planes cargados:', response.data);
      
      setPlanes(response.data);
      
      if (response.data.length === 0) {
        mostrarMensaje('No hay planes registrados. Agrega el primer plan.', 'info');
      }
    } catch (error) {
      console.error('❌ Error al cargar planes:', error);
      mostrarMensaje('Error al cargar los planes desde el servidor.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const mostrarMensaje = (texto, tipo) => {
    setMensaje({ texto, tipo });
    setTimeout(() => setMensaje(null), 4000);
  };

  const handleOpenDialog = (plan = null) => {
    if (plan) {
      setPlanEditando(plan);
      setFormData({ 
        nombre: plan.nombre || '',
        categoria: plan.categoria || CATEGORIAS.FIBRA_SIMETRICA,
        precio: plan.precio || '',
        descarga: plan.descarga || '',
        subida: plan.subida || '',
        velocidad: plan.velocidad || '',
        simetrica: plan.simetrica !== undefined ? plan.simetrica : true,
        canales: plan.canales || '',
        ift: plan.ift || '',
        destacado: plan.destacado !== undefined ? plan.destacado : false,
        activo: plan.activo !== undefined ? plan.activo : true
      });
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
        simetrica: true,
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

  // ✅ GUARDAR PLAN - POST o PUT a la API
  const handleSavePlan = async () => {
    // Validaciones básicas
    if (!formData.nombre || !formData.precio || !formData.ift) {
      mostrarMensaje('Nombre, precio e IFT son obligatorios', 'error');
      return;
    }

    try {
      setLoading(true);
      
      // ✅ Preparar datos para la API - TODOS los campos con valores válidos
      const planData = {
        nombre: formData.nombre.trim(),
        categoria: formData.categoria,
        precio: parseFloat(formData.precio).toFixed(2),
        // ✅ Los CharField NO pueden ser null ni vacíos, usar "0" o "N/A" como default
        descarga: formData.descarga?.toString().trim() || '0',
        subida: formData.subida?.toString().trim() || '0',
        velocidad: formData.velocidad?.toString().trim() || '0',
        simetrica: formData.simetrica,
        // ✅ Solo canales puede ser null según el modelo
        canales: formData.canales?.trim() || null,
        ift: formData.ift.trim(),
        destacado: formData.destacado,
        activo: formData.activo
      };

      console.log('📤 Enviando plan a la API:', planData);

      let response;
      
      if (modoEdicion && planEditando) {
        // ✅ ACTUALIZAR plan existente - PUT
        console.log('✏️ Actualizando plan ID:', planEditando.id);
        response = await api.put(`/planes/${planEditando.id}/`, planData);
        console.log('✅ Plan actualizado:', response.data);
        
        // Actualizar estado local
        const planesActualizados = planes.map(p => 
          p.id === planEditando.id ? response.data : p
        );
        setPlanes(planesActualizados);
        mostrarMensaje('Plan actualizado correctamente', 'success');
      } else {
        // ✅ CREAR nuevo plan - POST
        console.log('➕ Creando nuevo plan');
        response = await api.post('/planes/', planData);
        console.log('✅ Plan creado:', response.data);
        
        // Agregar al estado local
        setPlanes([...planes, response.data]);
        mostrarMensaje('Plan creado correctamente', 'success');
      }
      
      handleCloseDialog();
    } catch (error) {
      console.error('❌ Error al guardar plan:', error);
      
      // ✅ Mostrar error detallado del backend
      if (error.response && error.response.data) {
        console.error('🔴 Error detallado del backend:', error.response.data);
        
        let mensajeError = 'Error al guardar el plan:\n';
        
        if (typeof error.response.data === 'object') {
          Object.entries(error.response.data).forEach(([campo, mensajes]) => {
            const mensajeCampo = Array.isArray(mensajes) ? mensajes.join(', ') : mensajes;
            mensajeError += `\n• ${campo}: ${mensajeCampo}`;
          });
        } else {
          mensajeError += error.response.data;
        }
        
        mostrarMensaje(mensajeError, 'error');
      } else if (error.request) {
        mostrarMensaje('No se pudo conectar con el servidor. Verifica tu conexión.', 'error');
      } else {
        mostrarMensaje('Error inesperado: ' + error.message, 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  // ✅ ELIMINAR PLAN - DELETE a la API
  const handleDeletePlan = async (planId) => {
    if (window.confirm('¿Estás seguro de eliminar este plan? Esta acción no se puede deshacer.')) {
      try {
        setLoading(true);
        console.log('🗑️ Eliminando plan ID:', planId);
        
        await api.delete(`/planes/${planId}/`);
        console.log('✅ Plan eliminado');
        
        const planesActualizados = planes.filter(p => p.id !== planId);
        setPlanes(planesActualizados);
        mostrarMensaje('Plan eliminado correctamente', 'success');
      } catch (error) {
        console.error('❌ Error al eliminar plan:', error);
        mostrarMensaje('Error al eliminar el plan', 'error');
      } finally {
        setLoading(false);
      }
    }
  };

  // ✅ ACTIVAR/DESACTIVAR PLAN - PATCH a la API
  const handleToggleActivo = async (planId) => {
    try {
      const plan = planes.find(p => p.id === planId);
      if (!plan) return;
      
      const nuevoEstado = !plan.activo;
      
      console.log(`🔄 Cambiando estado del plan ${planId} a: ${nuevoEstado}`);
      
      const response = await api.patch(`/planes/${planId}/`, { activo: nuevoEstado });
      console.log('✅ Estado actualizado:', response.data);
      
      const planesActualizados = planes.map(p => 
        p.id === planId ? response.data : p
      );
      setPlanes(planesActualizados);
      mostrarMensaje(`Plan ${nuevoEstado ? 'activado' : 'desactivado'}`, 'success');
    } catch (error) {
      console.error('❌ Error al cambiar estado:', error);
      mostrarMensaje('Error al cambiar el estado del plan', 'error');
    }
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

  if (loading && planes.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Cargando planes...</Typography>
      </Box>
    );
  }

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
        <Alert severity={mensaje.tipo} sx={{ mb: 3, whiteSpace: 'pre-line' }}>
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
                      ${parseFloat(plan.precio).toFixed(0)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      /mes
                    </Typography>
                  </Box>
                </Box>

                <Divider sx={{ my: 1.5 }} />

                <Box sx={{ mb: 1.5 }}>
                  {plan.descarga && plan.descarga !== '0' && plan.subida && plan.subida !== '0' ? (
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
                        {plan.velocidad && plan.velocidad !== '0' ? `${plan.velocidad} Mbps` : 'N/A'}
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
              InputProps={{ inputProps: { min: 0, step: 0.01 } }}
            />

            {/* Campos específicos según categoría */}
            {formData.categoria !== CATEGORIAS.HIBRIDO && formData.categoria !== CATEGORIAS.ANTENA_WIRELESS && (
              <>
                <Grid container spacing={2} sx={{ mb: 2 }}>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Velocidad Descarga (Mbps)"
                      value={formData.descarga}
                      onChange={(e) => setFormData({ ...formData, descarga: e.target.value })}
                      helperText="Ej: 30, 60, 100"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Velocidad Subida (Mbps)"
                      value={formData.subida}
                      onChange={(e) => setFormData({ ...formData, subida: e.target.value })}
                      helperText="Ej: 30, 60, 100"
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
                value={formData.velocidad}
                onChange={(e) => setFormData({ ...formData, velocidad: e.target.value })}
                sx={{ mb: 2 }}
                helperText="Ej: 5, 10, 20, 40, 60"
              />
            )}

            <TextField
              fullWidth
              label="Número IFT *"
              value={formData.ift}
              onChange={(e) => setFormData({ ...formData, ift: e.target.value })}
              sx={{ mb: 2 }}
              required
              helperText="Este campo debe ser único"
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

            <FormControlLabel
              control={
                <Switch
                  checked={formData.activo}
                  onChange={(e) => setFormData({ ...formData, activo: e.target.checked })}
                />
              }
              label="Plan activo"
              sx={{ display: 'block', mt: 1 }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} startIcon={<Close />} disabled={loading}>
            Cancelar
          </Button>
          <Button 
            onClick={handleSavePlan} 
            variant="contained" 
            startIcon={loading ? <CircularProgress size={20} /> : <Save />}
            disabled={loading}
            sx={{ background: getCardColor(formData.categoria) }}
          >
            {loading ? 'Guardando...' : (modoEdicion ? 'Actualizar' : 'Guardar')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PlansManagement;