import React, { useState } from 'react';
import {
  Box, Stepper, Step, StepLabel, StepContent, Button, Paper,
  Typography, TextField, Radio, RadioGroup, FormControlLabel,
  FormControl, FormLabel, InputAdornment, IconButton, Tooltip,
  CircularProgress, Alert, Card, CardContent, Grid, Divider, Chip, MenuItem
} from '@mui/material';
import {
  MyLocation, ContentCopy, CheckCircle, WhatsApp,
  Download, Upload, Wifi
} from '@mui/icons-material';

import { useProspectos } from '../../hooks/useProspectos';
import { useCanvaceadores } from '../../hooks/useCanvaceadores';

const pasos = [
  { label: 'Información Básica del Prospecto', description: 'Registra los datos de contacto iniciales.' },
  { label: 'Captura de Ubicación', description: 'Selecciona cómo registrarás las coordenadas del domicilio.' },
  { label: 'Interés y Cotización', description: 'Define qué servicio o paquete le interesa.' },
  { label: 'Resumen y Cierre', description: 'Confirma los datos para enviarlos al sistema.' }
];

const PLANES_FIBRA_SIMETRICA = [
  { id: 'sim-intermedio', nombre: 'INTERMEDIO', precio: 309, descarga: 30, subida: 30, simetrica: true, ift: '1065567', color: '#d63384', colorGradient: 'linear-gradient(135deg, #d63384 0%, #e83e8c 100%)', destacado: false },
  { id: 'sim-avanzado', nombre: 'AVANZADO', precio: 409, descarga: 60, subida: 60, simetrica: true, ift: '1065572', color: '#d4a017', colorGradient: 'linear-gradient(135deg, #d4a017 0%, #e6b422 100%)', destacado: false },
  { id: 'sim-plus', nombre: 'PLUS', precio: 509, descarga: 100, subida: 100, simetrica: true, ift: '1065577', color: '#2196F3', colorGradient: 'linear-gradient(135deg, #2196F3 0%, #42a5f5 100%)', destacado: true }
];

const PLANES_FIBRA_ASIMETRICA = [
  { id: 'asim-basico', nombre: 'BÁSICO', precio: 310, descarga: 10, subida: 5, simetrica: false, ift: '1065496', color: '#d63384', colorGradient: 'linear-gradient(135deg, #d63384 0%, #e83e8c 100%)', destacado: false },
  { id: 'asim-intermedio', nombre: 'INTERMEDIO', precio: 410, descarga: 15, subida: 5, simetrica: false, ift: '1065502', color: '#4CAF50', colorGradient: 'linear-gradient(135deg, #4CAF50 0%, #66bb6a 100%)', destacado: false },
  { id: 'asim-avanzado', nombre: 'AVANZADO', precio: 510, descarga: 20, subida: 5, simetrica: false, ift: '1065535', color: '#d63384', colorGradient: 'linear-gradient(135deg, #d63384 0%, #e83e8c 100%)', destacado: false }
];

const PLANES_HIBRIDOS = [
  { id: 'hib-10', nombre: 'Hibrido 10 Mbps', velocidad: 10, precio: 250 },
  { id: 'hib-20', nombre: 'Hibrido 20 Mbps', velocidad: 20, precio: 300 },
  { id: 'hib-40', nombre: 'Hibrido 40 Mbps', velocidad: 40, precio: 400 },
  { id: 'hib-60', nombre: 'Hibrido 60 Mbps', velocidad: 60, precio: 500 },
  { id: 'hib-5', nombre: 'Hibrido 5 Mbps', velocidad: 5, precio: 200 }
];

const PLANES_ANTENA_WIRELESS = [
  { id: 'wifi-10', nombre: 'WIFI MIX 10 Mbps', velocidad: 10, precio: 250 },
  { id: 'wifi-20', nombre: 'WIFI MIX 20 Mbps', velocidad: 20, precio: 300 },
  { id: 'wifi-40', nombre: 'WIFI MIX 40 Mbps', velocidad: 40, precio: 400 },
  { id: 'wifi-50', nombre: 'WIFI MIX 50 Mbps', velocidad: 50, precio: 500 }
];

const TarjetaPlanCanvaceo = ({ plan, seleccionado, onSelect }) => {
  return (
    <Card onClick={() => onSelect(plan)} sx={{ position: 'relative', cursor: 'pointer', borderRadius: 3, overflow: 'hidden', border: seleccionado ? '3px solid #1976d2' : '2px solid #e0e0e0', transition: 'all 0.3s ease', transform: seleccionado ? 'scale(1.02)' : 'scale(1)', boxShadow: seleccionado ? '0 8px 25px rgba(25, 118, 210, 0.35)' : '0 4px 15px rgba(0,0,0,0.08)', '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 12px 30px rgba(0,0,0,0.15)' } }}>
      {plan.destacado && (<Box sx={{ position: 'absolute', top: 8, right: -25, backgroundColor: '#ff9800', color: 'white', px: 3, py: 0.5, fontSize: '0.65rem', fontWeight: 700, transform: 'rotate(45deg)', zIndex: 2 }}>POPULAR</Box>)}
      <Box sx={{ background: plan.colorGradient, py: 1.5, textAlign: 'center' }}>
        <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 900, letterSpacing: 1, textShadow: '2px 2px 4px rgba(0,0,0,0.2)' }}>{plan.nombre}</Typography>
      </Box>
      <CardContent sx={{ p: 2 }}>
        <Box sx={{ textAlign: 'center', mb: 1.5 }}>
          <Typography sx={{ fontSize: '1.8rem', fontWeight: 900, color: '#1a1a1a', lineHeight: 1 }}>${plan.precio}</Typography>
          <Typography sx={{ color: '#d63384', fontSize: '0.75rem', fontWeight: 600 }}>mensual</Typography>
        </Box>
        <Divider sx={{ my: 1 }} />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, mb: 0.5 }}>
          <Download sx={{ color: '#9c27b0', fontSize: 16 }} />
          <Typography variant="caption" sx={{ color: '#333' }}>Bajada: <strong>{plan.descarga || plan.velocidad}Mbps</strong></Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, mb: 0.5 }}>
          <Upload sx={{ color: '#9c27b0', fontSize: 16 }} />
          <Typography variant="caption" sx={{ color: '#333' }}>Subida: <strong>{plan.subida || plan.velocidad}Mbps</strong></Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, mb: 1 }}>
          <Wifi sx={{ color: '#d63384', fontSize: 16 }} />
          <Typography variant="caption" sx={{ color: '#333' }}>{plan.simetrica !== undefined ? <><strong style={{ color: plan.simetrica ? '#4CAF50' : '#ff9800' }}>{plan.simetrica ? 'Simétrica' : 'Asimétrica'}</strong></> : 'Wireless'}</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, mb: 1.5 }}>
          <CheckCircle sx={{ color: '#4CAF50', fontSize: 14 }} />
          <Typography variant="caption" sx={{ color: '#333', fontSize: '0.7rem' }}>IFT: {plan.ift || 'N/A'}</Typography>
        </Box>
        {seleccionado && <Chip label="✓ Seleccionado" color="success" size="small" sx={{ fontWeight: 700, width: '100%' }} />}
      </CardContent>
    </Card>
  );
};

const TablaPlanesCanvaceo = ({ planes, seleccionadoId, onSelect, titulo, colorPrincipal }) => {
  const color = colorPrincipal || '#26a69a';
  return (
    <Paper elevation={0} sx={{ borderRadius: 3, overflow: 'hidden', border: `2px solid ${color}`, background: `linear-gradient(135deg, #e0f7fa 0%, #b2ebf2 100%)` }}>
      <Box sx={{ p: 2, textAlign: 'center', background: `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)` }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 900, color: 'white', letterSpacing: 1 }}>{titulo}</Typography>
      </Box>
      <Box sx={{ p: 1.5 }}>
        {planes.map((plan) => (
          <Box key={plan.id} onClick={() => onSelect(plan)} sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', mb: 0.5, borderRadius: 1.5, overflow: 'hidden', cursor: 'pointer', border: seleccionadoId === plan.id ? '2px solid #1976d2' : '2px solid transparent', backgroundColor: seleccionadoId === plan.id ? '#e3f2fd' : 'white', transition: 'all 0.2s', '&:hover': { backgroundColor: '#e0f7fa', transform: 'scale(1.01)' } }}>
            <Typography sx={{ p: 1, textAlign: 'center', textDecoration: 'underline', fontWeight: 600, color: '#333', fontSize: '0.85rem' }}>{plan.nombre}</Typography>
            <Typography sx={{ p: 1, textAlign: 'center', fontWeight: 700, color: color, borderLeft: '2px solid #b2ebf2', fontSize: '0.9rem' }}>${plan.precio}/mes</Typography>
          </Box>
        ))}
      </Box>
    </Paper>
  );
};

const SeleccionPlanesCanvaceo = ({ planSeleccionado, onPlanSeleccionado }) => {
  const [categoria, setCategoria] = useState('simetrica');
  const handleSeleccionar = (plan) => { onPlanSeleccionado(plan); };

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2, color: '#1e293b' }}>Selecciona el Paquete de Interés</Typography>
      <RadioGroup row value={categoria} onChange={(e) => setCategoria(e.target.value)} sx={{ mb: 2, '& .MuiFormControlLabel-label': { fontSize: '0.85rem', fontWeight: 600 } }}>
        <FormControlLabel value="simetrica" control={<Radio size="small" />} label="Fibra Simétrica" />
        <FormControlLabel value="asimetrica" control={<Radio size="small" />} label="Fibra Asimétrica" />
        <FormControlLabel value="hibrido" control={<Radio size="small" />} label="Híbrido" />
        <FormControlLabel value="wireless" control={<Radio size="small" />} label="Wireless" />
      </RadioGroup>
      {categoria === 'simetrica' && (<Box><Grid container spacing={2}>{PLANES_FIBRA_SIMETRICA.map((plan) => (<Grid item xs={12} sm={4} key={plan.id}><TarjetaPlanCanvaceo plan={plan} seleccionado={planSeleccionado?.id === plan.id} onSelect={handleSeleccionar} /></Grid>))}</Grid></Box>)}
      {categoria === 'asimetrica' && (<Box><Grid container spacing={2}>{PLANES_FIBRA_ASIMETRICA.map((plan) => (<Grid item xs={12} sm={4} key={plan.id}><TarjetaPlanCanvaceo plan={plan} seleccionado={planSeleccionado?.id === plan.id} onSelect={handleSeleccionar} /></Grid>))}</Grid></Box>)}
      {categoria === 'hibrido' && (<Box sx={{ maxWidth: 500 }}><TablaPlanesCanvaceo planes={PLANES_HIBRIDOS} seleccionadoId={planSeleccionado?.id} onSelect={handleSeleccionar} titulo="HÍBRIDO" colorPrincipal="#26a69a" /></Box>)}
      {categoria === 'wireless' && (<Box sx={{ maxWidth: 500 }}><TablaPlanesCanvaceo planes={PLANES_ANTENA_WIRELESS} seleccionadoId={planSeleccionado?.id} onSelect={handleSeleccionar} titulo="ANTENA / WIRELESS" colorPrincipal="#7c4dff" /></Box>)}
      {planSeleccionado && (<Paper sx={{ mt: 2, p: 1.5, backgroundColor: '#e8f5e9', borderRadius: 2, border: '2px solid #4CAF50', display: 'flex', alignItems: 'center', gap: 1.5 }}><CheckCircle sx={{ color: '#4CAF50', fontSize: 28 }} /><Box sx={{ flex: 1 }}><Typography variant="caption" sx={{ fontWeight: 700, color: '#2e7d32', display: 'block' }}>Plan: {planSeleccionado.nombre}</Typography><Typography variant="caption" sx={{ color: '#555' }}>${planSeleccionado.precio}/mes • {planSeleccionado.descarga || planSeleccionado.velocidad}Mbps</Typography></Box><Chip label="✓" color="success" size="small" sx={{ fontWeight: 700 }} /></Paper>)}
    </Box>
  );
};


const NewProspect = ({ usuarioActual }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = useState(new Set());
  const [metodoUbicacion, setMetodoUbicacion] = useState('manual');
  const [loadingGps, setLoadingGps] = useState(false);
  const [coordenadas, setCoordenadas] = useState('');
  const [linkCopiado, setLinkCopiado] = useState(false);
  const [planInteres, setPlanInteres] = useState(null);
  const [errorApi, setErrorApi] = useState(null);
  const [guardando, setGuardando] = useState(false);

  const { createProspecto } = useProspectos();
  const { canvaceadores, loading: loadingCanvaceadores, error: errorCanvaceadores } = useCanvaceadores();

  const [formData, setFormData] = useState({
    canvaceador_id: '',
    nombre_completo: '',
    telefono_whatsapp: '',
    direccion_calle_numero: '',
    direccion_colonia: '',
    referencia_domicilio: '',
    notas_canvaceador: ''
  });

  const isStepOptional = (step) => step === 1;
  const isStepSkipped = (step) => skipped.has(step);

  
  const validarPaso = () => {
    if (activeStep === 0) {
      
      if (usuarioActual?.tipo !== 'canvaceador' && !formData.canvaceador_id) {
        setErrorApi('Debes seleccionar un canvaceador');
        return false;
      }
      if (!formData.nombre_completo.trim() || !formData.telefono_whatsapp.trim()) {
        setErrorApi('Nombre y teléfono son obligatorios');
        return false;
      }
    }
    setErrorApi(null);
    return true;
  };

  const handleNext = async () => {
    if (!validarPaso()) return;

    if (activeStep === pasos.length - 1) {
      await guardarProspecto();
      return;
    }

    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  
  const guardarProspecto = async () => {
    setGuardando(true);
    setErrorApi(null);

    try {
      
      const datosParaBackend = {
        
        canvaceador_id: usuarioActual?.tipo === 'canvaceador' 
          ? usuarioActual.id 
          : parseInt(formData.canvaceador_id),
        nombre_completo: formData.nombre_completo,
        telefono_whatsapp: formData.telefono_whatsapp,
        metodo_ubicacion: metodoUbicacion,
        direccion_calle_numero: formData.direccion_calle_numero || null,
        direccion_colonia: formData.direccion_colonia || null,
        referencia_domicilio: formData.referencia_domicilio || null,
        plan_interes: planInteres?.nombre || null,
        notas_canvaceador: formData.notas_canvaceador || null,
        estado: 'Nuevo'
      };

      
      if (coordenadas && coordenadas.includes(',')) {
        const partes = coordenadas.split(',');
        const lat = parseFloat(partes[0].trim());
        const lng = parseFloat(partes[1].trim());

        if (!isNaN(lat) && !isNaN(lng)) {
          datosParaBackend.ubicacion_gps = `POINT(${lng} ${lat})`;
        }
      }

      console.log('📤 Enviando datos al backend:', datosParaBackend);

      
      const nuevoProspecto = await createProspecto(datosParaBackend);

      console.log('✅ Prospecto guardado:', nuevoProspecto);
      setActiveStep((prev) => prev + 1);
      
    } catch (err) {
      console.error('❌ Error al guardar:', err);

      if (err.response && err.response.data) {
        console.error('🔴 Error detallado del backend:', err.response.data);

        if (typeof err.response.data === 'string') {
          setErrorApi(`Error: ${err.response.data}`);
        } else if (err.response.data.detail) {
          setErrorApi(`Error: ${err.response.data.detail}`);
        } else {
          const errores = Object.entries(err.response.data)
            .map(([campo, mensajes]) => {
              const msg = Array.isArray(mensajes) ? mensajes.join(', ') : mensajes;
              return `• ${campo}: ${msg}`;
            })
            .join('\n');
          setErrorApi(`Error de validación:\n${errores}`);
        }
      } else {
        setErrorApi(`Error: ${err.message}`);
      }
    } finally {
      setGuardando(false);
    }
  };

  const handleBack = () => { setActiveStep((prevActiveStep) => prevActiveStep - 1); };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) { throw new Error("No puedes saltar un paso que no es opcional."); }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  const handleReset = () => {
    setActiveStep(0);
    setCoordenadas('');
    setMetodoUbicacion('manual');
    setPlanInteres(null);
    setErrorApi(null);
    setFormData({
      canvaceador_id: '',
      nombre_completo: '',
      telefono_whatsapp: '',
      direccion_calle_numero: '',
      direccion_colonia: '',
      referencia_domicilio: '',
      notas_canvaceador: ''
    });
  };

  const obtenerUbicacionGPS = () => {
    setLoadingGps(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => { setCoordenadas(`${position.coords.latitude}, ${position.coords.longitude}`); setLoadingGps(false); },
        (error) => { console.error("Error obteniendo ubicación:", error); alert("Por favor, permite el acceso a la ubicación en tu navegador."); setLoadingGps(false); },
        { enableHighAccuracy: true }
      );
    } else { alert("Tu navegador no soporta geolocalización."); setLoadingGps(false); }
  };

  const copiarLinkCliente = () => {
    const link = "https://solitsystem.app/loc/req-98x7";
    navigator.clipboard.writeText(link);
    setLinkCopiado(true);
    setTimeout(() => setLinkCopiado(false), 3000);
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            {}
            {usuarioActual?.tipo === 'canvaceador' ? (
              <Alert severity="success" icon={<CheckCircle />} sx={{ mb: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                  👤 Canvaceador: {usuarioActual.nombre}
                </Typography>
                <Typography variant="caption" display="block">
                  ID: {usuarioActual.id} • Empleado: {usuarioActual.numero_empleado}
                </Typography>
                <Typography variant="caption" display="block" sx={{ mt: 0.5, fontStyle: 'italic' }}>
                  Se usará automáticamente tu cuenta para registrar este prospecto.
                </Typography>
              </Alert>
            ) : (
              
              <TextField
                select
                label="Canvaceador Responsable"
                variant="outlined"
                fullWidth
                size="small"
                required
                value={formData.canvaceador_id}
                onChange={(e) => setFormData({ ...formData, canvaceador_id: e.target.value })}
                disabled={loadingCanvaceadores}
                error={!!errorCanvaceadores}
                helperText={
                  loadingCanvaceadores
                    ? "Cargando canvaceadores..."
                    : errorCanvaceadores
                      ? `Error: ${errorCanvaceadores}`
                      : canvaceadores.length === 0
                        ? "No hay canvaceadores registrados. Crea uno primero en el backend."
                        : `Selecciona el canvaceador (${canvaceadores.length} disponibles)`
                }
              >
                {canvaceadores.map((canv) => (
                  <MenuItem key={canv.id} value={canv.id}>
                    {canv.nombreCompleto || canv.numero_empleado || `Canvaceador #${canv.id}`}
                  </MenuItem>
                ))}
              </TextField>
            )}

            <TextField
              label="Nombre Completo del Prospecto"
              variant="outlined"
              fullWidth
              size="small"
              required
              value={formData.nombre_completo}
              onChange={(e) => setFormData({ ...formData, nombre_completo: e.target.value })}
            />
            <TextField
              label="Teléfono (WhatsApp)"
              variant="outlined"
              fullWidth
              size="small"
              required
              value={formData.telefono_whatsapp}
              onChange={(e) => setFormData({ ...formData, telefono_whatsapp: e.target.value })}
            />
          </Box>
        );
      case 1:
        return (
          <Box sx={{ mt: 2 }}>
            <FormControl component="fieldset">
              <FormLabel component="legend" sx={{ mb: 1, fontWeight: 600 }}>Método de Registro de Domicilio</FormLabel>
              <RadioGroup value={metodoUbicacion} onChange={(e) => setMetodoUbicacion(e.target.value)}>
                <FormControlLabel value="manual" control={<Radio />} label="1. Llenado de formulario (Tengo la dirección)" />
                <FormControlLabel value="gps" control={<Radio />} label="2. Guardar ubicación exacta en tiempo real (Estoy en el sitio)" />
                <FormControlLabel value="link" control={<Radio />} label="3. Enviar link al cliente (Para que él mande su ubicación)" />
              </RadioGroup>
            </FormControl>
            <Box sx={{ mt: 3, p: 2, backgroundColor: '#f8fafc', borderRadius: 2, border: '1px solid #e2e8f0' }}>
              {metodoUbicacion === 'manual' && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <TextField
                    label="Calle y Número"
                    fullWidth
                    size="small"
                    value={formData.direccion_calle_numero}
                    onChange={(e) => setFormData({ ...formData, direccion_calle_numero: e.target.value })}
                  />
                  <TextField
                    label="Colonia"
                    fullWidth
                    size="small"
                    value={formData.direccion_colonia}
                    onChange={(e) => setFormData({ ...formData, direccion_colonia: e.target.value })}
                  />
                  <TextField
                    label="Referencia (Ej. Casa roja frente al parque)"
                    fullWidth
                    size="small"
                    multiline
                    rows={2}
                    value={formData.referencia_domicilio}
                    onChange={(e) => setFormData({ ...formData, referencia_domicilio: e.target.value })}
                  />
                </Box>
              )}
              {metodoUbicacion === 'gps' && (
                <Box sx={{ textAlign: 'center', py: 2 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={loadingGps ? <CircularProgress size={20} color="inherit" /> : <MyLocation />}
                    onClick={obtenerUbicacionGPS}
                    disabled={loadingGps}
                    sx={{ mb: 2 }}
                  >
                    {loadingGps ? 'Obteniendo GPS...' : 'Capturar mi Ubicación Actual'}
                  </Button>
                  {coordenadas && (
                    <Alert severity="success" icon={<CheckCircle />}>
                      Coordenadas: <strong>{coordenadas}</strong>
                    </Alert>
                  )}
                </Box>
              )}
              {metodoUbicacion === 'link' && (
                <Box sx={{ textAlign: 'center', py: 2 }}>
                  <Typography variant="body2" sx={{ mb: 2, color: '#64748b' }}>
                    Genera un enlace para enviarlo al cliente.
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    value="https://solitsystem.app/loc/req-98x7"
                    InputProps={{
                      readOnly: true,
                      endAdornment: (
                        <InputAdornment position="end">
                          <Tooltip title={linkCopiado ? "¡Copiado!" : "Copiar Link"}>
                            <IconButton onClick={copiarLinkCliente} color={linkCopiado ? "success" : "default"}>
                              {linkCopiado ? <CheckCircle /> : <ContentCopy />}
                            </IconButton>
                          </Tooltip>
                        </InputAdornment>
                      ),
                    }}
                  />
                  <Button
                    variant="outlined"
                    color="success"
                    startIcon={<WhatsApp />}
                    sx={{ mt: 2, textTransform: 'none' }}
                  >
                    Enviar por WhatsApp
                  </Button>
                </Box>
              )}
            </Box>
          </Box>
        );
      case 2:
        return (
          <Box sx={{ mt: 2 }}>
            <SeleccionPlanesCanvaceo planSeleccionado={planInteres} onPlanSeleccionado={setPlanInteres} />
            <TextField
              label="Notas del Canvaceador"
              fullWidth
              size="small"
              multiline
              rows={3}
              sx={{ mt: 3 }}
              placeholder="Ej. Cliente interesado en instalación rápida..."
              value={formData.notas_canvaceador}
              onChange={(e) => setFormData({ ...formData, notas_canvaceador: e.target.value })}
            />
          </Box>
        );
      case 3:
        
        let nombreCanvaceador = 'No seleccionado';
        if (usuarioActual?.tipo === 'canvaceador') {
          nombreCanvaceador = `${usuarioActual.nombre} (ID: ${usuarioActual.id})`;
        } else {
          const canvaceadorSeleccionado = canvaceadores.find(c => c.id == formData.canvaceador_id);
          nombreCanvaceador = canvaceadorSeleccionado?.nombreCompleto || canvaceadorSeleccionado?.numero_empleado || 'No seleccionado';
        }

        return (
          <Box sx={{ mt: 2 }}>
            {errorApi && (
              <Alert severity="error" sx={{ mb: 2, whiteSpace: 'pre-line' }}>
                {errorApi}
              </Alert>
            )}
            <Alert severity="info" sx={{ mb: 2 }}>
              <strong>Resumen del Prospecto:</strong>
              <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
                <li>👤 Canvaceador: <strong>{nombreCanvaceador}</strong></li>
                <li>👤 Nombre prospecto: <strong>{formData.nombre_completo}</strong></li>
                <li>📱 Teléfono: <strong>{formData.telefono_whatsapp}</strong></li>
                {formData.direccion_calle_numero && <li>📍 Dirección: {formData.direccion_calle_numero}, {formData.direccion_colonia}</li>}
                {planInteres && <li>📦 Plan: <strong>{planInteres.nombre}</strong> - ${planInteres.precio}/mes</li>}
                {coordenadas && <li>🗺️ Coordenadas: {coordenadas}</li>}
              </ul>
            </Alert>
            <Typography variant="body2" color="text.secondary">
              Al hacer clic en "Finalizar Registro", los datos se enviarán a la base de datos.
            </Typography>
          </Box>
        );
      default:
        return 'Paso desconocido';
    }
  };

  return (
    <Box sx={{ maxWidth: 800, margin: 'auto' }}>
      <Typography variant="h5" sx={{ fontWeight: 700, color: '#1e293b', mb: 3 }}>
        Registrar Nuevo Prospecto
      </Typography>
      <Paper variant="outlined" sx={{ p: 4, borderRadius: 3 }}>
        <Stepper activeStep={activeStep} orientation="vertical">
          {pasos.map((paso, index) => {
            const stepProps = {};
            const labelProps = {};
            if (isStepOptional(index)) {
              labelProps.optional = (<Typography variant="caption" color="error">Opcional</Typography>);
            }
            if (isStepSkipped(index)) {
              stepProps.completed = false;
            }
            return (
              <Step key={paso.label} {...stepProps}>
                <StepLabel {...labelProps}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{paso.label}</Typography>
                  <Typography variant="body2" sx={{ color: '#64748b' }}>{paso.description}</Typography>
                </StepLabel>
                <StepContent>
                  {renderStepContent(index)}
                  <Box sx={{ mb: 2, mt: 3 }}>
                    <div>
                      <Button
                        variant="contained"
                        onClick={handleNext}
                        disabled={guardando}
                        sx={{ mt: 1, mr: 1, boxShadow: 'none' }}
                      >
                        {guardando ? (
                          <><CircularProgress size={20} color="inherit" sx={{ mr: 1 }} /> Guardando...</>
                        ) : (
                          index === pasos.length - 1 ? 'Finalizar Registro' : 'Continuar'
                        )}
                      </Button>
                      {isStepOptional(index) && (
                        <Button color="inherit" onClick={handleSkip} sx={{ mt: 1, mr: 1 }}>
                          Saltar
                        </Button>
                      )}
                      <Button disabled={index === 0 || guardando} onClick={handleBack} sx={{ mt: 1, mr: 1 }}>
                        Atrás
                      </Button>
                    </div>
                  </Box>
                </StepContent>
              </Step>
            );
          })}
        </Stepper>

        {activeStep === pasos.length && (
          <Paper square elevation={0} sx={{ p: 3, textAlign: 'center', backgroundColor: '#f0fdf4', borderRadius: 2, mt: 2 }}>
            <CheckCircle sx={{ fontSize: 60, color: '#22c55e', mb: 2 }} />
            <Typography variant="h6" sx={{ color: '#166534', fontWeight: 600 }}>
              ¡Prospecto guardado con éxito!
            </Typography>
            <Typography sx={{ mt: 1, mb: 3, color: '#15803d' }}>
              La información ha sido enviada a la base de datos.
            </Typography>
            <Button onClick={handleReset} variant="outlined" color="success">
              Registrar otro prospecto
            </Button>
          </Paper>
        )}
      </Paper>
    </Box>
  );
};

export default NewProspect;