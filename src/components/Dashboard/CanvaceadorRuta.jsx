import React, { useState } from 'react';
import {
    Card,
    CardContent,
    Button,
    Typography,
    Grid,
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
    IconButton
} from '@mui/material';
import {
    PlayArrow,
    Stop,
    LocationOn,
    History,
    CalendarToday,
    ChevronRight,
    MyLocation
} from '@mui/icons-material';

const CanvaceadorRuta = () => {
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

            {/* Cabecera del Módulo */}
            <Card variant="outlined" sx={{ borderRadius: 3, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                <CardContent sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyBetween: 'space-between', alignItems: { xs: 'flex-start', md: 'center' }, gap: 2, p: 3, '&:last-child': { pb: 3 } }}>
                    <Box>
                        <Typography variant="h5" sx={{ fontWeight: 700, color: '#1e293b' }}>
                            Mi Ruta de Canvaceo
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#64748b', mt: 0.5 }}>
                            Inicia tu jornada de campo para trazar la ruta del día e inspeccionar tus metas.
                        </Typography>
                    </Box>

                    {!enRuta ? (
                        <Button
                            variant="contained"
                            color="primary"
                            size="large"
                            startIcon={<PlayArrow />}
                            onClick={handleIniciarRuta}
                            sx={{ borderRadius: 2, fontWeight: 600, textTransform: 'none', px: 3, py: 1.2, boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.3)' }}
                        >
                            Iniciar Ruta de Hoy
                        </Button>
                    ) : (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Chip
                                label={`Ruta Activa • Iniciada ${startTime}`}
                                color="success"
                                variant="outlined"
                                sx={{ fontWeight: 600, animation: 'pulse 2s infinite', '@keyframes pulse': { '0%, 100%': { opacity: 1 }, '50%': { opacity: 0.6 } } }}
                            />
                            <Button
                                variant="contained"
                                color="error"
                                size="large"
                                startIcon={<Stop />}
                                onClick={handleTerminarRuta}
                                sx={{ borderRadius: 2, fontWeight: 600, textTransform: 'none', px: 3, py: 1.2 }}
                            >
                                Finalizar Jornada
                            </Button>
                        </Box>
                    )}
                </CardContent>
            </Card>

            {/* Grid Central: Mapa simulado y Puntos asignados */}
            <Grid container spacing={3}>

                {/* Mapa de Recorrido */}
                <Grid item xs={12} lg={8}>
                    <Card variant="outlined" sx={{ borderRadius: 3, height: 420, display: 'flex', flexDirection: 'column' }}>
                        <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 3 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#475569', display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                <LocationOn color="primary" /> Mapa del Recorrido Asignado
                            </Typography>

                            <Box sx={{
                                flexGrow: 1,
                                backgroundColor: '#f1f5f9',
                                borderRadius: 2,
                                border: '1px dashed #cbd5e1',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                position: 'relative',
                                overflow: 'hidden'
                            }}>
                                {enRuta ? (
                                    <Box sx={{ textAlign: 'center', zIndex: 2, p: 3 }}>
                                        <MyLocation color="primary" sx={{ fontSize: 45, animation: 'spin 4s linear infinite', '@keyframes spin': { '100%': { transform: 'rotate(360deg)' } } }} />
                                        <Typography variant="subtitle2" sx={{ fontWeight: 700, mt: 1.5, color: '#1e293b' }}>
                                            Geolocalización Activa
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mt: 0.5 }}>
                                            Sincronizando puntos de cobertura en tiempo real...
                                        </Typography>
                                    </Box>
                                ) : (
                                    <Box sx={{ textAlign: 'center', p: 3 }}>
                                        <LocationOn sx={{ fontSize: 40, color: '#94a3b8' }} />
                                        <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500, mt: 1 }}>
                                            Por favor, haz clic en "Iniciar Ruta" para visualizar el mapa dinámico.
                                        </Typography>
                                    </Box>
                                )}
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Destinos */}
                <Grid item xs={12} lg={4}>
                    <Card variant="outlined" sx={{ borderRadius: 3, height: 420, display: 'flex', flexDirection: 'column' }}>
                        <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', height: '100%' }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#475569', mb: 2 }}>
                                Destinos Asignados
                            </Typography>

                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, flexGrow: 1 }}>
                                {puntosRutaHoy.map((punto) => (
                                    <Box key={punto.id} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2, backgroundColor: '#f8fafc', borderRadius: 2, border: '1px solid #e2e8f0' }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                            <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: enRuta ? '#3b82f6' : '#94a3b8' }} />
                                            <Typography variant="body2" sx={{ fontWeight: 600, color: '#334155' }}>
                                                {punto.nombre}
                                            </Typography>
                                        </Box>
                                        <Chip label={punto.estado} size="small" sx={{ fontSize: '0.75rem', fontWeight: 500 }} />
                                    </Box>
                                ))}
                            </Box>

                            <Box sx={{ mt: 'auto', p: 1.5, backgroundColor: '#f0fdf4', borderRadius: 2, border: '1px solid #bbf7d0', textAlign: 'center' }}>
                                <Typography variant="caption" sx={{ color: '#166534', fontWeight: 600 }}>
                                    Meta: Registrar un mínimo de 5 prospectos viables hoy.
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* MINI MÓDULO INTERNO: Historial de Rutas */}
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
                                    <TableCell />
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {historialRutas.map((row, index) => (
                                    <TableRow key={index} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                        <TableCell sx={{ fontWeight: 500 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <CalendarToday sx={{ fontSize: 16, color: '#94a3b8' }} />
                                                {row.fecha}
                                            </Box>
                                        </TableCell>
                                        <TableCell>{row.zona}</TableCell>
                                        <TableCell sx={{ fontWeight: 600 }}>{row.prospectos}</TableCell>
                                        <TableCell>
                                            <Chip label={row.efectividad} size="small" color="primary" variant="light" sx={{ fontWeight: 600, bgcolor: '#eff6ff', color: '#1d4ed8' }} />
                                        </TableCell>
                                        <TableCell align="right">
                                            <IconButton size="small"><ChevronRight /></IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </CardContent>
            </Card>

        </Box>
    );
};

export default CanvaceadorRuta;