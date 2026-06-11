import React, { useState, useRef } from 'react';
import SeleccionPlanes from '../Forms/SeleccionPlanes';
import { useContratos } from '../../hooks/useContratos';

import {
  Box, Paper, Typography, TextField, Button, MenuItem, 
  Alert, Stack, Stepper, Step, StepLabel, StepContent, Divider,
  Radio, RadioGroup, FormControlLabel, FormControl, FormLabel,
  CircularProgress, InputAdornment, Tooltip, IconButton, Chip
} from '@mui/material';
import { 
  BorderColor, Save, CheckCircle, AddPhotoAlternate, InfoOutlined,
  MyLocation, ContentCopy, WhatsApp, PinDrop, LocalOffer
} from '@mui/icons-material';

const pasosContrato = [
  { label: 'Datos Personales y Contacto', description: 'INE, teléfonos y correo (Obligatorios).' },
  { label: 'Ubicación y Plan', description: 'Dirección, referencias y paquete comercial.' },
  { label: 'Evidencias y Cierre', description: 'Fotos del INE, Desglose de cobro y Firma.' }
];

const PlanAndQuotation = ({ usuarioActual }) => {
  const { createContrato, loading: loadingContrato } = useContratos();
  
  const [activeStep, setActiveStep] = useState(0);
  const [guardado, setGuardado] = useState(false);
  const [errorDireccion, setErrorDireccion] = useState(false);
  const [errorPlan, setErrorPlan] = useState(false);
  const [errorApi, setErrorApi] = useState(null);

  const [formData, setFormData] = useState({
    ine: '',
    nombre: '',
    telefono1: '',
    telefono2: '',
    correo: '',
    plan: null,
    calleNumero: '',
    referencias: '',
    detallesCasa: ''
  });

  const [metodoUbicacion, setMetodoUbicacion] = useState('manual');
  const [loadingGps, setLoadingGps] = useState(false);
  const [coordenadas, setCoordenadas] = useState('');
  const [linkCopiado, setLinkCopiado] = useState(false);
  const [mapPin, setMapPin] = useState(null); 

  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const startDrawing = (e) => {
    const canvas = canvasRef.current; 
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.lineWidth = 3; 
    ctx.lineCap = 'round'; 
    ctx.strokeStyle = '#0f172a';
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left;
    const y = (e.clientY || (e.touches && e.touches[0].clientY)) - rect.top;
    ctx.beginPath(); 
    ctx.moveTo(x, y); 
    setIsDrawing(true);
  };
  
  const draw = (e) => {
    if (!isDrawing) return; 
    e.preventDefault();
    const canvas = canvasRef.current; 
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left;
    const y = (e.clientY || (e.touches && e.touches[0].clientY)) - rect.top;
    ctx.lineTo(x, y); 
    ctx.stroke();
  };
  
  const stopDrawing = () => setIsDrawing(false);
  
  const limpiarFirma = () => {
    const canvas = canvasRef.current; 
    if (!canvas) return;
    const ctx = canvas.getContext('2d'); 
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

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
    const simLat = (18.4628 - (y * 0.0005)).toFixed(6); 
    const simLng = (-97.3928 + (x * 0.0005)).toFixed(6);
    setMapPin({ x, y });
    setCoordenadas(`${simLat}, ${simLng}`);
  };

  const handleSeleccionarPlan = (plan) => {
    setFormData({...formData, plan: plan});
    setErrorPlan(false);
  };

  const handleNext = () => {
    if (activeStep === 1) {
      if (!formData.plan) { 
        setErrorPlan(true); 
        return; 
      }
      if (metodoUbicacion === 'manual' && !formData.calleNumero.trim()) { 
        setErrorDireccion(true); 
        return; 
      }
    }
    setErrorDireccion(false);
    setErrorPlan(false);
    setActiveStep((prev) => prev + 1);
  };
  
  const handleBack = () => setActiveStep((prev) => prev - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorApi(null);
    
    
    if (!formData.ine || formData.ine.length !== 16) {
      setErrorApi('El INE debe tener exactamente 16 dígitos');
      return;
    }
    if (!formData.nombre.trim()) {
      setErrorApi('El nombre completo es obligatorio');
      return;
    }
    if (formData.telefono1.length !== 10) {
      setErrorApi('El teléfono 1 debe tener exactamente 10 dígitos');
      return;
    }
    if (formData.telefono2 && formData.telefono2.length !== 10) {
      setErrorApi('El teléfono 2 debe tener exactamente 10 dígitos');
      return;
    }
    if (!formData.correo.trim()) {
      setErrorApi('El correo electrónico es obligatorio');
      return;
    }
    if (!formData.plan) {
      setErrorApi('Debes seleccionar un plan');
      return;
    }
    if (metodoUbicacion === 'manual' && !formData.calleNumero.trim()) {
      setErrorApi('La dirección es requerida');
      setErrorDireccion(true);
      setActiveStep(1);
      return;
    }
    
    
    const canvas = canvasRef.current;
    if (!canvas) {
      setErrorApi('Error al obtener la firma');
      return;
    }
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const isCanvasBlank = !imageData.data.some(channel => channel !== 0);
    if (isCanvasBlank) {
      setErrorApi('Por favor firma el contrato antes de continuar');
      return;
    }
    
    setGuardado(true);

    try {
      const firmaDigital = canvas.toDataURL('image/jpeg', 0.5);
      console.log('📏 Tamaño de la firma:', firmaDigital.length, 'caracteres');

      
      let calleNumeroFinal = '';
      if (metodoUbicacion === 'manual') {
        calleNumeroFinal = formData.calleNumero.trim();
      } else if (metodoUbicacion === 'gps') {
        calleNumeroFinal = coordenadas 
          ? `Ubicación GPS: ${coordenadas}` 
          : 'Ubicación por GPS';
      } else if (metodoUbicacion === 'link') {
        calleNumeroFinal = 'Ubicación enviada por link de WhatsApp';
      } else if (metodoUbicacion === 'mapa') {
        calleNumeroFinal = coordenadas 
          ? `Ubicación por mapa: ${coordenadas}` 
          : 'Ubicación por mapa';
      }

      
      const datosContrato = {
        ine_cliente: formData.ine,
        nombre_completo: formData.nombre.trim(),
        telefono1: formData.telefono1,
        telefono2: formData.telefono2 || '',
        correo: formData.correo.trim(),
        metodo_ubicacion: metodoUbicacion,
        calle_numero: calleNumeroFinal,  
        referencias: formData.referencias || '',
        detalles_fachada: formData.detallesCasa || '',
        plan_contratado: formData.plan.nombre,
        monto_instalacion: 0,
        monto_primer_mes: Number(formData.plan.precio) || 0,
        monto_total: Number(formData.plan.precio) || 0,
        firma_digital: firmaDigital,
        estatus: 'Pendiente Asignar',
        foto_ine_frente: '',
        foto_ine_reverso: '',
        foto_fachada: '',
        foto_poste: ''
      };

      // ----------------------------------------------------
      // 🐛 TRAMPA DE DEBUGGING Y ASIGNACIÓN SEGURA
      // ----------------------------------------------------
      console.log("1. ¿Qué tiene usuarioActual en este momento?:", usuarioActual);

      // Nos aseguramos de que los campos existan en el objeto antes de enviarlo
      datosContrato.canvaceador_id = null;
      datosContrato.tecnico_id = null;

      // Verificamos que el usuario no esté vacío y sea un objeto válido
      if (usuarioActual && typeof usuarioActual === 'object') {
        
        // Sacamos el ID (usamos perfil_id si existe, si no, el id normal)
        const idEmpleado = Number(usuarioActual.perfil_id || usuarioActual.id);
        
        // Sacamos el rol de forma segura (por si viene con mayúsculas o espacios)
        const rolEmpleado = String(usuarioActual.rol || '').toLowerCase().trim();

        console.log(`2. Detectado: Empleado ID: ${idEmpleado} | Rol: ${rolEmpleado}`);

        if (rolEmpleado === 'canvaceador') {
          datosContrato.canvaceador_id = idEmpleado;
        } else if (rolEmpleado === 'tecnico') {
          datosContrato.tecnico_id = idEmpleado;
        }
        
      } else {
        console.warn("⚠️ ALERTA: usuarioActual está vacío o no es un objeto. Revisa el componente padre.");
      }

      console.log('3. 📄 JSON final que se va a enviar al Backend:', datosContrato);
      // ----------------------------------------------------
      
      if (coordenadas && coordenadas.includes(',')) {
        const partes = coordenadas.split(',');
        const lat = parseFloat(partes[0].trim());
        const lng = parseFloat(partes[1].trim());
        if (!isNaN(lat) && !isNaN(lng)) {
          datosContrato.coordenadas_gps = `POINT(${lng} ${lat})`;
        }
      }

      
      if (usuarioActual) {
        const idEmpleado = Number(usuarioActual.perfil_id || usuarioActual.id);

        if (usuarioActual.rol.toLowerCase() === 'canvaceador') {
          datosContrato.canvaceador_id = idEmpleado;
        } 
        else if (usuarioActual.rol.toLowerCase() === 'tecnico') {
          datosContrato.tecnico_id = idEmpleado;
        }
      }

      console.log('📄 Guardando contrato:', datosContrato);
      console.log('👤 Usuario actual:', usuarioActual);
      
      const nuevoContrato = await createContrato(datosContrato);
      console.log('✅ Contrato guardado exitosamente:', nuevoContrato);
      
      
      setTimeout(() => {
        setGuardado(false);
        setActiveStep(0);
        setFormData({
          ine: '', nombre: '', telefono1: '', telefono2: '',
          correo: '', plan: null, calleNumero: '',
          referencias: '', detallesCasa: ''
        });
        setCoordenadas('');
        setMetodoUbicacion('manual');
        limpiarFirma();
      }, 3000);
      
    } catch (err) {
      console.error('❌ Error al guardar contrato:', err);
      
      if (err.response && err.response.data) {
        console.error('🔴 Error detallado del backend:', JSON.stringify(err.response.data, null, 2));
        
        const errores = Object.entries(err.response.data)
          .map(([campo, mensajes]) => {
            const msg = Array.isArray(mensajes) ? mensajes.join(', ') : String(mensajes);
            return `• ${campo}: ${msg}`;
          })
          .join('\n');
        
        setErrorApi(`Error de validación:\n${errores}`);
      } else {
        setErrorApi(`Error al guardar el contrato: ${err.message}`);
      }
      
      setGuardado(false);
    }
  };

  const calcularTotales = () => {
    if (!formData.plan) return { instalacion: 0, primerMes: 0, total: 0 };
    const primerMes = formData.plan.precio || 0;
    const instalacion = 0;
    const total = instalacion + primerMes;
    return { instalacion, primerMes, total };
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0: 
        return (
          <Stack spacing={3} sx={{ mt: 2 }}>
            <TextField 
              label="ID del INE (16 dígitos) *" 
              required 
              fullWidth 
              size="small" 
              slotProps={{ input: { maxLength: 16 } }}
              value={formData.ine} 
              onChange={(e) => setFormData({...formData, ine: e.target.value.replace(/\D/g, '').slice(0, 16)})} 
            />
            <TextField 
              label="Nombre Completo *" 
              required 
              fullWidth 
              size="small" 
              value={formData.nombre} 
              onChange={(e) => setFormData({...formData, nombre: e.target.value})} 
            />
            <TextField 
              label="Teléfono 1 *" 
              required 
              fullWidth 
              size="small" 
              inputProps={{ maxLength: 10 }}
              value={formData.telefono1} 
              onChange={(e) => setFormData({
                ...formData, 
                telefono1: e.target.value.replace(/\D/g, '').slice(0, 10)
              })} 
            />
            <TextField 
              label="Teléfono 2" 
              fullWidth 
              size="small" 
              inputProps={{ maxLength: 10 }}
              value={formData.telefono2} 
              onChange={(e) => setFormData({
                ...formData, 
                telefono2: e.target.value.replace(/\D/g, '').slice(0, 10)
              })} 
            />
            <TextField 
              label="Correo Electrónico *" 
              type="email" 
              required 
              fullWidth 
              size="small" 
              value={formData.correo} 
              onChange={(e) => setFormData({...formData, correo: e.target.value})} 
            />
          </Stack>
        );
      case 1:
        return (
          <Stack spacing={3} sx={{ mt: 2 }}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2, color: '#1e293b', display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocalOffer color="primary" /> Selecciona el Paquete *
              </Typography>
              <SeleccionPlanes planSeleccionado={formData.plan} onPlanSeleccionado={handleSeleccionarPlan} />
              {errorPlan && (<Alert severity="error" sx={{ mt: 2 }}>Debes seleccionar un paquete comercial.</Alert>)}
            </Box>
            <Divider sx={{ my: 2 }} />
            <FormControl component="fieldset">
              <FormLabel component="legend" sx={{ fontWeight: 600, mb: 1, color: '#1e293b' }}>Método de Ubicación *</FormLabel>
              <RadioGroup value={metodoUbicacion} onChange={(e) => setMetodoUbicacion(e.target.value)}>
                <FormControlLabel value="manual" control={<Radio />} label="1. Dirección Manual" />
                <FormControlLabel value="gps" control={<Radio />} label="2. GPS en Tiempo Real" />
                <FormControlLabel value="link" control={<Radio />} label="3. Link por WhatsApp" />
                <FormControlLabel value="mapa" control={<Radio />} label="4. Fijar Pin en el Mapa" />
              </RadioGroup>
            </FormControl>
            <Box sx={{ p: 2, backgroundColor: '#f8fafc', borderRadius: 2, border: '1px solid #e2e8f0' }}>
              {metodoUbicacion === 'manual' && (
                <TextField 
                  label="Dirección (Calle y Número) *" 
                  required 
                  error={errorDireccion} 
                  helperText={errorDireccion ? "Requerido" : ""} 
                  fullWidth 
                  size="small" 
                  value={formData.calleNumero} 
                  onChange={(e) => setFormData({...formData, calleNumero: e.target.value})} 
                  sx={{ mb: 2 }} 
                />
              )}
              {metodoUbicacion === 'gps' && (
                <Box sx={{ textAlign: 'center', py: 2, mb: 2 }}>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    startIcon={loadingGps ? <CircularProgress size={20} color="inherit" /> : <MyLocation />} 
                    onClick={obtenerUbicacionGPS} 
                    disabled={loadingGps} 
                    sx={{ mb: 2 }}
                  >
                    {loadingGps ? 'Calculando...' : 'Obtener Ubicación'}
                  </Button>
                  {coordenadas && <Alert severity="success" icon={<CheckCircle />}>Coordenadas: <strong>{coordenadas}</strong></Alert>}
                </Box>
              )}
              {metodoUbicacion === 'link' && (
                <Box sx={{ textAlign: 'center', py: 2, mb: 2 }}>
                  <Typography variant="body2" sx={{ mb: 2, color: '#64748b' }}>Envía este link al cliente.</Typography>
                  <TextField 
                    fullWidth 
                    size="small" 
                    value="https://solitsystem.app/loc/req-98x7" 
                    InputProps={{ 
                      readOnly: true, 
                      endAdornment: (
                        <InputAdornment position="end">
                          <Tooltip title={linkCopiado ? "¡Copiado!" : "Copiar"}>
                            <IconButton onClick={copiarLinkCliente} color={linkCopiado ? "success" : "default"}>
                              {linkCopiado ? <CheckCircle /> : <ContentCopy />}
                            </IconButton>
                          </Tooltip>
                        </InputAdornment>
                      ) 
                    }} 
                  />
                  <Button variant="outlined" color="success" startIcon={<WhatsApp />} sx={{ mt: 2 }}>Enviar por WhatsApp</Button>
                </Box>
              )}
              {metodoUbicacion === 'mapa' && (
                <Box sx={{ textAlign: 'center', py: 1, mb: 2 }}>
                  <Typography variant="body2" sx={{ mb: 2, color: '#64748b' }}>Haz clic en el mapa.</Typography>
                  <Box 
                    onClick={handleMapClick} 
                    sx={{ 
                      width: '100%', 
                      height: 250, 
                      backgroundColor: '#e2e8f0', 
                      borderRadius: 2, 
                      position: 'relative', 
                      overflow: 'hidden', 
                      cursor: 'crosshair' 
                    }}
                  >
                    {!mapPin && (
                      <Typography variant="caption" sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: '#64748b' }}>
                        Clic para fijar Pin
                      </Typography>
                    )}
                    {mapPin && (
                      <PinDrop 
                        color="error" 
                        sx={{ 
                          position: 'absolute', 
                          top: mapPin.y - 24, 
                          left: mapPin.x - 12, 
                          fontSize: 30 
                        }} 
                      />
                    )}
                  </Box>
                  {coordenadas && <Alert severity="success" sx={{ mt: 2 }}>Pin: <strong>{coordenadas}</strong></Alert>}
                </Box>
              )}
              <Divider sx={{ my: 3 }} />
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: '#334155' }}>Detalles Adicionales</Typography>
              <Stack spacing={3}>
                <TextField 
                  label="Referencias" 
                  multiline 
                  rows={2} 
                  fullWidth 
                  size="small" 
                  value={formData.referencias} 
                  onChange={(e) => setFormData({...formData, referencias: e.target.value})} 
                />
                <TextField 
                  label="Detalles de Fachada" 
                  multiline 
                  rows={2} 
                  fullWidth 
                  size="small" 
                  value={formData.detallesCasa} 
                  onChange={(e) => setFormData({...formData, detallesCasa: e.target.value})} 
                />
              </Stack>
            </Box>
          </Stack>
        );
      case 2:
        const totales = calcularTotales();
        return (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>Evidencias</Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3 }}>
              <Button variant="outlined" color="primary" component="label" startIcon={<AddPhotoAlternate />} fullWidth>
                Foto Frente INE
                <input type="file" hidden accept="image/*" capture="environment" />
              </Button>
              <Button variant="outlined" color="primary" component="label" startIcon={<AddPhotoAlternate />} fullWidth>
                Foto Reverso INE
                <input type="file" hidden accept="image/*" capture="environment" />
              </Button>
            </Stack>
            <Paper variant="outlined" sx={{ p: 2, bgcolor: '#f8fafc', mb: 3, borderRadius: 2 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>Desglose de Cobros</Typography>
              {formData.plan && (
                <Box sx={{ mb: 2, p: 1.5, backgroundColor: '#e3f2fd', borderRadius: 1, borderLeft: '3px solid #2196F3' }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#1565c0' }}>
                    Plan: <strong>{formData.plan.nombre}</strong>
                  </Typography>
                </Box>
              )}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="body2">Instalación:</Typography>
                <Typography variant="body2">${totales.instalacion.toFixed(2)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Primer mes:</Typography>
                <Typography variant="body2">${totales.primerMes.toFixed(2)}</Typography>
              </Box>
              <Divider sx={{ mb: 1 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Total:</Typography>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#16a34a' }}>
                  ${totales.total.toFixed(2)}
                </Typography>
              </Box>
            </Paper>
            <Alert severity="info" icon={<InfoOutlined />} sx={{ mb: 3 }}>
              Tiempo estimado: <strong>3 a 5 días hábiles</strong>.
            </Alert>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>Firma del Cliente *</Typography>
            <Box sx={{ backgroundColor: '#fff', border: '2px dashed #cbd5e1', borderRadius: 2, height: 200, touchAction: 'none' }}>
              <canvas 
                ref={canvasRef} 
                width={800} 
                height={200} 
                onMouseDown={startDrawing} 
                onMouseMove={draw} 
                onMouseUp={stopDrawing} 
                onMouseLeave={stopDrawing} 
                onTouchStart={startDrawing} 
                onTouchMove={draw} 
                onTouchEnd={stopDrawing} 
                style={{ width: '100%', height: '100%', cursor: 'crosshair' }} 
              />
            </Box>
            <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
              <Button size="small" onClick={limpiarFirma} color="error">Limpiar Firma</Button>
              <Button size="small" onClick={() => window.print()} color="secondary">Generar PDF</Button>
            </Stack>
          </Box>
        );
      default: 
        return 'Desconocido';
    }
  };

  return (
    <Box sx={{ maxWidth: 900, margin: 'auto', p: 1 }}>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>Contrato y Firma</Typography>
      <Paper variant="outlined" sx={{ p: 4, borderRadius: 3 }}>
        <Stepper activeStep={activeStep} orientation="vertical">
          {pasosContrato.map((paso, index) => (
            <Step key={paso.label}>
              <StepLabel>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  {paso.label}
                </Typography>
              </StepLabel>
              <StepContent>
                {renderStepContent(index)}
                <Box sx={{ mt: 3 }}>
                  <Button 
                    variant="contained" 
                    onClick={index === 2 ? handleSubmit : handleNext}
                    disabled={loadingContrato}
                  >
                    {loadingContrato ? <CircularProgress size={20} color="inherit" /> : (index === 2 ? 'Finalizar' : 'Siguiente')}
                  </Button>
                  <Button disabled={index === 0} onClick={handleBack} sx={{ ml: 1 }}>Atrás</Button>
                </Box>
              </StepContent>
            </Step>
          ))}
        </Stepper>
        
        {errorApi && (
          <Alert severity="error" sx={{ mt: 2, whiteSpace: 'pre-line' }}>
            {errorApi}
          </Alert>
        )}
        
        {guardado && !errorApi && (
          <Alert severity="success" sx={{ mt: 2 }}>
            ✅ Contrato guardado exitosamente. Aparecerá en Agenda de Instalaciones.
          </Alert>
        )}
      </Paper>
    </Box>
  );
};

export default PlanAndQuotation;