import React, { useState } from 'react';
import {
    Box, Card, CardContent, Button, Typography, Grid, Table, TableBody,
    TableCell, TableContainer, TableHead, TableRow, Paper, Chip, IconButton,
    Dialog, DialogTitle, DialogContent, DialogActions, Divider, Stack, Alert
} from '@mui/material';
import {
    PlayArrow, Stop, LocationOn, History, CalendarToday, ChevronRight,
    MyLocation, InfoOutlined, AccountCircle, TrendingUp, AttachMoney, AssignmentTurnedIn
} from '@mui/icons-material';

const CanvaceadorRuta = () => {
    
    const canvaceadorActivo = {
        nombre: 'Jonathan Alexis Alta Bravo',
        ventasSemana: 7,
        paquetes: { basico: 2, familiar: 4, gamer: 1 },
        volumenDinero: 4497, 
        pagoEstimado: 4497, 
        rangoAlcanzado: '100%'
    };

    const [modalInfoPago, setModalInfoPago] = useState(false);
    const [enRuta, setEnRuta] = useState(false);
    const [startTime, setStartTime] = useState(null);

    const puntosRutaHoy = [
        { id: 1, nombre: 'Colonia Centro - Sector A', estado: 'Pendiente' },
        { id: 2, nombre: 'Fraccionamiento Las Palmas', estado: 'Pendiente' },
        { id: 3, nombre: 'Av. Universidad - Negocios', estado: 'Pendiente' }
    ];

    const historialRutas = [
        { fecha: '27/05/2026', zona: 'Zona Alta - San José', prospectos: 12, efectividad: '75%' },
        { fecha: '26/05/2026', zona: 'Colonia El Carmen', prospectos: 8, efectividad: '50%' },
        { fecha: '25/05/2026', zona: 'Barrio de la Soledad', prospectos: 15, efectividad: '90%' }
    ];

    const handleIniciarRuta = () => {
        setEnRuta(true);
        setStartTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };

    const handleTerminarRuta = () => {
        setEnRuta(false);
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>

        
            <Card variant="outlined" sx={{ borderRadius: 3, background: 'linear-gradient(to right, #0f172a, #1e293b)', color: 'white' }}>
                <CardContent sx={{ p: 3 }}>
                    <Grid container spacing={3} alignItems="center">

                        {}
                        <Grid item xs={12} md={4}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <AccountCircle sx={{ fontSize: 50, color: '#3b82f6' }} />
                                <Box>
                                    <Typography variant="body2" sx={{ color: '#94a3b8', fontWeight: 600 }}>Hola de nuevo,</Typography>
                                    <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>{canvaceadorActivo.nombre}</Typography>
                                </Box>
                            </Box>
                        </Grid>

                        {}
                        <Grid item xs={12} md={4}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, borderLeft: { md: '1px solid #334155' }, borderRight: { md: '1px solid #334155' }, px: { md: 3 } }}>
                                <AssignmentTurnedIn sx={{ fontSize: 35, color: '#10b981' }} />
                                <Box>
                                    <Typography variant="body2" sx={{ color: '#94a3b8', fontWeight: 600 }}>Contratos Semanales</Typography>
                                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                        {canvaceadorActivo.ventasSemana} Ventas <Chip label={`Meta ${canvaceadorActivo.rangoAlcanzado}`} size="small" color="success" sx={{ ml: 1, height: 20, fontSize: '0.65rem' }} />
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: '#cbd5e1' }}>
                                        ({canvaceadorActivo.paquetes.basico} Básico, {canvaceadorActivo.paquetes.familiar} Fam, {canvaceadorActivo.paquetes.gamer} Gamer)
                                    </Typography>
                                </Box>
                            </Box>
                        </Grid>

                        {}
                        <Grid item xs={12} md={4}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, pl: { md: 1 } }}>
                                <TrendingUp sx={{ fontSize: 35, color: '#f59e0b' }} />
                                <Box sx={{ flexGrow: 1 }}>
                                    <Typography variant="body2" sx={{ color: '#94a3b8', fontWeight: 600 }}>Pago Calculado Actual</Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Typography variant="h5" sx={{ fontWeight: 800, color: '#10b981' }}>
                                            ${canvaceadorActivo.pagoEstimado.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                        </Typography>
                                        <IconButton size="small" sx={{ color: '#f8fafc', bgcolor: 'rgba(255,255,255,0.1)' }} onClick={() => setModalInfoPago(true)}>
                                            <InfoOutlined fontSize="small" />
                                        </IconButton>
                                    </Box>
                                </Box>
                            </Box>
                        </Grid>

                    </Grid>
                </CardContent>
            </Card>

            {}
            <Card variant="outlined" sx={{ borderRadius: 3, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                <CardContent sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'center' }, gap: 2, p: 3, '&:last-child': { pb: 3 } }}>
                    <Box>
                        <Typography variant="h5" sx={{ fontWeight: 700, color: '#1e293b' }}>
                            Mi Ruta de Canvaceo
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#64748b', mt: 0.5 }}>
                            Inicia tu jornada de campo para trazar la ruta del día e inspeccionar tus metas.
                        </Typography>
                    </Box>

                    {!enRuta ? (
                        <Button variant="contained" color="primary" size="large" startIcon={<PlayArrow />} onClick={handleIniciarRuta} sx={{ borderRadius: 2, fontWeight: 600, textTransform: 'none', px: 3 }}>
                            Iniciar Ruta de Hoy
                        </Button>
                    ) : (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Chip label={`Ruta Activa • Iniciada ${startTime}`} color="success" variant="outlined" sx={{ fontWeight: 600, animation: 'pulse 2s infinite', '@keyframes pulse': { '0%, 100%': { opacity: 1 }, '50%': { opacity: 0.6 } } }} />
                            <Button variant="contained" color="error" size="large" startIcon={<Stop />} onClick={handleTerminarRuta} sx={{ borderRadius: 2, fontWeight: 600, textTransform: 'none', px: 3 }}>
                                Finalizar Jornada
                            </Button>
                        </Box>
                    )}
                </CardContent>
            </Card>

            <Grid container spacing={3}>
                {}
                <Grid item xs={12} lg={8}>
                    <Card variant="outlined" sx={{ borderRadius: 3, height: 420, display: 'flex', flexDirection: 'column' }}>
                        <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 3 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#475569', display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                <LocationOn color="primary" /> Mapa del Recorrido Asignado
                            </Typography>
                            <Box sx={{ flexGrow: 1, backgroundColor: '#f1f5f9', borderRadius: 2, border: '1px dashed #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                                {enRuta ? (
                                    <Box sx={{ textAlign: 'center', zIndex: 2, p: 3 }}>
                                        <MyLocation color="primary" sx={{ fontSize: 45, animation: 'spin 4s linear infinite', '@keyframes spin': { '100%': { transform: 'rotate(360deg)' } } }} />
                                        <Typography variant="subtitle2" sx={{ fontWeight: 700, mt: 1.5, color: '#1e293b' }}>Geolocalización Activa</Typography>
                                        <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mt: 0.5 }}>Sincronizando puntos de cobertura en tiempo real...</Typography>
                                    </Box>
                                ) : (
                                    <Box sx={{ textAlign: 'center', p: 3 }}>
                                        <LocationOn sx={{ fontSize: 40, color: '#94a3b8' }} />
                                        <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500, mt: 1 }}>Da clic en "Iniciar Ruta" para visualizar el mapa dinámico.</Typography>
                                    </Box>
                                )}
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {}
                <Grid item xs={12} lg={4}>
                    <Card variant="outlined" sx={{ borderRadius: 3, height: 420, display: 'flex', flexDirection: 'column' }}>
                        <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', height: '100%' }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#475569', mb: 2 }}>Destinos Asignados</Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, flexGrow: 1 }}>
                                {puntosRutaHoy.map((punto) => (
                                    <Box key={punto.id} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2, backgroundColor: '#f8fafc', borderRadius: 2, border: '1px solid #e2e8f0' }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                            <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: enRuta ? '#3b82f6' : '#94a3b8' }} />
                                            <Typography variant="body2" sx={{ fontWeight: 600, color: '#334155' }}>{punto.nombre}</Typography>
                                        </Box>
                                        <Chip label={punto.estado} size="small" sx={{ fontSize: '0.75rem', fontWeight: 500 }} />
                                    </Box>
                                ))}
                            </Box>
                            <Box sx={{ mt: 'auto', p: 1.5, backgroundColor: '#f0fdf4', borderRadius: 2, border: '1px solid #bbf7d0', textAlign: 'center' }}>
                                <Typography variant="caption" sx={{ color: '#166534', fontWeight: 600 }}>Meta: Registrar un mínimo de 5 prospectos viables hoy.</Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {}
            <Card variant="outlined" sx={{ borderRadius: 3 }}>
                <CardContent sx={{ p: 3 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#475569', display: 'flex', alignItems: 'center', gap: 1, mb: 2.5 }}>
                        <History /> Historial de Rutas Tomadas (Días Anteriores)
                    </Typography>
                    <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2, border: '1px solid #e2e8f0' }}>
                        <Table>
                            <TableHead sx={{ backgroundColor: '#f8fafc' }}>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 600, color: '#64748b' }}>Fecha</TableCell>
                                    <TableCell sx={{ fontWeight: 600, color: '#64748b' }}>Zona / Recorrido</TableCell>
                                    <TableCell sx={{ fontWeight: 600, color: '#64748b' }}>Prospectos Captados</TableCell>
                                    <TableCell sx={{ fontWeight: 600, color: '#64748b' }}>Conversión</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {historialRutas.map((row, index) => (
                                    <TableRow key={index} hover>
                                        <TableCell sx={{ fontWeight: 500 }}><Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><CalendarToday sx={{ fontSize: 16, color: '#94a3b8' }} />{row.fecha}</Box></TableCell>
                                        <TableCell>{row.zona}</TableCell>
                                        <TableCell sx={{ fontWeight: 600 }}>{row.prospectos}</TableCell>
                                        <TableCell><Chip label={row.efectividad} size="small" sx={{ fontWeight: 600, bgcolor: '#eff6ff', color: '#1d4ed8' }} /></TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </CardContent>
            </Card>

            {}
            <Dialog open={modalInfoPago} onClose={() => setModalInfoPago(false)} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
                <DialogTitle sx={{ pb: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 800, color: '#1e293b', display: 'flex', alignItems: 'center', gap: 1 }}>
                        <AttachMoney color="success" /> ¿Cómo se calcula mi pago semanal?
                    </Typography>
                </DialogTitle>
                <DialogContent dividers sx={{ py: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>

                    <Alert severity="info" icon={<AssignmentTurnedIn />} sx={{ borderRadius: 2 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Tus números actuales esta semana:</Typography>
                        Has vendido <strong>{canvaceadorActivo.ventasSemana} paquetes</strong> generando un volumen de <strong>${canvaceadorActivo.volumenDinero.toLocaleString()} pesos</strong>.
                    </Alert>

                    <Typography variant="body2" color="text.secondary">
                        El coordinador de ventas puede asignarte a una de las siguientes modalidades de pago. Así es como funcionaría tu nómina en cada caso:
                    </Typography>

                    <Stack spacing={2}>
                        {}
                        <Card variant="outlined" sx={{ borderColor: '#3b82f6', bgcolor: '#eff6ff' }}>
                            <CardContent>
                                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#1d4ed8', mb: 1 }}>1. Modalidad: Pago por Metas (Escalonado)</Typography>
                                <Typography variant="body2" sx={{ color: '#1e3a8a', mb: 1 }}>Tu comisión sube de nivel dependiendo cuántos contratos cierres en la semana:</Typography>
                                <ul className="text-sm text-blue-900 space-y-1 ml-4 list-disc">
                                    <li><strong>1 a 3 ventas:</strong> Cobras el 30% del volumen generado.</li>
                                    <li><strong>4 a 5 ventas:</strong> Cobras el 60% del volumen generado.</li>
                                    <li><strong>6 a 10 ventas:</strong> Cobras el 100% del volumen generado.</li>
                                </ul>
                                <Divider sx={{ my: 1.5, borderColor: '#bfdbfe' }} />
                                <Typography variant="body2" sx={{ fontWeight: 700, color: '#1e40af' }}>
                                    Tu caso: Al tener 7 ventas, estás en el nivel del 100%. Te llevarías los ${canvaceadorActivo.volumenDinero.toLocaleString()} íntegros.
                                </Typography>
                            </CardContent>
                        </Card>

                        {}
                        <Card variant="outlined" sx={{ borderColor: '#10b981', bgcolor: '#ecfdf5' }}>
                            <CardContent>
                                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#047857', mb: 1 }}>2. Modalidad: Salario Base + Metas</Typography>
                                <Typography variant="body2" sx={{ color: '#065f46', mb: 1 }}>
                                    Recibes un sueldo fijo asegurado (ej. $1,000 MXN) más la comisión escalonada de tus ventas.
                                </Typography>
                                <Divider sx={{ my: 1.5, borderColor: '#a7f3d0' }} />
                                <Typography variant="body2" sx={{ fontWeight: 700, color: '#064e3b' }}>
                                    Tu caso: $1,000 de Base + ${canvaceadorActivo.volumenDinero.toLocaleString()} (al 100% por hacer 7 ventas) = Ganarías ${(canvaceadorActivo.volumenDinero + 1000).toLocaleString()} MXN.
                                </Typography>
                            </CardContent>
                        </Card>

                        {}
                        <Card variant="outlined" sx={{ borderColor: '#f59e0b', bgcolor: '#fffbeb' }}>
                            <CardContent>
                                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#b45309', mb: 1 }}>3. Modalidad: Comisión Pura Fija</Typography>
                                <Typography variant="body2" sx={{ color: '#92400e', mb: 1 }}>
                                    Se te paga un porcentaje fijo y directo por cada paquete vendido, sin importar si haces 1 o 20 ventas en la semana (generalmente operan al 50%).
                                </Typography>
                                <Divider sx={{ my: 1.5, borderColor: '#fde68a' }} />
                                <Typography variant="body2" sx={{ fontWeight: 700, color: '#78350f' }}>
                                    Tu caso: El 50% de tu volumen de $({canvaceadorActivo.volumenDinero.toLocaleString()}) = Ganarías ${(canvaceadorActivo.volumenDinero * 0.5).toLocaleString()} MXN.
                                </Typography>
                            </CardContent>
                        </Card>
                    </Stack>

                </DialogContent>
                <DialogActions sx={{ p: 2, px: 3 }}>
                    <Button onClick={() => setModalInfoPago(false)} variant="contained" color="primary">Entendido</Button>
                </DialogActions>
            </Dialog>

        </Box>
    );
};

export default CanvaceadorRuta;