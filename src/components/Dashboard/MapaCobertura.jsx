import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Card, CardContent, TextField,
  FormGroup, FormControlLabel, Checkbox, Button, Paper, IconButton
} from '@mui/material';
import { Add, Remove, Layers as LayersIcon } from '@mui/icons-material';

import { MapContainer, TileLayer, Circle, Popup, ZoomControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const MapaCobertura = () => {
  const [capas, setCapas] = useState({
    cobertura: true,
    zonaNo: true,
    clientes: true,
    colonias: false,
    expansion: false
  });

  const handleChangeCapa = (event) => {
    setCapas({ ...capas, [event.target.name]: event.target.checked });
  };

  const [cajasCobertura, setCajasCobertura] = useState([]);

  useEffect(() => {
    const obtenerCajas = async () => {
      try {
        const response = await fetch('http://10.144.86.55:1423/api/cajas_distribucion/');
        const data = await response.json();

        const cajasValidas = data.filter(caja =>
          caja.certified === true && caja.implanted === true
        );

        setCajasCobertura(cajasValidas);
      } catch (error) {
        console.error('Error al obtener las cajas de distribución:', error);
      }
    };

    obtenerCajas();
  }, []);

  const centroTehuacan = [18.4628, -97.3928];

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: '#1e293b' }}>
          Mapa de Cobertura
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Visualiza zonas de servicio, clientes actuales y factibilidad técnica.
        </Typography>
      </Box>

      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', md: 'row' }, 
        gap: 3, 
        width: '100%' 
      }}>
        
        <Box sx={{ flexGrow: 1, width: { xs: '100%', md: 'calc(100% - 340px)' } }}>
          <Card variant="outlined" sx={{ 
            width: '100%', 
            height: { xs: 450, md: 'calc(100vh - 180px)' }, 
            minHeight: 400,
            position: 'relative', 
            borderRadius: 3,
            overflow: 'hidden' 
          }}>
            
            <MapContainer 
              center={centroTehuacan} 
              zoom={14} 
              zoomControl={false} 
              style={{ height: '100%', width: '100%', zIndex: 0 }} 
            >
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />

              {capas.cobertura && cajasCobertura.map((caja, index) => (
                <Circle
                  key={caja.id_caja || index}
                  center={[caja.lat, caja.lng]}
                  radius={250} // RADIO EXACTO DE 250 METROS
                  pathOptions={{
                    color: '#3b82f6',
                    fillColor: '#3b82f6',
                    fillOpacity: 0.2, // Transparencia
                    weight: 2
                  }}
                >
                  <Popup>
                    <div style={{ textAlign: 'center' }}>
                      <strong>{caja.name}</strong><br/>
                      <span style={{color: 'green'}}>✅ Activa (250m)</span>
                    </div>
                  </Popup>
                </Circle>
              ))}

              {/* Botones de Zoom de la librería conectados a tu diseño */}
              <ZoomControl position="topleft" />
            </MapContainer>

            <Box sx={{ position: 'absolute', top: 16, left: 16, display: 'flex', flexDirection: 'column', gap: 1, zIndex: 1000 }}>
              <Paper variant="outlined" sx={{ borderRadius: 2, mt: 8 }}>
                <IconButton size="small"><LayersIcon fontSize="small" /></IconButton>
              </Paper>
            </Box>

            <Paper variant="outlined" sx={{ 
              position: 'absolute', 
              bottom: 16, 
              left: 16, 
              p: 2, 
              borderRadius: 2,
              maxWidth: { xs: 200, sm: 250 }, 
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              zIndex: 1000
            }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5, lineHeight: 1.1 }}>
                Cobertura disponible
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#22c55e', flexShrink: 0 }} />
                  <Typography variant="caption" sx={{ fontWeight: 500 }}>Zona cubierta (0-100m)</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#eab308', flexShrink: 0 }} />
                  <Typography variant="caption" sx={{ fontWeight: 500 }}>Buena (150-350m)</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#3b82f6', flexShrink: 0 }} />
                  <Typography variant="caption" sx={{ fontWeight: 500 }}>Limitada (350-550m)</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#ef4444', flexShrink: 0 }} />
                  <Typography variant="caption" sx={{ fontWeight: 500 }}>Sin cobertura</Typography>
                </Box>
              </Box>
            </Paper>
          </Card>
        </Box>

        <Box sx={{ flexShrink: 0, width: { xs: '100%', md: '320px' } }}>
          <Card variant="outlined" sx={{ borderRadius: 3, position: 'sticky', top: 24, width: '100%' }}>
            <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              
              <TextField 
                size="small" 
                placeholder="Buscar dirección o colonia..." 
                fullWidth 
              />
              
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, color: '#334155' }}>
                  Capas del mapa
                </Typography>
                <FormGroup>
                  <FormControlLabel control={<Checkbox checked={capas.cobertura} onChange={handleChangeCapa} name="cobertura" />} label={<Typography variant="body2">Cobertura disponible</Typography>} />
                  <FormControlLabel control={<Checkbox checked={capas.zonaNo} onChange={handleChangeCapa} name="zonaNo" />} label={<Typography variant="body2">Zonas No (IWIFI)</Typography>} />
                  <FormControlLabel control={<Checkbox checked={capas.clientes} onChange={handleChangeCapa} name="clientes" />} label={<Typography variant="body2">Clientes instalados</Typography>} />
                  <FormControlLabel control={<Checkbox checked={capas.colonias} onChange={handleChangeCapa} name="colonias" />} label={<Typography variant="body2">Límites de Colonias</Typography>} />
                  <FormControlLabel control={<Checkbox checked={capas.expansion} onChange={handleChangeCapa} name="expansion" />} label={<Typography variant="body2">Áreas de expansión</Typography>} />
                </FormGroup>
              </Box>

              <Button variant="contained" fullWidth color="primary" sx={{ py: 1.5, fontWeight: 700 }}>
                Aplicar Filtros
              </Button>

            </CardContent>
          </Card>
        </Box>

      </Box>
    </Box>
  );
};

export default MapaCobertura;