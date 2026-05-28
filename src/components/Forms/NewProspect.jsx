import React, { useState } from 'react';
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Button,
  Paper,
  Typography,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  InputAdornment,
  IconButton,
  Tooltip,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  MyLocation,
  ContentCopy,
  CheckCircle,
  WhatsApp
} from '@mui/icons-material';

const pasos = [
  { label: 'Información Básica del Prospecto', description: 'Registra los datos de contacto iniciales.' },
  { label: 'Captura de Ubicación', description: 'Selecciona cómo registrarás las coordenadas del domicilio.' },
  { label: 'Interés y Cotización', description: 'Define qué servicio o paquete le interesa.' },
  { label: 'Resumen y Cierre', description: 'Confirma los datos para enviarlos al sistema.' }
];

const NewProspect = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = useState(new Set());

  // Estados para el Paso 2 (Ubicación)
  const [metodoUbicacion, setMetodoUbicacion] = useState('manual');
  const [loadingGps, setLoadingGps] = useState(false);
  const [coordenadas, setCoordenadas] = useState('');
  const [linkCopiado, setLinkCopiado] = useState(false);

  // --- LÓGICA DEL STEPPER ---
  const isStepOptional = (step) => step === 1; // El paso 2 (índice 1) es opcional
  const isStepSkipped = (step) => skipped.has(step);

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      throw new Error("No puedes saltar un paso que no es opcional.");
    }
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
  };

  // --- LÓGICA DE UBICACIÓN (PASO 2) ---
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
        { enableHighAccuracy: true } // Pide la mayor precisión posible
      );
    } else {
      alert("Tu navegador no soporta geolocalización.");
      setLoadingGps(false);
    }
  };

  const copiarLinkCliente = () => {
    // Simulamos un link único para este prospecto
    const link = "https://solitsystem.app/loc/req-98x7";
    navigator.clipboard.writeText(link);
    setLinkCopiado(true);
    setTimeout(() => setLinkCopiado(false), 3000);
  };

  // --- RENDERIZADO DEL CONTENIDO DE CADA PASO ---
  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField label="Nombre Completo" variant="outlined" fullWidth size="small" />
            <TextField label="Teléfono (WhatsApp)" variant="outlined" fullWidth size="small" />
          </Box>
        );
      case 1:
        return (
          <Box sx={{ mt: 2 }}>
            <FormControl component="fieldset">
              <FormLabel component="legend" sx={{ mb: 1, fontWeight: 600 }}>Método de Registro de Domicilio</FormLabel>
              <RadioGroup
                value={metodoUbicacion}
                onChange={(e) => setMetodoUbicacion(e.target.value)}
              >
                <FormControlLabel value="manual" control={<Radio />} label="1. Llenado de formulario (Tengo la dirección)" />
                <FormControlLabel value="gps" control={<Radio />} label="2. Guardar ubicación exacta en tiempo real (Estoy en el sitio)" />
                <FormControlLabel value="link" control={<Radio />} label="3. Enviar link al cliente (Para que él mande su ubicación)" />
              </RadioGroup>
            </FormControl>

            <Box sx={{ mt: 3, p: 2, backgroundColor: '#f8fafc', borderRadius: 2, border: '1px solid #e2e8f0' }}>
              {metodoUbicacion === 'manual' && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <TextField label="Calle y Número" fullWidth size="small" />
                  <TextField label="Colonia" fullWidth size="small" />
                  <TextField label="Referencia (Ej. Casa roja frente al parque)" fullWidth size="small" multiline rows={2} />
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
                      Coordenadas capturadas: <strong>{coordenadas}</strong>
                    </Alert>
                  )}
                </Box>
              )}

              {metodoUbicacion === 'link' && (
                <Box sx={{ textAlign: 'center', py: 2 }}>
                  <Typography variant="body2" sx={{ mb: 2, color: '#64748b' }}>
                    Genera un enlace para enviarlo al cliente. Al abrirlo, el sistema nos mandará su ubicación exacta.
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
                    Enviar directo por WhatsApp
                  </Button>
                </Box>
              )}
            </Box>
          </Box>
        );
      case 2:
        return (
          <Box sx={{ mt: 2 }}>
            <TextField label="Paquete de Interés" fullWidth size="small" select SelectProps={{ native: true }}>
              <option value="basico">Internet Básico (20 Megas)</option>
              <option value="familiar">Internet Familiar (50 Megas)</option>
              <option value="gamer">Internet Ultra (100 Megas)</option>
            </TextField>
            <TextField label="Notas del Canvaceador" fullWidth size="small" multiline rows={3} sx={{ mt: 2 }} />
          </Box>
        );
      case 3:
        return (
          <Alert severity="info" sx={{ mt: 2 }}>
            Revisa que los datos sean correctos. Al guardar, este prospecto pasará al Módulo de Ventas para su seguimiento.
          </Alert>
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
            
            // Lógica para marcar el paso como saltado
            if (isStepOptional(index)) {
              labelProps.optional = (
                <Typography variant="caption" color="error">Opcional</Typography>
              );
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
                  
                  {/* Renderiza el formulario según el paso */}
                  {renderStepContent(index)}

                  {/* Botones de Control del Stepper */}
                  <Box sx={{ mb: 2, mt: 3 }}>
                    <div>
                      <Button
                        variant="contained"
                        onClick={handleNext}
                        sx={{ mt: 1, mr: 1, boxShadow: 'none' }}
                      >
                        {index === pasos.length - 1 ? 'Finalizar Registro' : 'Continuar'}
                      </Button>
                      
                      {isStepOptional(index) && (
                        <Button
                          color="inherit"
                          onClick={handleSkip}
                          sx={{ mt: 1, mr: 1 }}
                        >
                          Saltar este paso
                        </Button>
                      )}

                      <Button
                        disabled={index === 0}
                        onClick={handleBack}
                        sx={{ mt: 1, mr: 1 }}
                      >
                        Atrás
                      </Button>
                    </div>
                  </Box>
                </StepContent>
              </Step>
            );
          })}
        </Stepper>

        {/* Pantalla final de éxito */}
        {activeStep === pasos.length && (
          <Paper square elevation={0} sx={{ p: 3, textAlign: 'center', backgroundColor: '#f0fdf4', borderRadius: 2, mt: 2 }}>
            <CheckCircle sx={{ fontSize: 60, color: '#22c55e', mb: 2 }} />
            <Typography variant="h6" sx={{ color: '#166534', fontWeight: 600 }}>
              ¡Prospecto guardado con éxito!
            </Typography>
            <Typography sx={{ mt: 1, mb: 3, color: '#15803d' }}>
              La información ha sido enviada a la base de datos de la ruta.
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