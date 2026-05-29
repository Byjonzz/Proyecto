import React, { useState } from 'react';
import {
    Box, Card, CardContent, Typography, Grid, TextField, MenuItem,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, Button, Chip, Alert, Stack, Divider, LinearProgress, IconButton, Tooltip
} from '@mui/material';
import {
    AttachMoney, MapOutlined, AccessTimeOutlined, BarChartOutlined,
    WarningAmberOutlined, CheckCircleOutlined, PersonSearchOutlined
} from '@mui/icons-material';

const Comisiones = () => {
    // Lógica de Configuración de Pagos (Definida por el Coordinador)
    const [configuracion, setConfiguracion] = useState({
        modalidad: 'comision_pura', // base_mas_comision, comision_pura, solo_metas
        esquemaCalculo: 'sumatoria_total', // sumatoria_total, por_paquete
        porcentajeComision: 50, // Actualmente al 50% temporal
        periodoMeta: 'semanal',
        metaCantidad: 15 // Meta de contratos
    });

    // Datos Simulados del Equipo de Canvaceadores
    const [equipo, setEquipo] = useState([
        {
            id: 1, nombre: 'Carlos Ruiz', zonaAsignada: 'Polígono Norte - San José',
            ventasRealizadas: 18, totalRecaudado: 8500, horasApp: 42,
            contratosDiarios: [3, 4, 2, 5, 4, 0], // L a S
            estatus: 'Excelente'
        },
        {
            id: 2, nombre: 'Ana Gómez', zonaAsignada: 'Polígono Sur - Palmas',
            ventasRealizadas: 8, totalRecaudado: 3800, horasApp: 30,
            contratosDiarios: [1, 2, 1, 2, 2, 0],
            estatus: 'Bajo Rendimiento'
        },
        {
            id: 3, nombre: 'Luis Pérez', zonaAsignada: 'Polígono Centro',
            ventasRealizadas: 15, totalRecaudado: 6900, horasApp: 38,
            contratosDiarios: [2, 3, 3, 3, 4, 0],
            estatus: 'Regular'
        }
    ]);

    const handleConfigChange = (prop, value) => {
        setConfiguracion({ ...configuracion, [prop]: value });
    };

    // Función para calcular la comisión dinámica
    const calcularPago = (ventas, recaudado) => {
        let pago = 0;
        const alcanceMeta = ventas >= configuracion.metaCantidad;

        if (configuracion.modalidad === 'solo_metas') {
            // Si trabaja solo por metas, se paga el % completo si llega a la meta
            pago = alcanceMeta ? (recaudado * (configuracion.porcentajeComision / 100)) : 0;
        } else {
            // Comisión pura o base + comisión
            pago = recaudado * (configuracion.porcentajeComision / 100);
        }
        return pago.toFixed(2);
    };

    const getRendimientoColor = (estatus) => {
        if (estatus === 'Excelente') return 'success';
        if (estatus === 'Regular') return 'warning';
        return 'error';
    };

    return (
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 3 }}>

            <Box>
                <Typography variant="h5" sx={{ fontWeight: 700, color: '#1e293b', display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PersonSearchOutlined color="primary" fontSize="large" /> Gestión de Equipo y Comisiones
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Supervisión de canvaceadores, métricas de productividad y planes de pago.
                </Typography>
            </Box>

            <Grid container spacing={3}>
                {/* PANEL DE CONFIGURACIÓN DE ESQUEMA */}
                <Grid item xs={12} lg={4}>
                    <Card variant="outlined" sx={{ borderRadius: 3, height: '100%' }}>
                        <CardContent>
                            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#475569', mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                                <AttachMoney color="success" /> Parámetros de Pago
                            </Typography>

                            <Stack spacing={3}>
                                <TextField select label="Modalidad de Trabajo" size="small" fullWidth value={configuracion.modalidad} onChange={(e) => handleConfigChange('modalidad', e.target.value)}>
                                    <MenuItem value="comision_pura">Comisión</MenuItem>
                                    <MenuItem value="solo_metas">Pago condicionado a Metas</MenuItem>
                                    <MenuItem value="base_mas_comision">Salario Base + Comisiones</MenuItem>
                                </TextField>

                                <TextField select label="Esquema de Cálculo" size="small" fullWidth value={configuracion.esquemaCalculo} onChange={(e) => handleConfigChange('esquemaCalculo', e.target.value)} helperText="Cómo se aplica el porcentaje.">
                                    <MenuItem value="sumatoria_total">Sobre sumatoria total de ventas</MenuItem>
                                    <MenuItem value="por_paquete">Porcentaje por paquete vendido</MenuItem>
                                </TextField>

                                <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                        <TextField label="% de Comisión" type="number" size="small" fullWidth value={configuracion.porcentajeComision} onChange={(e) => handleConfigChange('porcentajeComision', e.target.value)} />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField label="Meta (Contratos)" type="number" size="small" fullWidth value={configuracion.metaCantidad} onChange={(e) => handleConfigChange('metaCantidad', e.target.value)} />
                                    </Grid>
                                </Grid>

                                <Button variant="contained" color="primary" fullWidth sx={{ fontWeight: 700 }}>
                                    Solicitar Aprobación del Esquema
                                </Button>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>

                {/* TABLA DE DESEMPEÑO DEL EQUIPO */}
                <Grid item xs={12} lg={8}>
                    <Card variant="outlined" sx={{ borderRadius: 3, height: '100%' }}>
                        <CardContent>
                            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#475569', mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                                <BarChartOutlined color="primary" /> Productividad y Seguimiento de Canvaceadores
                            </Typography>

                            <TableContainer>
                                <Table size="small">
                                    <TableHead sx={{ backgroundColor: '#f8fafc' }}>
                                        <TableRow>
                                            <TableCell sx={{ fontWeight: 600 }}>Vendedor</TableCell>
                                            <TableCell sx={{ fontWeight: 600 }}>Zona Asignada</TableCell>
                                            <TableCell align="center" sx={{ fontWeight: 600 }}>Ventas vs Meta</TableCell>
                                            <TableCell align="center" sx={{ fontWeight: 600 }}>Tiempo App</TableCell>
                                            <TableCell align="center" sx={{ fontWeight: 600 }}>Comisión Calculada</TableCell>
                                            <TableCell align="center" sx={{ fontWeight: 600 }}>Ubicación</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {equipo.map((agente) => {
                                            const porcentajeMeta = (agente.ventasRealizadas / configuracion.metaCantidad) * 100;
                                            return (
                                                <TableRow key={agente.id} hover>
                                                    <TableCell>
                                                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{agente.nombre}</Typography>
                                                        <Chip label={agente.estatus} color={getRendimientoColor(agente.estatus)} size="small" sx={{ height: 16, fontSize: '0.65rem', mt: 0.5 }} />
                                                    </TableCell>
                                                    <TableCell sx={{ color: '#475569', fontSize: '0.8rem' }}>{agente.zonaAsignada}</TableCell>
                                                    <TableCell align="center">
                                                        <Typography variant="body2" sx={{ fontWeight: 700, color: porcentajeMeta >= 100 ? '#10b981' : '#f59e0b' }}>
                                                            {agente.ventasRealizadas} / {configuracion.metaCantidad}
                                                        </Typography>
                                                        <LinearProgress variant="determinate" value={porcentajeMeta > 100 ? 100 : porcentajeMeta} color={porcentajeMeta >= 100 ? 'success' : 'primary'} sx={{ height: 4, borderRadius: 2, mt: 0.5 }} />
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                                                            <AccessTimeOutlined fontSize="small" color="action" /> {agente.horasApp}h
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#16a34a' }}>
                                                            ${calcularPago(agente.ventasRealizadas, agente.totalRecaudado)}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        <Tooltip title="Ver en tiempo real">
                                                            <IconButton color="primary" size="small"><MapOutlined /></IconButton>
                                                        </Tooltip>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </CardContent>
                    </Card>
                </Grid>

                {/* GRÁFICA LOGÍSTICA: CONTRATOS POR DÍA */}
                <Grid item xs={12}>
                    <Card variant="outlined" sx={{ borderRadius: 3 }}>
                        <CardContent>
                            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#475569', mb: 2 }}>
                                Logística: Contratos Realizados por Día (Productividad Semanal)
                            </Typography>

                            <Grid container spacing={2}>
                                {equipo.map(agente => (
                                    <Grid item xs={12} md={4} key={agente.id}>
                                        <Box sx={{ p: 2, backgroundColor: '#f8fafc', borderRadius: 2, border: '1px solid #e2e8f0' }}>
                                            <Typography variant="caption" sx={{ fontWeight: 700, color: '#334155', mb: 1, display: 'block' }}>
                                                {agente.nombre}
                                            </Typography>
                                            {/* Gráfica de barras CSS nativa */}
                                            <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: 80, borderBottom: '1px solid #cbd5e1', pb: 0.5 }}>
                                                {['L', 'M', 'M', 'J', 'V', 'S'].map((dia, index) => {
                                                    const cantidad = agente.contratosDiarios[index];
                                                    const altura = cantidad * 15; // Factor visual
                                                    return (
                                                        <Box key={index} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '14%' }}>
                                                            <Typography variant="caption" sx={{ fontSize: '0.6rem', color: '#64748b' }}>{cantidad}</Typography>
                                                            <Box sx={{ width: '100%', height: `${altura}px`, backgroundColor: '#3b82f6', borderRadius: '2px 2px 0 0' }} />
                                                            <Typography variant="caption" sx={{ fontSize: '0.6rem', fontWeight: 600 }}>{dia}</Typography>
                                                        </Box>
                                                    );
                                                })}
                                            </Box>
                                        </Box>
                                    </Grid>
                                ))}
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>

            </Grid>
        </Box>
    );
};

export default Comisiones;