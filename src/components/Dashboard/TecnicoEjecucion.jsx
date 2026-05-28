import React, { useState, useRef } from 'react';
import {
    Box, Card, CardContent, Typography, Switch, FormControlLabel,
    Stack, Button, Alert, Chip, Divider
} from '@mui/material';
import { PhotoCamera, CheckCircle, BorderColor } from '@mui/icons-material';

const TecnicoEjecucion = () => {
    const [checklist, setChecklist] = useState({
        verificarEquipos: false,
        tendidoCable: false,
        configONT: false,
    });

    const [completado, setCompletado] = useState(false);
    const [fotoEvidencia, setFotoEvidencia] = useState(false);
    const [tieneFirma, setTieneFirma] = useState(false);

    // --- LÓGICA DE FIRMA DIGITAL ---
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

    // Se habilita "Cerrar Orden" solo si el checklist está listo, hay foto y el cliente firmó.
    const isComplete = checklist.verificarEquipos && checklist.tendidoCable && checklist.configONT && fotoEvidencia && tieneFirma;

    return (
        <Box sx={{ maxWidth: 700, margin: 'auto' }}>
            <Box sx={{ mb: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 700, color: '#1e293b' }}>Módulo de Trabajo de Campo Técnico</Typography>
                <Typography variant="body2" color="text.secondary">Ejecuta las instalaciones activas asignadas a tu ruta del día.</Typography>
            </Box>

            {completado ? (
                <Alert severity="success" sx={{ borderRadius: 2 }}>
                    ¡Instalación marcada como finalizada! El reporte, imágenes y firma de conformidad se subieron al servidor de Solit System.
                    <Button variant="outlined" sx={{ mt: 2, display: 'block' }} onClick={() => window.location.reload()}>
                        Abrir Siguiente Orden
                    </Button>
                </Alert>
            ) : (
                <Card variant="outlined" sx={{ borderRadius: 3 }}>
                    <CardContent sx={{ p: 4 }}>
                        <Box sx={{ mb: 2 }}>
                            <Chip label="Orden de Servicio Activa" color="primary" size="small" sx={{ fontWeight: 600, mb: 1 }} />
                            <Typography variant="h6" sx={{ fontWeight: 700 }}>Juan Pérez García</Typography>
                            <Typography variant="body2" color="text.secondary">Dirección: Av. Reforma 402, Centro</Typography>
                            <Typography variant="body2" color="text.secondary">Paquete: Internet Familiar 50MB</Typography>
                        </Box>

                        <Divider sx={{ my: 2.5 }} />

                        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#475569', mb: 2 }}>Protocolo Técnico Obligatorio</Typography>
                        <Stack spacing={1.5}>
                            <FormControlLabel control={<Switch checked={checklist.verificarEquipos} onChange={handleToggle} name="verificarEquipos" color="secondary" />} label="1. Validación y desempaque de equipos ONT/Router" />
                            <FormControlLabel control={<Switch checked={checklist.tendidoCable} onChange={handleToggle} name="tendidoCable" color="secondary" />} label="2. Tendido e instalación de Cable de Fibra Óptica" />
                            <FormControlLabel control={<Switch checked={checklist.configONT} onChange={handleToggle} name="configONT" color="secondary" />} label="3. Configuración, fusión y pruebas de potencia de internet" />
                        </Stack>

                        <Box sx={{ mt: 3, mb: 3 }}>
                            <Button variant={fotoEvidencia ? "contained" : "outlined"} color={fotoEvidencia ? "success" : "primary"} component="label" startIcon={fotoEvidencia ? <CheckCircle /> : <PhotoCamera />} fullWidth sx={{ py: 1.5 }}>
                                {fotoEvidencia ? "Evidencia Guardada (Ver)" : "Activar Cámara: Capturar Evidencia (ONT/Fachada)"}
                                {/* Este input abre la cámara trasera del dispositivo móvil automáticamente */}
                                <input type="file" hidden accept="image/*" capture="environment" onChange={() => setFotoEvidencia(true)} />
                            </Button>
                        </Box>

                        <Divider sx={{ my: 2.5 }} />

                        {/* FIRMA DEL CLIENTE PARA EL TÉCNICO */}
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <BorderColor sx={{ fontSize: 18 }} /> 4. Firma de Conformidad (El cliente valida que navega correctamente)
                        </Typography>
                        <Box sx={{ backgroundColor: '#f8fafc', border: '2px dashed #cbd5e1', borderRadius: 2, height: 150, touchAction: 'none', mb: 1 }}>
                            <canvas ref={canvasRef} width={800} height={150} onMouseDown={startDrawing} onMouseMove={draw} onMouseUp={stopDrawing} onMouseLeave={stopDrawing} onTouchStart={startDrawing} onTouchMove={draw} onTouchEnd={stopDrawing} style={{ width: '100%', height: '100%', cursor: 'crosshair' }} />
                        </Box>
                        <Button size="small" onClick={limpiarFirma} color="error" sx={{ mb: 3 }}>Borrar Firma</Button>

                        <Button variant="contained" fullWidth color="success" disabled={!isComplete} onClick={() => setCompletado(true)} startIcon={<CheckCircle />} sx={{ textTransform: 'none', py: 1.5, fontWeight: 700, fontSize: '1.05rem' }}>
                            Cerrar Orden e Informar Éxito
                        </Button>
                    </CardContent>
                </Card>
            )}
        </Box>
    );
};
export default TecnicoEjecucion;