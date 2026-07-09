import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, Paper } from '@mui/material';
import { MapContainer, TileLayer, GeoJSON, ZoomControl, CircleMarker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import * as turf from '@turf/turf'; 

import { GeoSearchControl, GoogleProvider } from 'leaflet-geosearch';
import 'leaflet-geosearch/dist/geosearch.css';
import api from '../../services/api';

const BuscadorIntegrado = () => {
  const map = useMap();
  useEffect(() => {
    const provider = new GoogleProvider({
      apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY, 
      region: 'mx',
      language: 'es',
    });

    const searchControl = new GeoSearchControl({
      provider: provider, 
      style: 'bar', 
      searchLabel: 'Buscar colonia o dirección...',
      showMarker: true, 
      showPopup: true, 
      autoClose: true, 
      animateZoom: true, 
      keepResult: true      
    });
    
    map.addControl(searchControl);
    return () => map.removeControl(searchControl);
  }, [map]);
  return null;
};

const MapaCobertura = () => {
  const [poligonoCobertura, setPoligonoCobertura] = useState(null);
  const [cajasActivas, setCajasActivas] = useState([]);
  const [cajasInactivas, setCajasInactivas] = useState([]);

  useEffect(() => {
    const obtenerCajas = async () => {
      try {
        const response = await api.get('/cajas_distribucion/');
        const data = response.data;

        const datosSeguros = data.filter(caja => caja.lat && caja.lng && !isNaN(parseFloat(caja.lat)));
        const activas = datosSeguros.filter(caja => caja.certified === true && caja.implanted === true);
        const inactivas = datosSeguros.filter(caja => caja.certified === false || caja.implanted === false);

        setCajasActivas(activas);
        setCajasInactivas(inactivas);

        if (activas.length > 0) {
          const puntos = activas.map(caja => turf.point([parseFloat(caja.lng), parseFloat(caja.lat)]));
          const buffers = turf.buffer(turf.featureCollection(puntos), 200, { units: 'meters' });
          const areaUnificada = turf.dissolve(buffers);
          
          setPoligonoCobertura(areaUnificada);
        } else {
          setPoligonoCobertura(null);
        }
      } catch (error) {
        console.error('Error al obtener cajas de la API:', error);
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
          Visualiza zonas con factibilidad en Tehuacán en tiempo real.
        </Typography>
      </Box>

      <Card variant="outlined" sx={{ 
        width: '100%', 
        height: { xs: 500, md: 'calc(100vh - 180px)' }, 
        minHeight: 500, 
        position: 'relative', 
        borderRadius: 3, 
        overflow: 'hidden' 
      }}>
        
        <MapContainer center={centroTehuacan} zoom={14} zoomControl={false} style={{ height: '100%', width: '100%', zIndex: 0 }}>
          
          {/* 👇 AQUÍ ESTÁ EL CAMBIO PRINCIPAL: CAPA DE GOOGLE MAPS (ESTÁNDAR) 👇 */}
          <TileLayer 
            url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}" 
            attribution='&copy; Google Maps'
          />
          
          <BuscadorIntegrado />

          {poligonoCobertura && (
            <GeoJSON 
              key={`azul-${JSON.stringify(poligonoCobertura).length}`} 
              data={poligonoCobertura} 
              style={{ color: '#3b82f6', weight: 2, fillColor: '#3b82f6', fillOpacity: 0.25 }} 
            />
          )}

          {cajasActivas.map((caja, idx) => (
            <CircleMarker key={`act-${idx}`} center={[parseFloat(caja.lat), parseFloat(caja.lng)]} radius={5} pathOptions={{ color: '#16a34a', fillColor: '#22c55e', fillOpacity: 1, weight: 2 }}>
              <Popup><b>{caja.name}</b><br/>✅ Caja Activa</Popup>
            </CircleMarker>
          ))}

          {cajasInactivas.map((caja, idx) => (
            <CircleMarker key={`inact-${idx}`} center={[parseFloat(caja.lat), parseFloat(caja.lng)]} radius={5} pathOptions={{ color: '#dc2626', fillColor: '#ef4444', fillOpacity: 1, weight: 2 }}>
              <Popup><b>{caja.name}</b><br/>❌ Caja Pendiente</Popup>
            </CircleMarker>
          ))}

          <ZoomControl position="bottomright" />
        </MapContainer>

        <Paper variant="outlined" sx={{ position: 'absolute', bottom: 16, left: 16, p: 2, borderRadius: 2, maxWidth: 250, backgroundColor: 'rgba(255, 255, 255, 0.95)', zIndex: 1000 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5 }}>Simbología</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#22c55e', border: '2px solid #16a34a', flexShrink: 0 }} />
              <Typography variant="caption" sx={{ fontWeight: 600 }}>Caja Activa</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#ef4444', border: '2px solid #dc2626', flexShrink: 0 }} />
              <Typography variant="caption" sx={{ fontWeight: 600 }}>Caja Pendiente</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ width: 12, height: 12, borderRadius: 2, bgcolor: '#3b82f6', opacity: 0.5, flexShrink: 0 }} />
              <Typography variant="caption" sx={{ fontWeight: 600 }}>Zona con Cobertura</Typography>
            </Box>
          </Box>
        </Paper>
      </Card>
    </Box>
  );
};

export default MapaCobertura;