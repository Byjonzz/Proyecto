import React, { useState } from 'react';
import { Box, Card, CardContent, Typography, Grid, Chip, Divider, Tabs, Tab, Paper, Button } from '@mui/material';
import { Upload, Download, CheckCircle, Tv, Wifi, FiberManualRecord, EmojiEvents, SignalCellularAlt } from '@mui/icons-material';

const PLANES_FIBRA_SIMETRICA = [
  { id: 'sim-intermedio', nombre: 'INTERMEDIO', precio: 309, descarga: 30, subida: 30, simetrica: true, ift: '1065567', color: '#d63384', colorGradient: 'linear-gradient(135deg, #d63384 0%, #e83e8c 100%)', destacado: false },
  { id: 'sim-avanzado', nombre: 'AVANZADO', precio: 409, descarga: 60, subida: 60, simetrica: true, ift: '1065572', color: '#d4a017', colorGradient: 'linear-gradient(135deg, #d4a017 0%, #e6b422 100%)', destacado: false },
  { id: 'sim-plus', nombre: 'PLUS', precio: 509, descarga: 100, subida: 100, simetrica: true, ift: '1065577', color: '#2196F3', colorGradient: 'linear-gradient(135deg, #2196F3 0%, #42a5f5 100%)', destacado: true }
];

const PLANES_FIBRA_ASIMETRICA = [
  { id: 'asim-basico', nombre: 'BÁSICO', precio: 310, descarga: 10, subida: 5, simetrica: false, ift: '1065496', color: '#d63384', colorGradient: 'linear-gradient(135deg, #d63384 0%, #e83e8c 100%)', destacado: false },
  { id: 'asim-intermedio', nombre: 'INTERMEDIO', precio: 410, descarga: 15, subida: 5, simetrica: false, ift: '1065502', color: '#4CAF50', colorGradient: 'linear-gradient(135deg, #4CAF50 0%, #66bb6a 100%)', destacado: false },
  { id: 'asim-avanzado', nombre: 'AVANZADO', precio: 510, descarga: 20, subida: 5, simetrica: false, ift: '1065535', color: '#d63384', colorGradient: 'linear-gradient(135deg, #d63384 0%, #e83e8c 100%)', destacado: false }
];

const PLANES_SOLIT_TV = [
  { id: 'tv-one', nombre: 'Solit+Tv One', precio: 535, descarga: 30, subida: 30, canales: '47 (41 HD / 6 SD)', simetrica: true, ift: '1462784', color: '#d63384', colorGradient: 'linear-gradient(135deg, #d63384 0%, #e83e8c 100%)', destacado: false },
  { id: 'tv-prime', nombre: 'Solit+Tv Prime', precio: 650, descarga: 60, subida: 60, canales: '47 (41 HD / 6 SD)', simetrica: true, ift: '1468403', color: '#4CAF50', colorGradient: 'linear-gradient(135deg, #4CAF50 0%, #66bb6a 100%)', destacado: true },
  { id: 'tv-plus', nombre: 'Solit+Tv Plus', precio: 760, descarga: 100, subida: 100, canales: '47 (41 HD / 6 SD)', simetrica: true, ift: '1468404', color: '#d63384', colorGradient: 'linear-gradient(135deg, #d63384 0%, #e83e8c 100%)', destacado: false }
];

const PLANES_HIBRIDOS = [
  { id: 'hib-10', nombre: 'Hibrido 10 Mbps', velocidad: 10, precio: 250 },
  { id: 'hib-20', nombre: 'Hibrido 20 Mbps', velocidad: 20, precio: 300 },
  { id: 'hib-40', nombre: 'Hibrido 40 Mbps', velocidad: 40, precio: 400 },
  { id: 'hib-60', nombre: 'Hibrido 60 Mbps', velocidad: 60, precio: 500 },
  { id: 'hib-5', nombre: 'Hibrido 5 Mbps', velocidad: 5, precio: 200 }
];

const PLANES_ANTENA_WIRELESS = [
  { id: 'wifi-10', nombre: 'WIFI MIX 10 Mbps', velocidad: 10, precio: 250 },
  { id: 'wifi-20', nombre: 'WIFI MIX 20 Mbps', velocidad: 20, precio: 300 },
  { id: 'wifi-40', nombre: 'WIFI MIX 40 Mbps', velocidad: 40, precio: 400 },
  { id: 'wifi-50', nombre: 'WIFI MIX 50 Mbps', velocidad: 50, precio: 500 }
];

const TarjetaPlan = ({ plan, seleccionado, onSelect }) => {
  return (
    <Card onClick={() => onSelect(plan)} sx={{ position: 'relative', cursor: 'pointer', borderRadius: 2, overflow: 'hidden', border: seleccionado ? '2px solid #1976d2' : '1px solid #e0e0e0', transition: 'all 0.2s ease', transform: seleccionado ? 'scale(1.02)' : 'scale(1)', boxShadow: seleccionado ? '0 4px 12px rgba(25, 118, 210, 0.25)' : '0 2px 8px rgba(0,0,0,0.08)', '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 6px 16px rgba(0,0,0,0.12)' } }}>
      {plan.destacado && (<Box sx={{ position: 'absolute', top: 6, right: -22, backgroundColor: '#ff9800', color: 'white', px: 2.5, py: 0.3, fontSize: '0.6rem', fontWeight: 700, transform: 'rotate(45deg)', zIndex: 2 }}>POPULAR</Box>)}
      <Box sx={{ background: plan.colorGradient, py: 1, textAlign: 'center' }}><Typography variant="subtitle2" sx={{ color: 'white', fontWeight: 800, letterSpacing: 0.5, fontSize: '0.85rem' }}>{plan.nombre}</Typography></Box>
      <CardContent sx={{ p: 1.5 }}>
        <Box sx={{ textAlign: 'center', mb: 1 }}><Typography sx={{ fontSize: '1.4rem', fontWeight: 900, color: '#1a1a1a', lineHeight: 1 }}>${plan.precio}</Typography><Typography sx={{ color: '#d63384', fontSize: '0.7rem', fontWeight: 600 }}>mensual</Typography></Box>
        <Divider sx={{ my: 0.8 }} />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6, mb: 0.4 }}><Download sx={{ color: '#9c27b0', fontSize: 14 }} /><Typography variant="caption" sx={{ color: '#333', fontSize: '0.75rem' }}>Bajada: <strong>{plan.descarga}Mbps</strong></Typography></Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6, mb: 0.4 }}><Upload sx={{ color: '#9c27b0', fontSize: 14 }} /><Typography variant="caption" sx={{ color: '#333', fontSize: '0.75rem' }}>Subida: <strong>{plan.subida}Mbps</strong></Typography></Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6, mb: 0.6 }}><Wifi sx={{ color: '#d63384', fontSize: 14 }} /><Typography variant="caption" sx={{ color: '#333', fontSize: '0.7rem' }}><strong style={{ color: plan.simetrica ? '#4CAF50' : '#ff9800' }}>{plan.simetrica ? 'Simétrica' : 'Asimétrica'}</strong></Typography></Box>
        {plan.canales && (<Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6, mb: 0.4 }}><Tv sx={{ color: '#2196F3', fontSize: 14 }} /><Typography variant="caption" sx={{ color: '#333', fontSize: '0.7rem' }}><strong>{plan.canales}</strong></Typography></Box>)}
        <Divider sx={{ my: 0.8 }} />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.3 }}><CheckCircle sx={{ color: '#4CAF50', fontSize: 12 }} /><Typography variant="caption" sx={{ color: '#333', fontSize: '0.7rem' }}>Mensualidad fija</Typography></Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}><CheckCircle sx={{ color: '#4CAF50', fontSize: 12 }} /><Typography variant="caption" sx={{ color: '#333', fontSize: '0.7rem' }}>Sin plazo forzoso</Typography></Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.8 }}><CheckCircle sx={{ color: '#d63384', fontSize: 12 }} /><Typography variant="caption" sx={{ color: '#333', fontSize: '0.65rem' }}>IFT: {plan.ift}</Typography></Box>
        <Button variant="contained" fullWidth size="small" sx={{ background: plan.colorGradient, py: 0.6, fontWeight: 700, borderRadius: 1.5, textTransform: 'none', fontSize: '0.75rem', boxShadow: '0 2px 6px rgba(0,0,0,0.12)', '&:hover': { opacity: 0.9 } }}>{seleccionado ? '✓ Seleccionado' : 'Me Interesa'}</Button>
      </CardContent>
    </Card>
  );
};

const TablaPlanes = ({ planes, seleccionadoId, onSelect, titulo, subtitulo, colorPrincipal }) => {
  const color = colorPrincipal || '#26a69a';
  return (
    <Paper elevation={0} sx={{ borderRadius: 2, overflow: 'hidden', border: `2px solid ${color}`, background: `linear-gradient(135deg, #e0f7fa 0%, #b2ebf2 100%)` }}>
      <Box sx={{ p: 1.5, textAlign: 'center', background: `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)` }}><Typography variant="subtitle1" sx={{ fontWeight: 900, color: 'white', letterSpacing: 1, fontSize: '0.95rem' }}>{titulo}</Typography><Typography variant="caption" sx={{ color: 'white', fontWeight: 500, fontSize: '0.7rem' }}>{subtitulo}</Typography></Box>
      <Box sx={{ p: 1 }}>{planes.map((plan) => (<Box key={plan.id} onClick={() => onSelect(plan)} sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', mb: 0.4, borderRadius: 1, overflow: 'hidden', cursor: 'pointer', border: seleccionadoId === plan.id ? '2px solid #1976d2' : '1px solid #e0e0e0', backgroundColor: seleccionadoId === plan.id ? '#e3f2fd' : 'white', transition: 'all 0.2s', '&:hover': { backgroundColor: '#e0f7fa', transform: 'scale(1.01)' } }}><Typography sx={{ p: 0.8, textAlign: 'center', textDecoration: 'underline', fontWeight: 600, color: '#333', fontSize: '0.8rem' }}>{plan.nombre}</Typography><Typography sx={{ p: 0.8, textAlign: 'center', fontWeight: 700, color: color, borderLeft: '1px solid #b2ebf2', fontSize: '0.85rem' }}>${plan.precio}</Typography></Box>))}</Box>
    </Paper>
  );
};

const SeleccionPlanes = ({ planSeleccionado, onPlanSeleccionado }) => {
  const [tabActiva, setTabActiva] = useState(0);
  const handleChangeTab = (event, newValue) => { setTabActiva(newValue); };
  const handleSeleccionar = (plan) => { onPlanSeleccionado(plan); };

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5, color: '#1a1a1a', fontSize: '0.9rem' }}>Selecciona tu Paquete</Typography>
      <Tabs value={tabActiva} onChange={handleChangeTab} variant="scrollable" scrollButtons="auto" sx={{ mb: 2, '& .MuiTab-root': { fontWeight: 700, textTransform: 'none', fontSize: '0.75rem', minHeight: 36, py: 0.8 }, '& .Mui-selected': { color: '#d63384 !important' }, '& .MuiTabs-indicator': { backgroundColor: '#d63384' } }}>
        <Tab icon={<FiberManualRecord sx={{ color: '#2196F3', fontSize: 14 }} />} label="Fibra Simétrica" iconPosition="start" />
        <Tab icon={<Wifi sx={{ color: '#4CAF50', fontSize: 14 }} />} label="Fibra Asimétrica" iconPosition="start" />
        <Tab icon={<Tv sx={{ color: '#9c27b0', fontSize: 14 }} />} label="Solit + TV" iconPosition="start" />
        <Tab icon={<EmojiEvents sx={{ color: '#ff9800', fontSize: 14 }} />} label="Híbrido" iconPosition="start" />
        <Tab icon={<SignalCellularAlt sx={{ color: '#7c4dff', fontSize: 14 }} />} label="Antena/Wireless" iconPosition="start" />
      </Tabs>
      <Box sx={{ minHeight: 400 }}>
        {tabActiva === 0 && (<Box><Box sx={{ mb: 2, p: 1, backgroundColor: '#e3f2fd', borderRadius: 1, borderLeft: '3px solid #2196F3' }}><Typography variant="caption" sx={{ fontWeight: 600, color: '#1565c0', fontSize: '0.75rem' }}>🚀 Subida y bajada a la misma velocidad</Typography></Box><Grid container spacing={1.5}>{PLANES_FIBRA_SIMETRICA.map((plan) => (<Grid item xs={12} sm={4} key={plan.id}><TarjetaPlan plan={plan} seleccionado={planSeleccionado?.id === plan.id} onSelect={handleSeleccionar} /></Grid>))}</Grid></Box>)}
        {tabActiva === 1 && (<Box><Box sx={{ mb: 2, p: 1, backgroundColor: '#e8f5e9', borderRadius: 1, borderLeft: '3px solid #4CAF50' }}><Typography variant="caption" sx={{ fontWeight: 600, color: '#2e7d32', fontSize: '0.75rem' }}>📶 Mayor velocidad de descarga</Typography></Box><Grid container spacing={1.5}>{PLANES_FIBRA_ASIMETRICA.map((plan) => (<Grid item xs={12} sm={4} key={plan.id}><TarjetaPlan plan={plan} seleccionado={planSeleccionado?.id === plan.id} onSelect={handleSeleccionar} /></Grid>))}</Grid></Box>)}
        {tabActiva === 2 && (<Box><Box sx={{ mb: 2, p: 1, backgroundColor: '#f3e5f5', borderRadius: 1, borderLeft: '3px solid #9c27b0' }}><Typography variant="caption" sx={{ fontWeight: 600, color: '#7b1fa2', fontSize: '0.75rem' }}>📺 Internet + Televisión</Typography></Box><Grid container spacing={1.5}>{PLANES_SOLIT_TV.map((plan) => (<Grid item xs={12} sm={4} key={plan.id}><TarjetaPlan plan={plan} seleccionado={planSeleccionado?.id === plan.id} onSelect={handleSeleccionar} /></Grid>))}</Grid></Box>)}
        {tabActiva === 3 && (<Box sx={{ maxWidth: 600 }}><TablaPlanes planes={PLANES_HIBRIDOS} seleccionadoId={planSeleccionado?.id} onSelect={handleSeleccionar} titulo="HÍBRIDO" subtitulo="Zonas sin fibra" colorPrincipal="#26a69a" /></Box>)}
        {tabActiva === 4 && (<Box sx={{ maxWidth: 600 }}><TablaPlanes planes={PLANES_ANTENA_WIRELESS} seleccionadoId={planSeleccionado?.id} onSelect={handleSeleccionar} titulo="ANTENA / WIRELESS" subtitulo="Zonas sin fibra" colorPrincipal="#7c4dff" /></Box>)}
      </Box>
      {planSeleccionado && (<Paper sx={{ mt: 2, p: 1.5, backgroundColor: '#e8f5e9', borderRadius: 2, border: '2px solid #4CAF50', display: 'flex', alignItems: 'center', gap: 1.5 }}><CheckCircle sx={{ color: '#4CAF50', fontSize: 28 }} /><Box sx={{ flex: 1 }}><Typography variant="caption" sx={{ fontWeight: 700, color: '#2e7d32', display: 'block', fontSize: '0.8rem' }}>Plan: {planSeleccionado.nombre}</Typography><Typography variant="caption" sx={{ color: '#555', fontSize: '0.75rem' }}>${planSeleccionado.precio}/mes • {planSeleccionado.descarga || planSeleccionado.velocidad}Mbps</Typography></Box><Chip label="✓ Confirmado" color="success" size="small" sx={{ fontWeight: 700 }} /></Paper>)}
    </Box>
  );
};

export default SeleccionPlanes;
export { PLANES_FIBRA_SIMETRICA, PLANES_FIBRA_ASIMETRICA, PLANES_SOLIT_TV, PLANES_HIBRIDOS, PLANES_ANTENA_WIRELESS };