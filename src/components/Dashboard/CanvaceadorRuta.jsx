import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Avatar, Chip, Tooltip, CircularProgress, Divider,
  Card, CardContent, Grid, Button, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow
} from '@mui/material';
import { 
  TrendingUp, AssignmentTurnedIn, InfoOutlined, PlayArrow, 
  LocationOn, HistoryOutlined 
} from '@mui/icons-material';
import api from '../../services/api';

const BannerComisiones = ({ usuarioActual }) => {
  const [datos, setDatos] = useState({
    ventas: 0,
    desglose: '',
    pagoCalculado: 0,
    etiquetaModalidad: 'Cargando...',
    etiquetaChip: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarComisiones = async () => {
      if (!usuarioActual?.perfil_id) return;
      
      try {
        const resCanv = await api.get(`/canvaceadores/${usuarioActual.perfil_id}/`);
        const canvData = resCanv.data;

        const resContratos = await api.get('/contratos/');
        const misContratos = resContratos.data.filter(
          c => c.canvaceador_id === usuarioActual.perfil_id && c.comision_pagada === false
        );

        const conteoPlanes = {};
        misContratos.forEach(c => {
          const plan = c.plan_contratado || 'Otros';
          conteoPlanes[plan] = (conteoPlanes[plan] || 0) + 1;
        });
        
        const textoDesglose = Object.keys(conteoPlanes).length > 0
          ? Object.entries(conteoPlanes).map(([plan, cant]) => `${cant} ${plan}`).join(', ')
          : 'Sin ventas registradas';

        let modalidad = 'solo_metas';
        let base = 1000;
        let comisionFija = 50;

        try {
          const resEsquema = await api.get('/esquemas_pago/');
          if (resEsquema.data && resEsquema.data.length > 0) {
            const esquemaActivo = resEsquema.data[resEsquema.data.length - 1];
            modalidad = esquemaActivo.modalidad || 'solo_metas';
            base = parseFloat(esquemaActivo.salario_base || 1000);
            comisionFija = parseFloat(esquemaActivo.comision_plana_porcentaje || 50);
          }
        } catch (e) {
        }

        const totalVentas = canvData.contratos_pendientes || 0;
        const volumen = canvData.volumen_pendiente || 0;
        
        let pagoFinal = 0;
        let etiquetaModalidad = "";
        let etiquetaChip = "";

        if (modalidad === 'solo_metas') {
          let porcentaje = 0;
          if (totalVentas >= 6) porcentaje = 100;
          else if (totalVentas >= 4) porcentaje = 60;
          else if (totalVentas >= 1) porcentaje = 30;
          
          pagoFinal = volumen * (porcentaje / 100);
          etiquetaModalidad = "Pago por Metas";
          etiquetaChip = `Meta ${porcentaje}%`;
        } 
        else if (modalidad === 'base_mas_comision') {
          pagoFinal = base + (volumen * (comisionFija / 100));
          etiquetaModalidad = "Base + Comisión";
          etiquetaChip = `Fijo ${comisionFija}%`;
        } 
        else if (modalidad === 'comision_pura') {
          pagoFinal = volumen * (comisionFija / 100);
          etiquetaModalidad = "Comisión Pura";
          etiquetaChip = `Fijo ${comisionFija}%`;
        }

        setDatos({
          ventas: totalVentas,
          desglose: textoDesglose,
          pagoCalculado: pagoFinal,
          etiquetaModalidad,
          etiquetaChip
        });

      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    cargarComisiones();
  }, [usuarioActual]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4, bgcolor: '#0f172a', borderRadius: 3, mb: 4 }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  return (
    <Box sx={{ 
      backgroundColor: '#0f172a', color: 'white', borderRadius: 3, p: { xs: 2, md: 3 }, 
      display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
      flexWrap: 'wrap', gap: 3, mb: 4, boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
    }}>
      
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Avatar sx={{ width: 56, height: 56, bgcolor: '#3b82f6', fontSize: '1.5rem', fontWeight: 700 }}>
          {usuarioActual?.nombre?.charAt(0) || 'U'}
        </Avatar>
        <Box>
          <Typography variant="caption" sx={{ color: '#94a3b8' }}>Hola de nuevo,</Typography>
          <Typography variant="h6" sx={{ fontWeight: 800 }}>{usuarioActual?.nombre || 'Usuario'}</Typography>
        </Box>
      </Box>

      <Divider orientation="vertical" flexItem sx={{ borderColor: '#334155', display: { xs: 'none', md: 'block' } }} />

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <AssignmentTurnedIn sx={{ color: '#10b981', fontSize: 40 }} />
        <Box>
          <Typography variant="caption" sx={{ color: '#94a3b8' }}>Contratos Semanales</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="h5" sx={{ fontWeight: 800 }}>{datos.ventas} Ventas</Typography>
            <Chip 
              label={datos.etiquetaChip} 
              size="small" 
              sx={{ bgcolor: '#10b981', color: 'white', fontWeight: 700, height: 20 }} 
            />
          </Box>
          <Typography variant="caption" sx={{ color: '#cbd5e1' }}>({datos.desglose})</Typography>
        </Box>
      </Box>

      <Divider orientation="vertical" flexItem sx={{ borderColor: '#334155', display: { xs: 'none', md: 'block' } }} />

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <TrendingUp sx={{ color: '#f59e0b', fontSize: 40 }} />
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="caption" sx={{ color: '#94a3b8' }}>Pago Calculado Actual</Typography>
            <Tooltip title="Modalidad de trabajo asignada por administración.">
              <InfoOutlined sx={{ fontSize: 16, color: '#94a3b8', cursor: 'help' }} />
            </Tooltip>
            <Chip 
              label={datos.etiquetaModalidad} 
              size="small" 
              sx={{ bgcolor: '#3b82f6', color: 'white', height: 18, fontSize: '0.65rem', fontWeight: 700 }} 
            />
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#10b981' }}>
            ${datos.pagoCalculado.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </Typography>
        </Box>
      </Box>

    </Box>
  );
};

const CanvaceadorRuta = ({ usuarioActual }) => {

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      
      <BannerComisiones usuarioActual={usuarioActual} />

      <Card variant="outlined" sx={{ borderRadius: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 3, borderBottom: '1px solid #e2e8f0' }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b' }}>
              Mi Ruta de Canvaceo
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Inicia tu jornada de campo para trazar la ruta del día e inspeccionar tus metas.
            </Typography>
          </Box>
          <Button variant="contained" color="primary" startIcon={<PlayArrow />} sx={{ fontWeight: 700 }}>
            Iniciar Ruta de Hoy
          </Button>
        </Box>

        <CardContent sx={{ p: 3 }}>
          <Grid container spacing={3}>
            
            <Grid item xs={12} md={6}>
              <Box sx={{ border: '1px solid #e2e8f0', borderRadius: 2, p: 2, height: '100%' }}>
                <Typography variant="subtitle2" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, fontWeight: 700, color: '#475569' }}>
                  <LocationOn color="primary" fontSize="small" /> Mapa del Recorrido Asignado
                </Typography>
                
                <Box sx={{ 
                  height: 250, border: '2px dashed #cbd5e1', borderRadius: 2, backgroundColor: '#f8fafc',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#94a3b8'
                }}>
                  <LocationOn sx={{ fontSize: 40, mb: 1, opacity: 0.5 }} />
                  <Typography variant="body2">Da clic en "Iniciar Ruta" para visualizar el mapa dinámico.</Typography>
                </Box>
              </Box>
            </Grid>

            {/* Destinos Asignados */}
            <Grid item xs={12} md={6}>
              <Box sx={{ border: '1px solid #e2e8f0', borderRadius: 2, p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 700, color: '#475569' }}>
                  Destinos Asignados
                </Typography>
                
                <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1.5, border: '1px solid #e2e8f0', borderRadius: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>• Colonia Centro - Sector A</Typography>
                    <Chip label="Pendiente" size="small" sx={{ bgcolor: '#e2e8f0', color: '#475569', fontSize: '0.7rem' }} />
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1.5, border: '1px solid #e2e8f0', borderRadius: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>• Fraccionamiento Las Palmas</Typography>
                    <Chip label="Pendiente" size="small" sx={{ bgcolor: '#e2e8f0', color: '#475569', fontSize: '0.7rem' }} />
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1.5, border: '1px solid #e2e8f0', borderRadius: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>• Av. Universidad - Negocios</Typography>
                    <Chip label="Pendiente" size="small" sx={{ bgcolor: '#e2e8f0', color: '#475569', fontSize: '0.7rem' }} />
                  </Box>
                </Box>

                <Box sx={{ mt: 2, bgcolor: '#ecfdf5', p: 1.5, borderRadius: 1, border: '1px solid #a7f3d0' }}>
                  <Typography variant="caption" sx={{ color: '#047857', fontWeight: 700 }}>
                    Meta: Registrar un mínimo de 5 prospectos viables hoy.
                  </Typography>
                </Box>
              </Box>
            </Grid>

          </Grid>
        </CardContent>
      </Card>

      {/* 🟢 SECCIÓN DEL HISTORIAL DE RUTAS */}
      <Card variant="outlined" sx={{ borderRadius: 3 }}>
        <Box sx={{ p: 2, borderBottom: '1px solid #e2e8f0' }}>
          <Typography variant="subtitle2" sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 700, color: '#475569' }}>
            <HistoryOutlined fontSize="small" /> Historial de Rutas Tomadas (Días Anteriores)
          </Typography>
        </Box>
        <TableContainer>
          <Table size="small">
            <TableHead sx={{ backgroundColor: '#f8fafc' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, color: '#64748b' }}>Fecha</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#64748b' }}>Zona / Recorrido</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#64748b' }}>Prospectos Captados</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#64748b' }}>Conversión</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow hover>
                <TableCell><Typography variant="body2" color="text.secondary">📅 27/05/2026</Typography></TableCell>
                <TableCell><Typography variant="body2" sx={{ fontWeight: 600 }}>Zona Alta - San José</Typography></TableCell>
                <TableCell><Typography variant="body2" sx={{ fontWeight: 700 }}>12</Typography></TableCell>
                <TableCell><Typography variant="body2" sx={{ color: '#3b82f6', fontWeight: 700 }}>75%</Typography></TableCell>
              </TableRow>
              <TableRow hover>
                <TableCell><Typography variant="body2" color="text.secondary">📅 26/05/2026</Typography></TableCell>
                <TableCell><Typography variant="body2" sx={{ fontWeight: 600 }}>Colonia El Carmen</Typography></TableCell>
                <TableCell><Typography variant="body2" sx={{ fontWeight: 700 }}>8</Typography></TableCell>
                <TableCell><Typography variant="body2" sx={{ color: '#3b82f6', fontWeight: 700 }}>50%</Typography></TableCell>
              </TableRow>
              <TableRow hover>
                <TableCell><Typography variant="body2" color="text.secondary">📅 25/05/2026</Typography></TableCell>
                <TableCell><Typography variant="body2" sx={{ fontWeight: 600 }}>Barrio de la Soledad</Typography></TableCell>
                <TableCell><Typography variant="body2" sx={{ fontWeight: 700 }}>15</Typography></TableCell>
                <TableCell><Typography variant="body2" sx={{ color: '#3b82f6', fontWeight: 700 }}>90%</Typography></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

    </Box>
  );
};

export default CanvaceadorRuta;