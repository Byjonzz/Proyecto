import React, { useState, useRef } from 'react';
import {
    Box, Card, CardContent, Typography, Switch, FormControlLabel,
    Stack, Button, Alert, Chip, Divider, TextField
} from '@mui/material';
import { PhotoCamera, CheckCircle, BorderColor, AssignmentOutlined } from '@mui/icons-material';

const TecnicoEjecucion = () => {
    // Estado para controlar los campos de la Orden de Servicio Digital
    const [datosOrden, setDatosOrden] = useState({
        tipoDeServicio: 'instalacion de Fibra Optica',
        fecha: '2026-05-29',
        nombreCliente: 'Juan Pérez García',
        direccion: 'Av. Reforma 402, Colonia Centro',
        telefono: '5512345678',
        Colonia: 'Poblado el Riego',
        entre: 'Priv. houston y C. 16 Sur'
    });

    // Estado para el checklist obligatorio
    const [checklist, setChecklist] = useState({
        verificarEquipos: false,
        tendidoCable: false,
        configONT: false,
    });

    const [completado, setCompletado] = useState(false);
    const [fotoEvidencia, setFotoEvidencia] = useState(false);
    const [tieneFirma, setTieneFirma] = useState(false);

    // Lógica del lienzo (Canvas) para la firma digital en móviles
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

    // Validación para habilitar el cierre de la orden
    const isComplete = checklist.verificarEquipos && checklist.tendidoCable && checklist.configONT && fotoEvidencia && tieneFirma;

    return (
        <Box sx={{ maxWidth: 700, margin: 'auto', p: 1 }}>
            <Box sx={{ mb: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 700, color: '#1e293b' }}>
                    Módulo de Trabajo de Campo Técnico
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Digitalización de órdenes de servicio físicas y checklist de instalación.
                </Typography>
            </Box>

            {completado ? (
                <Alert severity="success" sx={{ borderRadius: 2, p: 2 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>¡Instalación Finalizada con Éxito!</Typography>
                    Los datos del reporte, la evidencia fotográfica y la firma de conformidad del cliente se han sincronizado en Solit System.
                    <Button variant="outlined" sx={{ mt: 2, display: 'block' }} onClick={() => window.location.reload()}>
                        Cargar Siguiente Orden Asignada
                    </Button>
                </Alert>
            ) : (
                <Card variant="outlined" sx={{ borderRadius: 3 }}>
                    <CardContent sx={{ p: { xs: 2.5, sm: 4 } }}>

                        {/* =========================================================
                BLOQUE DIGITALIZADO: CUADRO SUPERIOR DE ORDEN DE SERVICIO 
                ========================================================= */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                            <AssignmentOutlined color="primary" />
                            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1e293b' }}>
                                Datos de la Orden de Servicio
                            </Typography>
                        </Box>

                        {/* Diseño en Lista Vertical Fluida para Teléfonos */}
                        <Stack spacing={2.5} sx={{ backgroundColor: '#f8fafc', p: 2.5, borderRadius: 2, border: '1px solid #e2e8f0' }}>
                            <TextField
                                label="Tipo de Servicio:"
                                variant="outlined"
                                fullWidth
                                size="small"
                                value={datosOrden.tipoDeServicio}
                                onChange={(e) => setDatosOrden({ ...datosOrden, tipoDeServicio: e.target.value })}
                            />
                            <TextField
                                label="Fecha de Instalación"
                                type="date"
                                variant="outlined"
                                fullWidth
                                size="small"
                                InputLabelProps={{ shrink: true }}
                                value={datosOrden.fecha}
                                onChange={(e) => setDatosOrden({ ...datosOrden, fecha: e.target.value })}
                            />
                            <TextField
                                label="Nombre Completo del Cliente:"
                                variant="outlined"
                                fullWidth
                                size="small"
                                value={datosOrden.nombreCliente}
                                onChange={(e) => setDatosOrden({ ...datosOrden, nombreCliente: e.target.value })}
                            />
                            <TextField
                                label="Teléfono de Contacto:"
                                variant="outlined"
                                fullWidth
                                size="small"
                                value={datosOrden.telefono}
                                onChange={(e) => setDatosOrden({ ...datosOrden, telefono: e.target.value })}
                            />
                            <TextField
                                label="Dirección:"
                                variant="outlined"
                                fullWidth
                                size="small"
                                multiline
                                rows={2}
                                value={datosOrden.direccion}
                                onChange={(e) => setDatosOrden({ ...datosOrden, direccion: e.target.value })}
                            />
                            <TextField
                                label="Colonia:"
                                variant="outlined"
                                fullWidth
                                size="small"
                                value={datosOrden.Colonia}
                                onChange={(e) => setDatosOrden({ ...datosOrden, Colonia: e.target.value })}
                            />
                            <TextField
                                    label="Entre:"
                                    variant="outlined"
                                    fullWidth
                                    size="small"
                                    value={datosOrden.entre}
                                    onChange={(e) => setDatosOrden({ ...datosOrden, entre: e.target.value })}
                                />
                        </Stack>

                        <Divider sx={{ my: 3.5 }} />

                        {/* PROTOCOLO TÉCNICO */}
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#475569', mb: 2 }}>
                            Protocolo Técnico Obligatorio
                        </Typography>
                        <Stack spacing={1.5}>
                            <FormControlLabel control={<Switch checked={checklist.verificarEquipos} onChange={handleToggle} name="verificarEquipos" color="secondary" />} label="1. Validación y desempaque de equipos ONT/Router" />
                            <FormControlLabel control={<Switch checked={checklist.tendidoCable} onChange={handleToggle} name="tendidoCable" color="secondary" />} label="2. Tendido e instalación de Cable de Fibra Óptica" />
                            <FormControlLabel control={<Switch checked={checklist.configONT} onChange={handleToggle} name="configONT" color="secondary" />} label="3. Configuración, fusión y pruebas de potencia de internet" />
                        </Stack>

                        {/* CAPTURA FOTOGRÁFICA */}
                        <Box sx={{ mt: 3, mb: 3.5 }}>
                            <Button variant={fotoEvidencia ? "contained" : "outlined"} color={fotoEvidencia ? "success" : "primary"} component="label" startIcon={fotoEvidencia ? <CheckCircle /> : <PhotoCamera />} fullWidth sx={{ py: 1.5, textTransform: 'none' }}>
                                {fotoEvidencia ? "Evidencia Fotográfica Guardada" : "Capturar Evidencia de Instalación (ONT / Fachada)"}
                                <input type="file" hidden accept="image/*" capture="environment" onChange={() => setFotoEvidencia(true)} />
                            </Button>
                        </Box>

                        <Divider sx={{ my: 2.5 }} />

                        {/* FIRMA DE CONFORMIDAD */}
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <BorderColor sx={{ fontSize: 18 }} /> 4. Firma Digital de Conformidad del Cliente
                        </Typography>
                        <Box sx={{ backgroundColor: '#f8fafc', border: '2px dashed #cbd5e1', borderRadius: 2, height: 160, touchAction: 'none', mb: 1 }}>
                            <canvas ref={canvasRef} width={800} height={160} onMouseDown={startDrawing} onMouseMove={draw} onMouseUp={stopDrawing} onMouseLeave={stopDrawing} onTouchStart={startDrawing} onTouchMove={draw} onTouchEnd={stopDrawing} style={{ width: '100%', height: '100%', cursor: 'crosshair' }} />
                        </Box>
                        <Button size="small" onClick={limpiarFirma} color="error" sx={{ mb: 4 }}>Borrar Firma</Button>

                        {/* BOTÓN DE CIERRE DE ORDEN */}
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