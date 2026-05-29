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
    // Estado para controlar qué vista se muestra ('tabla' o 'formulario')
    const [vistaActual, setVistaActual] = useState('tabla');

    // Lista simulada de instalaciones asignadas al técnico para la semana actual
    const [instalacionesSemana, setInstalacionesSemana] = useState([
        { folio: 'OS-2026-0984', cliente: 'Juan Pérez García', direccion: 'Av. Reforma 402, Centro', paquete: 'Familiar - 50 Megas', fechaHora: 'Hoy - 11:30 AM', estatus: 'Pendiente', cajaNap: 'NAP-CE-04', puerto: '3', telefono: '5512345678' },
        { folio: 'OS-2026-0985', cliente: 'María Elena Solís', direccion: 'Calle 5 Poniente 12, Las Palmas', paquete: 'Ultra Gamer - 100 Megas', fechaHora: 'Mañana - 09:00 AM', estatus: 'Pendiente', cajaNap: 'NAP-LP-01', puerto: '7', telefono: '5598765432' },
        { folio: 'OS-2026-0986', cliente: 'Roberto Gómez Díaz', direccion: 'Privada Juárez 14, San José', paquete: 'Básico - 20 Megas', fechaHora: 'Viernes 29 - 04:30 PM', estatus: 'Pendiente', cajaNap: 'NAP-SJ-02', puerto: '1', telefono: '5544332211' }
    ]);

    // Estado para la orden seleccionada que se va a instalar en el momento
    const [ordenActiva, setOrdenActiva] = useState(null);

    // Estados de control para el formulario técnico
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

    // Canvas para la firma digital
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
        // Marcamos la instalación como completada en nuestra lista local simulada
        setInstalacionesSemana(instalacionesSemana.map(inst =>
            inst.folio === ordenActiva.folio ? { ...inst, estatus: 'Completado' } : inst
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
                                    <TableCell sx={{ fontWeight: 600 }}>Folio</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>Cliente</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>Dirección de Servicio</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>Paquete</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>Agenda programada</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>Estatus</TableCell>
                                    <TableCell align="center" sx={{ fontWeight: 600 }}>Acción</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {instalacionesSemana.map((row) => (
                                    <TableRow key={row.folio} hover>
                                        <TableCell sx={{ fontWeight: 700, color: '#1d4ed8' }}>{row.folio}</TableCell>
                                        <TableCell sx={{ fontWeight: 600 }}>{row.cliente}</TableCell>
                                        <TableCell>{row.direccion}</TableCell>
                                        <TableCell><Chip label={row.paquete} size="small" variant="outlined" color="primary" /></TableCell>
                                        <TableCell sx={{ color: '#475569', fontWeight: 500 }}>{row.fechaHora}</TableCell>
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
                                    <TextField label="No. de Folio / Orden" variant="outlined" fullWidth size="small" value={ordenActiva.folio} InputProps={{ readOnly: true }} />
                                    <TextField label="Agenda de Visita" variant="outlined" fullWidth size="small" value={ordenActiva.fechaHora} InputProps={{ readOnly: true }} />
                                    <TextField label="Nombre Completo del Cliente" variant="outlined" fullWidth size="small" value={ordenActiva.cliente} InputProps={{ readOnly: true }} />
                                    <TextField label="Dirección / Domicilio Completo" variant="outlined" fullWidth size="small" multiline rows={2} value={ordenActiva.direccion} InputProps={{ readOnly: true }} />
                                    <TextField label="Teléfono de Contacto" variant="outlined" fullWidth size="small" value={ordenActiva.telefono} InputProps={{ readOnly: true }} />
                                    <TextField label="Paquete / Servicio Contratado" variant="outlined" fullWidth size="small" value={ordenActiva.paquete} InputProps={{ readOnly: true }} />
                                    <Stack direction="row" spacing={2}>
                                        <TextField label="Caja NAP Asignada" variant="outlined" fullWidth size="small" value={ordenActiva.cajaNap} InputProps={{ readOnly: true }} />
                                        <TextField label="Puerto" variant="outlined" fullWidth size="small" value={ordenActiva.puerto} InputProps={{ readOnly: true }} />
                                    </Stack>
                                </Stack>

                                <Divider sx={{ my: 3 }} />

                                {/* ESPECIFICACIONES TÉCNICAS */}
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                    <ConstructionOutlined color="secondary" />
                                    <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1e293b' }}>
                                        Especificaciones Técnicas e Inventario de Red
                                    </Typography>
                                </Box>

                                <Grid container spacing={2.5} sx={{ mb: 4 }}>
                                    <Grid item xs={12}>
                                        <TextField label="Número de Serie de la ONT / Módem" required fullWidth size="small" placeholder="Ej. SSNK12345678" value={datosTecnicos.serialOnt} onChange={(e) => setDatosTecnicos({ ...datosTecnicos, serialOnt: e.target.value })} />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField label="Número de Serie del Router Adicional (Opcional)" fullWidth size="small" placeholder="Ej. RT-987654321" value={datosTecnicos.serialRouter} onChange={(e) => setDatosTecnicos({ ...datosTecnicos, serialRouter: e.target.value })} />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField label="Fibra Óptica Utilizada (Metros)" required type="number" fullWidth size="small" placeholder="Ej. 120" value={datosTecnicos.metrajeFibra} onChange={(e) => setDatosTecnicos({ ...datosTecnicos, metrajeFibra: e.target.value })} />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField label="Potencia de Señal Medida (dBm)" required fullWidth size="small" placeholder="Ej. -22.5" value={datosTecnicos.potenciaDbm} onChange={(e) => setDatosTecnicos({ ...datosTecnicos, potenciaDbm: e.target.value })} />
                                    </Grid>
                                </Grid>

                                <Divider sx={{ my: 3 }} />

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