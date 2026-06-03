import React, { useState, useRef } from 'react';
import {
    Box, Card, CardContent, Typography, Switch, FormControlLabel,
    Stack, Button, Alert, Chip, Divider, TextField, Grid,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton
} from '@mui/material';
import {
    PhotoCamera, CheckCircle, BorderColor, AssignmentOutlined,
    ConstructionOutlined, ArrowBackOutlined, BuildOutlined, CalendarMonthOutlined
} from '@mui/icons-material';

const TecnicoEjecucion = () => {
    // ('tabla' o 'formulario')
    const [vistaActual, setVistaActual] = useState('tabla');

    const [instalacionesSemana, setInstalacionesSemana] = useState([
        { tipoDeServicio: 'Instalacion de Fibra Optica', cliente: 'Juan Pérez García', direccion: 'Av. Reforma 402, Centro', colonia: 'Reforma', fecha: '20-03-2023', estatus: 'Pendiente', entre: '21 norte y 23 norte', telefono: '5512345678' },
        { tipoDeServicio: 'Cambio de Modem', cliente: 'María Elena Solís', direccion: 'Calle 5 Poniente 12, Las Palmas', colonia: 'Las Palmas', fecha: '21-03-2023', estatus: 'Pendiente', entre: '5 oriente y 7 oriente', telefono: '5598765432' },
        { tipoDeServicio: 'Reparacion de Cableado', cliente: 'Roberto Gómez Díaz', direccion: 'Privada Juárez 14, San José', colonia: 'San José', fecha: '29-03-2023', estatus: 'Pendiente', entre: 'entre 2 norte y 4 norte', telefono: '5544332211' }
    ]);

    const [ordenActiva, setOrdenActiva] = useState(null);

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

    const handleIniciarTrabajo = (orden) => {
        setOrdenActiva(orden);
        setCompletado(false);
        setFotoEvidencia(false);
        setTieneFirma(false);
        setChecklist({ verificarEquipos: false, tendidoCable: false, configONT: false });
        setDatosTecnicos({ serialOnt: '', serialRouter: '', metrajeFibra: '', potenciaDbm: '', tipoInstalacion: 'aerea', conectoresUtilizados: '2' });
        setVistaActual('formulario');
    };

    const handleFinalizarOrdenOrden = () => {
        setInstalacionesSemana(instalacionesSemana.map(inst =>
            inst.tipoDeServicio === ordenActiva.tipoDeServicio ? { ...inst, estatus: 'Completado' } : inst
        ));
        setCompletado(true);
        setTimeout(() => {
            setVistaActual('tabla');
        }, 2000);
    };

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
        <Box sx={{ width: '100%', p: 1 }}>

            {/* =========================================================
          VISTA 1: TABLA DE INSTALACIONES PENDIENTES DE LA SEMANA
          ========================================================= */}
            {vistaActual === 'tabla' && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <Box>
                        <Typography variant="h5" sx={{ fontWeight: 700, color: '#1e293b', display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CalendarMonthOutlined color="primary" /> Mis Instalaciones de la Semana
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Agenda semanal asignada. Selecciona una orden de servicio para acudir al domicilio y realizar la instalación.
                        </Typography>
                    </Box>

                    <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2, overflowX: 'auto' }}>
                        <Table>
                            <TableHead sx={{ backgroundColor: '#f8fafc' }}>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 600 }}>Tipo de Servicio</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>Cliente</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>Dirección de Servicio</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>Colonia</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>Agenda programada</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>Estatus</TableCell>
                                    <TableCell align="center" sx={{ fontWeight: 600 }}>Acción</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {instalacionesSemana.map((row) => (
                                    <TableRow key={row.tipoDeServicio} hover>
                                        <TableCell sx={{ fontWeight: 700, color: '#1d4ed8' }}>{row.tipoDeServicio}</TableCell>
                                        <TableCell sx={{ fontWeight: 600 }}>{row.cliente}</TableCell>
                                        <TableCell>{row.direccion}</TableCell>
                                        <TableCell><Chip label={row.colonia} size="small" variant="outlined" color="primary" /></TableCell>
                                        <TableCell sx={{ color: '#475569', fontWeight: 500 }}>{row.fecha}</TableCell>
                                        <TableCell>
                                            <Chip
                                                label={row.estatus}
                                                color={row.estatus === 'Completado' ? 'success' : 'warning'}
                                                size="small"
                                                sx={{ fontWeight: 600 }}
                                            />
                                        </TableCell>
                                        <TableCell align="center">
                                            <Button
                                                variant="contained"
                                                size="small"
                                                startIcon={<BuildOutlined />}
                                                disabled={row.estatus === 'Completado'}
                                                onClick={() => handleIniciarTrabajo(row)}
                                                sx={{ textTransform: 'none', borderRadius: 1.5 }}
                                            >
                                                Iniciar Trabajo
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            )}

            {/* =========================================================
            VISTA 2: FORMULARIO DIGITAL DE LA ORDEN DE SERVICIO
            ========================================================= */}
            {vistaActual === 'formulario' && ordenActiva && (
                <Box sx={{ maxWidth: 700, margin: 'auto' }}>
                    <Button
                        startIcon={<ArrowBackOutlined />}
                        onClick={() => setVistaActual('tabla')}
                        sx={{ mb: 2, textTransform: 'none' }}
                    >
                        Volver a la Agenda Semanal
                    </Button>

                    {completado ? (
                        <Alert severity="success" sx={{ borderRadius: 2, p: 2 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>¡Instalación Finalizada con Éxito!</Typography>
                            Los datos e inventario se han sincronizado correctamente en la mesa de control central.
                        </Alert>
                    ) : (
                        <Card variant="outlined" sx={{ borderRadius: 3 }}>
                            <CardContent sx={{ p: { xs: 2.5, sm: 4 } }}>

                                {/* PARTE SUPERIOR FORMULARIO FÍSICO */}
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                    <AssignmentOutlined color="primary" />
                                    <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1e293b' }}>
                                        Orden de Servicio Digitalizada
                                    </Typography>
                                </Box>

                                <Stack spacing={2.5} sx={{ backgroundColor: '#f8fafc', p: 2.5, borderRadius: 2, border: '1px solid #e2e8f0', mb: 4 }}>
                                    <TextField label="Tipo de Servicio" variant="outlined" fullWidth size="small" value={ordenActiva.tipoDeServicio} InputProps={{ readOnly: true }} />
                                    <TextField label="Fecha" variant="outlined" fullWidth size="small" value={ordenActiva.fecha} InputProps={{ readOnly: true }} />
                                    <TextField label="Nombre Completo del Cliente" variant="outlined" fullWidth size="small" value={ordenActiva.cliente} InputProps={{ readOnly: true }} />
                                    <TextField label="Teléfono de Contacto" variant="outlined" fullWidth size="small" value={ordenActiva.telefono} InputProps={{ readOnly: true }} />
                                    <TextField label="Dirección" variant="outlined" fullWidth size="small" multiline rows={2} value={ordenActiva.direccion} InputProps={{ readOnly: true }} />
                                    <TextField label="Colonia" variant="outlined" fullWidth size="small" value={ordenActiva.colonia} InputProps={{ readOnly: true }} />
                                    <TextField label="Entre Calles" variant="outlined" fullWidth size="small" value={ordenActiva.entre} InputProps={{ readOnly: true }} />
                                </Stack>

                                {/* CHECKLIST */}
                                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#475569', mb: 2 }}>Protocolo Técnico Obligatorio</Typography>
                                <Stack spacing={1.5} sx={{ mb: 3 }}>
                                    <FormControlLabel control={<Switch checked={checklist.verificarEquipos} onChange={handleToggle} name="verificarEquipos" color="secondary" />} label="1. Validación y desempaque de equipos ONT/Router" />
                                    <FormControlLabel control={<Switch checked={checklist.tendidoCable} onChange={handleToggle} name="tendidoCable" color="secondary" />} label="2. Tendido e instalación de Cable de Fibra Óptica" />
                                    <FormControlLabel control={<Switch checked={checklist.configONT} onChange={handleToggle} name="configONT" color="secondary" />} label="3. Configuración, fusión y pruebas de potencia de internet" />
                                </Stack>

                                {/* FOTO */}
                                <Box sx={{ mb: 3.5 }}>
                                    <Button variant={fotoEvidencia ? "contained" : "outlined"} color={fotoEvidencia ? "success" : "primary"} component="label" startIcon={fotoEvidencia ? <CheckCircle /> : <PhotoCamera />} fullWidth sx={{ py: 1.5, textTransform: 'none' }}>
                                        {fotoEvidencia ? "Evidencia Fotográfica Guardada" : "Capturar Evidencia de Instalación (ONT / Fachada)"}
                                        <input type="file" hidden accept="image/*" capture="environment" onChange={() => setFotoEvidencia(true)} />
                                    </Button>
                                </Box>

                                <Divider sx={{ my: 2.5 }} />

                                {/* FIRMA */}
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
                                    onClick={handleFinalizarOrdenOrden}
                                    startIcon={<CheckCircle />}
                                    sx={{ textTransform: 'none', py: 1.5, fontWeight: 700, fontSize: '1.05rem' }}
                                >
                                    Cerrar Orden de Servicio Digital
                                </Button>

                            </CardContent>
                        </Card>
                    )}
                </Box>
            )}
        </Box>
    );
};

export default TecnicoEjecucion;