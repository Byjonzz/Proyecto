import React, { useState, useRef } from 'react';
import {
  Box, Paper, Typography, TextField, Button, MenuItem, 
  Alert, Stack, Stepper, Step, StepLabel, StepContent, Divider,
  Radio, RadioGroup, FormControlLabel, FormControl, FormLabel,
  CircularProgress, InputAdornment, Tooltip, IconButton
} from '@mui/material';
import { 
  BorderColor, Save, CheckCircle, AddPhotoAlternate, InfoOutlined,
  MyLocation, ContentCopy, WhatsApp, PinDrop
} from '@mui/icons-material';

const pasosContrato = [
  { label: 'Datos Personales y Contacto', description: 'INE, teléfonos y correo (Obligatorios).' },
  { label: 'Ubicación y Plan', description: 'Dirección, referencias y paquete comercial.' },
  { label: 'Evidencias y Cierre', description: 'Fotos del INE, Desglose de cobro y Firma.' }
];

const PlanAndQuotation = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [guardado, setGuardado] = useState(false);
  const [errorDireccion, setErrorDireccion] = useState(false);

  // Estados del Formulario
  const [formData, setFormData] = useState({
    ine: '',
    nombre: '',
    telefono1: '',
    telefono2: '',
    correo: '',
    plan: 'familiar',
    calleNumero: '',
    referencias: '',
    detallesCasa: ''
  });

  // Estados para la lógica de Ubicación
  const [metodoUbicacion, setMetodoUbicacion] = useState('manual');
  const [loadingGps, setLoadingGps] = useState(false);
  const [coordenadas, setCoordenadas] = useState('');
  const [linkCopiado, setLinkCopiado] = useState(false);
  const [mapPin, setMapPin] = useState(null); 

  // Estados para la firma
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

  // --- Funciones de Firma ---
  const startDrawing = (e) => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.lineWidth = 3; ctx.lineCap = 'round'; ctx.strokeStyle = '#0f172a';
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left;
    const y = (e.clientY || (e.touches && e.touches[0].clientY)) - rect.top;
    ctx.beginPath(); ctx.moveTo(x, y); setIsDrawing(true);
  };
  const draw = (e) => {
    if (!isDrawing) return; e.preventDefault();
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left;
    const y = (e.clientY || (e.touches && e.touches[0].clientY)) - rect.top;
    ctx.lineTo(x, y); ctx.stroke();
  };
  const stopDrawing = () => setIsDrawing(false);
  const limpiarFirma = () => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d'); ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  // --- Funciones de Ubicación ---
  const obtenerUbicacionGPS = () => {
    setLoadingGps(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoordenadas(`${position.coords.latitude}, ${position.coords.longitude}`);
          setLoadingGps(false);
        },
        (error) => {
          console.error("Error obteniendo ubicación:", error);
          alert("Por favor, permite el acceso a la ubicación en tu navegador.");
          setLoadingGps(false);
        },
        { enableHighAccuracy: true }
      );
    } else {
      alert("Tu navegador no soporta geolocalización.");
      setLoadingGps(false);
    }
  };

  const copiarLinkCliente = () => {
    navigator.clipboard.writeText("https://solitsystem.app/loc/req-98x7");
    setLinkCopiado(true);
    setTimeout(() => setLinkCopiado(false), 3000);
  };

  const handleMapClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Simulación de coordenadas
    const simLat = (18.4628 - (y * 0.0005)).toFixed(6); 
    const simLng = (-97.3928 + (x * 0.0005)).toFixed(6);
    
    setMapPin({ x, y });
    setCoordenadas(`${simLat}, ${simLng}`);
  };

  // --- Control del Stepper ---
  const handleNext = () => {
    if (activeStep === 1 && metodoUbicacion === 'manual' && !formData.calleNumero.trim()) {
      setErrorDireccion(true);
      return;
    }
    setErrorDireccion(false);
    setActiveStep((prev) => prev + 1);
  };
  const handleBack = () => setActiveStep((prev) => prev - 1);
  const handleSubmit = (e) => { e.preventDefault(); setGuardado(true); };

  const renderStepContent = (step) => {
    switch (step) {
      case 0: 
        return (
          <Stack spacing={3} sx={{ mt: 2 }}>
            <TextField label="ID del INE (16 dígitos traseros)" required fullWidth size="small" inputProps={{ maxLength: 16 }} helperText="Encuentra este número al reverso de la credencial." value={formData.ine} onChange={(e) => setFormData({...formData, ine: e.target.value.replace(/\D/g, '')})} />
            <TextField label="Nombre Completo del Titular" required fullWidth size="small" value={formData.nombre} onChange={(e) => setFormData({...formData, nombre: e.target.value})} />
            <TextField label="Teléfono Móvil 1" required fullWidth size="small" inputProps={{ maxLength: 10 }} value={formData.telefono1} onChange={(e) => setFormData({...formData, telefono1: e.target.value.replace(/\D/g, '')})} />
            <TextField label="Teléfono Móvil 2 (Opcional)" fullWidth size="small" inputProps={{ maxLength: 10 }} value={formData.telefono2} onChange={(e) => setFormData({...formData, telefono2: e.target.value.replace(/\D/g, '')})} />
            <TextField label="Correo Electrónico" type="email" required fullWidth size="small" value={formData.correo} onChange={(e) => setFormData({...formData, correo: e.target.value})} />
          </Stack>
        );
      case 1:
        return (
          <Stack spacing={3} sx={{ mt: 2 }}>
            <TextField select label="Paquete Comercial" value={formData.plan} onChange={(e) => setFormData({...formData, plan: e.target.value})} fullWidth size="small">
              <MenuItem value="basico">600 Megas ($499/mes)</MenuItem>
              <MenuItem value="familiar">500 Megas ($649/mes)</MenuItem>
              <MenuItem value="gamer">1 Giga ($899/mes)</MenuItem>
            </TextField>

            <Divider />

            <FormControl component="fieldset">
              <FormLabel component="legend" sx={{ fontWeight: 600, mb: 1, color: '#1e293b' }}>Método de Ubicación del Servicio</FormLabel>
              <RadioGroup value={metodoUbicacion} onChange={(e) => setMetodoUbicacion(e.target.value)}>
                <FormControlLabel value="manual" control={<Radio />} label="1. Dirección Manual (Calle y Número)" />
                <FormControlLabel value="gps" control={<Radio />} label="2. GPS en Tiempo Real (Estoy en el sitio)" />
                <FormControlLabel value="link" control={<Radio />} label="3. Link por WhatsApp (Pedir ubicación al cliente)" />
                <FormControlLabel value="mapa" control={<Radio />} label="4. Fijar Pin en el Mapa (Zonas sin calles)" />
              </RadioGroup>
            </FormControl>

            <Box sx={{ p: 2, backgroundColor: '#f8fafc', borderRadius: 2, border: '1px solid #e2e8f0' }}>
              
              {/* BLOQUE DINÁMICO: Obtención de Dirección/Coordenadas */}
              {metodoUbicacion === 'manual' && (
                <TextField label="Dirección (Calle y Número Obligatorio)" required error={errorDireccion} helperText={errorDireccion ? "Requerido" : ""} fullWidth size="small" value={formData.calleNumero} onChange={(e) => setFormData({...formData, calleNumero: e.target.value})} sx={{ mb: 2 }} />
              )}

              {metodoUbicacion === 'gps' && (
                <Box sx={{ textAlign: 'center', py: 2, mb: 2 }}>
                  <Button variant="contained" color="primary" startIcon={loadingGps ? <CircularProgress size={20} color="inherit" /> : <MyLocation />} onClick={obtenerUbicacionGPS} disabled={loadingGps} sx={{ mb: 2 }}>
                    {loadingGps ? 'Calculando GPS...' : 'Obtener Ubicación Actual'}
                  </Button>
                  {coordenadas && <Alert severity="success" icon={<CheckCircle />}>Coordenadas: <strong>{coordenadas}</strong></Alert>}
                </Box>
              )}

              {metodoUbicacion === 'link' && (
                <Box sx={{ textAlign: 'center', py: 2, mb: 2 }}>
                  <Typography variant="body2" sx={{ mb: 2, color: '#64748b' }}>Envía este link para que el cliente comparta su ubicación exacta.</Typography>
                  <TextField fullWidth size="small" value="https://solitsystem.app/loc/req-98x7" InputProps={{ readOnly: true, endAdornment: ( <InputAdornment position="end"> <Tooltip title={linkCopiado ? "¡Copiado!" : "Copiar Link"}> <IconButton onClick={copiarLinkCliente} color={linkCopiado ? "success" : "default"}> {linkCopiado ? <CheckCircle /> : <ContentCopy />} </IconButton> </Tooltip> </InputAdornment> )}} />
                  <Button variant="outlined" color="success" startIcon={<WhatsApp />} sx={{ mt: 2, textTransform: 'none' }}>Enviar por WhatsApp</Button>
                </Box>
              )}

              {metodoUbicacion === 'mapa' && (
                <Box sx={{ textAlign: 'center', py: 1, mb: 2 }}>
                  <Typography variant="body2" sx={{ mb: 2, color: '#64748b' }}>Haz clic en el mapa para soltar un marcador de ubicación.</Typography>
                  <Box 
                    onClick={handleMapClick}
                    sx={{ 
                      width: '100%', height: 250, backgroundColor: '#e2e8f0', borderRadius: 2, 
                      position: 'relative', overflow: 'hidden', cursor: 'crosshair',
                      backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")' 
                    }}
                  >
                    {!mapPin && (
                      <Typography variant="caption" sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: '#64748b', backgroundColor: 'rgba(255,255,255,0.7)', px: 1, borderRadius: 1 }}>
                        Clic aquí para fijar Pin
                      </Typography>
                    )}
                    {mapPin && (
                      <PinDrop color="error" sx={{ position: 'absolute', top: mapPin.y - 24, left: mapPin.x - 12, fontSize: 30 }} />
                    )}
                  </Box>
                  {coordenadas && <Alert severity="success" sx={{ mt: 2 }}>Pin fijado en: <strong>{coordenadas}</strong></Alert>}
                </Box>
              )}

              <Divider sx={{ my: 3 }} />

              {/* BLOQUE FIJO: Detalles que el instalador siempre necesita */}
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: '#334155' }}>
                Detalles Adicionales del Domicilio (Requerido en todos los métodos)
              </Typography>
              <Stack spacing={3}>
                <TextField label="Referencias de Ubicación" multiline rows={2} fullWidth size="small" placeholder="Ej. Entre calle Juárez y Morelos" value={formData.referencias} onChange={(e) => setFormData({...formData, referencias: e.target.value})} />
                <TextField label="Detalles de Fachada / Casa" multiline rows={2} fullWidth size="small" placeholder="Ej. Portón negro, fachada color naranja de dos pisos" value={formData.detallesCasa} onChange={(e) => setFormData({...formData, detallesCasa: e.target.value})} />
              </Stack>
            </Box>
          </Stack>
        );
      case 2:
        return (
          <Box sx={{ mt: 2 }} id="area-contrato-pdf">
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>Evidencias Documentales</Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3 }}>
              {/* Botón que abre la CÁMARA del celular */}
              <Button variant={formData.fotoFrente ? "contained" : "outlined"} color={formData.fotoFrente ? "success" : "primary"} component="label" startIcon={formData.fotoFrente ? <CheckCircle /> : <AddPhotoAlternate />} fullWidth>
                {formData.fotoFrente ? "Frente Capturado" : "Foto Frente INE"}
                <input type="file" hidden accept="image/*" capture="environment" onChange={(e) => setFormData({...formData, fotoFrente: true})} />
              </Button>
              
              <Button variant={formData.fotoReverso ? "contained" : "outlined"} color={formData.fotoReverso ? "success" : "primary"} component="label" startIcon={formData.fotoReverso ? <CheckCircle /> : <AddPhotoAlternate />} fullWidth>
                {formData.fotoReverso ? "Reverso Capturado" : "Foto Reverso INE"}
                <input type="file" hidden accept="image/*" capture="environment" onChange={(e) => setFormData({...formData, fotoReverso: true})} />
              </Button>
            </Stack>

            <Paper variant="outlined" sx={{ p: 2, bgcolor: '#f8fafc', mb: 3, borderRadius: 2 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>Desglose de Cobros (A pagar hoy)</Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}><Typography variant="body2">Instalación:</Typography><Typography variant="body2">$0.00</Typography></Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}><Typography variant="body2">Primer mes por adelantado:</Typography><Typography variant="body2">$499.00</Typography></Box>
              <Divider sx={{ mb: 1 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}><Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Total a Pagar:</Typography><Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#16a34a' }}>$499.00</Typography></Box>
            </Paper>

            <Alert severity="info" icon={<InfoOutlined />} sx={{ mb: 3 }}>
              **Información al Cliente:** El tiempo estimado para agendar su instalación es de **3 a 5 días hábiles**. Nos comunicaremos para confirmar la fecha exacta.
            </Alert>

            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
              <BorderColor sx={{ fontSize: 18 }} /> Firma del Cliente
            </Typography>
            <Box sx={{ backgroundColor: '#fff', border: '2px dashed #cbd5e1', borderRadius: 2, height: 200, touchAction: 'none' }}>
              <canvas ref={canvasRef} width={800} height={200} onMouseDown={startDrawing} onMouseMove={draw} onMouseUp={stopDrawing} onMouseLeave={stopDrawing} onTouchStart={startDrawing} onTouchMove={draw} onTouchEnd={stopDrawing} style={{ width: '100%', height: '100%', cursor: 'crosshair' }} />
            </Box>
            <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
                <Button size="small" onClick={limpiarFirma} color="error">Limpiar Firma</Button>
                {/* Función nativa de impresión / Generar PDF */}
                <Button size="small" onClick={() => window.print()} color="secondary">Generar PDF del Contrato</Button>
            </Stack>
          </Box>
        );
      default: return 'Desconocido';
    }
  };

  return (
    <Box sx={{ maxWidth: 850, margin: 'auto', p: 1 }}>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>Contrato y Firma</Typography>
      <Paper variant="outlined" sx={{ p: 4, borderRadius: 3 }}>
        <Stepper activeStep={activeStep} orientation="vertical">
          {pasosContrato.map((paso, index) => (
            <Step key={paso.label}>
              <StepLabel><Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{paso.label}</Typography></StepLabel>
              <StepContent>
                {renderStepContent(index)}
                <Box sx={{ mt: 3 }}>
                  <Button variant="contained" onClick={index === 2 ? handleSubmit : handleNext}>{index === 2 ? 'Finalizar' : 'Siguiente'}</Button>
                  <Button disabled={index === 0} onClick={handleBack} sx={{ ml: 1 }}>Atrás</Button>
                </Box>
              </StepContent>
            </Step>
          ))}
        </Stepper>
        {guardado && (
          <Alert severity="success" sx={{ mt: 2 }}>Contrato guardado exitosamente y enviado a logística.</Alert>
        )}
      </Paper>
    </Box>
  );
};

export default PlanAndQuotation;