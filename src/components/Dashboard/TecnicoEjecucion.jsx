import React, { useState, useRef } from 'react';
import {
    Box, Card, CardContent, Typography, Switch, FormControlLabel,
    Stack, Button, Alert, Chip, Divider, TextField, MenuItem, Grid
} from '@mui/material';
import {
    PhotoCamera, CheckCircle, BorderColor, AssignmentOutlined,
    ConstructionOutlined, RouterOutlined, SpeedOutlined
} from '@mui/icons-material';

const TecnicoEjecucion = () => {
    const [datosOrden, setDatosOrden] = useState({
        folio: 'OS-2026-0984',
        fecha: '2026-05-29',
        nombreCliente: 'Juan Pérez García',
        direccion: 'Av. Reforma 402, Colonia Centro',
        telefono: '5512345678',
        paquete: 'Internet Familiar - 50 Megas',
        cajaNap: 'NAP-CE-04',
        puerto: '3'
    });

    // NUEVO APARTADO: Datos técnicos y materiales del formato físico
    const [datosTecnicos, setDatosTecnicos] = useState({
        serialOnt: '',
        serialRouter: '',
        metrajeFibra: '',
        potenciaDbm: '',
        tipoInstalacion: 'aerea',
        conectoresUtilizados: '2'
    });

    const [checklist, setChecklist] = useState({
        verificarEquipos: false,
        tendidoCable: false,
        configONT: false,
    });

    const [completado, setCompletado] = useState(false);
    const [fotoEvidencia, setFotoEvidencia] = useState(false);
    const [tieneFirma, setTieneFirma] = useState(false);

    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);

    const startDrawing = (e) => {
        const canvas = canvasRef.current; if (!canvas) return;
        const ctx = canvas.getContext('2d');
        ctx.lineWidth = 3; ctx.lineCap = 'round'; ctx.strokeStyle = '#0f172a';
        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left;
        const y = (e.clientY || (e.touches && e.touches[0].clientY)) - rect.top;
        ctx.beginPath(); ctx.moveTo(x, y); setIsDrawing(true); setTieneFirma(true);
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
        setTieneFirma(false);
    };

    const handleToggle = (e) => setChecklist({ ...checklist, [e.target.name]: e.target.checked });

    const isComplete =
        checklist.verificarEquipos &&
        checklist.tendidoCable &&
        checklist.configONT &&
        fotoEvidencia &&
        tieneFirma &&
        datosTecnicos.serialOnt.trim() !== '' &&
        datosTecnicos.metrajeFibra.trim() !== '' &&
        datosTecnicos.potenciaDbm.trim() !== '';

    return (
        <Box sx={{ maxWidth: 700, margin: 'auto', p: 1 }}>
            <Box sx={{ mb: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 700, color: '#1e293b' }}>
                    Módulo de Trabajo de Campo Técnico
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Orden de servicio digital, control de materiales y lectura de potencia.
                </Typography>
            </Box>

            {completado ? (
                <Alert severity="success" sx={{ borderRadius: 2, p: 2 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>¡Instalación Finalizada con Éxito!</Typography>
                    Los datos técnicos, números de serie, evidencias y firma se han sincronizado en Solit System.
                    <Button variant="outlined" sx={{ mt: 2, display: 'block' }} onClick={() => window.location.reload()}>
                        Cargar Siguiente Orden
                    </Button>
                </Alert>
            ) : (
                <Card variant="outlined" sx={{ borderRadius: 3 }}>
                    <CardContent sx={{ p: { xs: 2.5, sm: 4 } }}>

                        {/* SECCIÓN 1: DATOS DEL CLIENTE */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                            <AssignmentOutlined color="primary" />
                            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1e293b' }}>
                                Datos de la Orden de Servicio
                            </Typography>
                        </Box>

                        <Stack spacing={2.5} sx={{ backgroundColor: '#f8fafc', p: 2.5, borderRadius: 2, border: '1px solid #e2e8f0', mb: 4 }}>
                            <TextField label="No. de Folio / Orden" variant="outlined" fullWidth size="small" value={datosOrden.folio} readOnly />
                            <TextField label="Fecha de Instalación" type="date" variant="outlined" fullWidth size="small" InputLabelProps={{ shrink: true }} value={datosOrden.fecha} readOnly />
                            <TextField label="Nombre Completo del Cliente" variant="outlined" fullWidth size="small" value={datosOrden.nombreCliente} readOnly />
                            <TextField label="Dirección / Domicilio Completo" variant="outlined" fullWidth size="small" multiline rows={2} value={datosOrden.direccion} readOnly />
                            <TextField label="Teléfono de Contacto" variant="outlined" fullWidth size="small" value={datosOrden.telefono} readOnly />
                            <TextField label="Paquete / Servicio Contratado" variant="outlined" fullWidth size="small" value={datosOrden.paquete} readOnly />
                            <Stack direction="row" spacing={2}>
                                <TextField label="Caja NAP Asignada" variant="outlined" fullWidth size="small" value={datosOrden.cajaNap} readOnly />
                                <TextField label="Puerto" variant="outlined" fullWidth size="small" value={datosOrden.puerto} readOnly />
                            </Stack>
                        </Stack>

                        <Divider sx={{ my: 3 }} />

                        {/* NUEVA SECCIÓN 2: ESPECIFICACIONES TÉCNICAS Y MATERIALES (IMAGEN 1) */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                            <ConstructionOutlined color="secondary" />
                            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1e293b' }}>
                                Especificaciones Técnicas e Inventario de Red
                            </Typography>
                        </Box>

                        <Grid container spacing={2.5} sx={{ mb: 4 }}>
                            <Grid item xs={12}>
                                <TextField
                                    label="Número de Serie de la ONT / Módem"
                                    required
                                    fullWidth
                                    size="small"
                                    placeholder="Ej. SSNK12345678"
                                    value={datosTecnicos.serialOnt}
                                    onChange={(e) => setDatosTecnicos({ ...datosTecnicos, serialOnt: e.target.value })}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Número de Serie del Router Adicional (Opcional)"
                                    fullWidth
                                    size="small"
                                    placeholder="Ej. RT-987654321"
                                    value={datosTecnicos.serialRouter}
                                    onChange={(e) => setDatosTecnicos({ ...datosTecnicos, serialRouter: e.target.value })}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Fibra Óptica Utilizada (Metros)"
                                    required
                                    type="number"
                                    fullWidth
                                    size="small"
                                    placeholder="Ej. 120"
                                    value={datosTecnicos.metrajeFibra}
                                    onChange={(e) => setDatosTecnicos({ ...datosTecnicos, metrajeFibra: e.target.value })}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Potencia de Señal Medida (dBm)"
                                    required
                                    fullWidth
                                    size="small"
                                    placeholder="Ej. -22.5"
                                    value={datosTecnicos.potenciaDbm}
                                    onChange={(e) => setDatosTecnicos({ ...datosTecnicos, potenciaDbm: e.target.value })}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    select
                                    label="Tipo de Instalación"
                                    fullWidth
                                    size="small"
                                    value={datosTecnicos.tipoInstalacion}
                                    onChange={(e) => setDatosTecnicos({ ...datosTecnicos, tipoInstalacion: e.target.value })}
                                >
                                    <MenuItem value="aerea">Aérea (Postería)</MenuItem>
                                    <MenuItem value="subterranea">Subterránea / Canalizado</MenuItem>
                                </TextField>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Conectores Mecánicos Utilizados"
                                    type="number"
                                    fullWidth
                                    size="small"
                                    value={datosTecnicos.conectoresUtilizados}
                                    onChange={(e) => setDatosTecnicos({ ...datosTecnicos, conectoresUtilizados: e.target.value })}
                                />
                            </Grid>
                        </Grid>

                        <Divider sx={{ my: 3 }} />

                        {/* SECCIÓN 3: PROTOCOLO Y CHECKLIST */}
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#475569', mb: 2 }}>
                            Protocolo Técnico Obligatorio
                        </Typography>
                        <Stack spacing={1.5}>
                            <FormControlLabel control={<Switch checked={checklist.verificarEquipos} onChange={handleToggle} name="verificarEquipos" color="secondary" />} label="1. Validación y desempaque de equipos ONT/Router" />
                            <FormControlLabel control={<Switch checked={checklist.tendidoCable} onChange={handleToggle} name="tendidoCable" color="secondary" />} label="2. Tendido e instalación de Cable de Fibra Óptica" />
                            <FormControlLabel control={<Switch checked={checklist.configONT} onChange={handleToggle} name="configONT" color="secondary" />} label="3. Configuración, fusión y pruebas de potencia de internet" />
                        </Stack>

                        {/* SECCIÓN 4: FOTO EVIDENCIA */}
                        <Box sx={{ mt: 3, mb: 3.5 }}>
                            <Button variant={fotoEvidencia ? "contained" : "outlined"} color={fotoEvidencia ? "success" : "primary"} component="label" startIcon={fotoEvidencia ? <CheckCircle /> : <PhotoCamera />} fullWidth sx={{ py: 1.5, textTransform: 'none' }}>
                                {fotoEvidencia ? "Evidencia Fotográfica Guardada" : "Capturar Evidencia de Instalación (ONT / Fachada)"}
                                <input type="file" hidden accept="image/*" capture="environment" onChange={() => setFotoEvidencia(true)} />
                            </Button>
                        </Box>

                        <Divider sx={{ my: 2.5 }} />

                        {/* SECCIÓN 5: FIRMA */}
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <BorderColor sx={{ fontSize: 18 }} /> 4. Firma Digital de Conformidad del Cliente
                        </Typography>
                        <Box sx={{ backgroundColor: '#f8fafc', border: '2px dashed #cbd5e1', borderRadius: 2, height: 160, touchAction: 'none', mb: 1 }}>
                            <canvas ref={canvasRef} width={800} height={160} onMouseDown={startDrawing} onMouseMove={draw} onMouseUp={stopDrawing} onMouseLeave={stopDrawing} onTouchStart={startDrawing} onTouchMove={draw} onTouchEnd={stopDrawing} style={{ width: '100%', height: '100%', cursor: 'crosshair' }} />
                        </Box>
                        <Button size="small" onClick={limpiarFirma} color="error" sx={{ mb: 4 }}>Borrar Firma</Button>

                        <Button
                            variant="contained"
                            fullWidth
                            color="success"
                            disabled={!isComplete}
                            onClick={() => setCompletado(true)}
                            startIcon={<CheckCircle />}
                            sx={{ textTransform: 'none', py: 1.5, fontWeight: 700, fontSize: '1.05rem' }}
                        >
                            Cerrar Orden de Servicio Digital
                        </Button>

                    </CardContent>
                </Card>
            )}
        </Box>
    );
};

export default TecnicoEjecucion;