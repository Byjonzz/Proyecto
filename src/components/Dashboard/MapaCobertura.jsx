import React, { useState, useEffect, useMemo } from 'react';
import { Box, Typography, Card, Paper, FormControlLabel, Checkbox } from '@mui/material';
import { MapContainer, TileLayer, GeoJSON, ZoomControl, CircleMarker, useMap } from 'react-leaflet';
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
  const [coberturaVersion, setCoberturaVersion] = useState(0);

  const [verActivas, setVerActivas] = useState(false);
  const [verCobertura, setVerCobertura] = useState(true);
  const [verInactivas, setVerInactivas] = useState(false); 

  useEffect(() => {
    let montado = true;

    const obtenerCajas = async () => {
      try {
        const response = await api.get('/cajas_distribucion/');
        if (!montado) return;
        
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
          setCoberturaVersion(prev => prev + 1);
        } else {
          setPoligonoCobertura(null);
        }

      } catch (error) {
        console.error('Error al obtener cajas de la API:f', error);
      }
    };

    const timer = setTimeout(() => {
      obtenerCajas();
    }, 1000); 

    return () => {
      montado = false;
      clearTimeout(timer);
    };
  }, []);

  const renderCajasActivas = useMemo(() => {
    if (!verActivas) return null;
    return cajasActivas.map((caja, idx) => (
      <CircleMarker 
        key={`act-${idx}`} 
        center={[parseFloat(caja.lat), parseFloat(caja.lng)]} 
        radius={5} 
        pathOptions={{ color: '#16a34a', fillColor: '#22c55e', fillOpacity: 1, weight: 2 }}
        eventHandlers={{
          click: (e) => {
            e.target.bindPopup(`<b>${caja.name}</b><br/>✅ Caja Activa`).openPopup();
          }
        }}
      />
    ));
  }, [verActivas, cajasActivas]);

  const renderCajasInactivas = useMemo(() => {
    if (!verInactivas) return null;
    return cajasInactivas.map((caja, idx) => (
      <CircleMarker 
        key={`inact-${idx}`} 
        center={[parseFloat(caja.lat), parseFloat(caja.lng)]} 
        radius={5} 
        pathOptions={{ color: '#dc2626', fillColor: '#ef4444', fillOpacity: 1, weight: 2 }}
        eventHandlers={{
          click: (e) => {
            e.target.bindPopup(`<b>${caja.name}</b><br/>❌ Caja Pendiente`).openPopup();
          }
        }}
      />
    ));
  }, [verInactivas, cajasInactivas]);

  const centroTehuacan = [18.4628, -97.3928];

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: '#1e293b' }}>
          Mapa de Cobertura
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Visualiza zonas con factibilidad en Tehuacán en tiempo real.
        </Typography>
      </Box>

      <Paper 
        variant="outlined" 
        sx={{ 
          p: '8px 16px', 
          mb: 2, 
          borderRadius: 2, 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' }, 
          alignItems: { xs: 'flex-start', sm: 'center' }, 
          gap: { xs: 1, sm: 3 },
          backgroundColor: '#f8fafc'
        }}
      >
        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#475569' }}>
          Capas Visibles:
        </Typography>
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: { xs: 0.5, sm: 2 } }}>
          <FormControlLabel
            control={<Checkbox size="small" checked={verCobertura} onChange={(e) => setVerCobertura(e.target.checked)} />}
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 14, height: 14, borderRadius: 0.5, bgcolor: '#3b82f6', opacity: 0.6, flexShrink: 0 }} />
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#334155' }}>Zona con Cobertura</Typography>
              </Box>
            }
          />

          <FormControlLabel
            control={<Checkbox size="small" color="success" checked={verActivas} onChange={(e) => setVerActivas(e.target.checked)} />}
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#22c55e', border: '2px solid #16a34a', flexShrink: 0 }} />
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#334155' }}>Cajas Activas (Verdes)</Typography>
              </Box>
            }
          />

          <FormControlLabel
            control={<Checkbox size="small" color="error" checked={verInactivas} onChange={(e) => setVerInactivas(e.target.checked)} />}
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#ef4444', border: '2px solid #dc2626', flexShrink: 0 }} />
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#334155' }}>Cajas Pendientes (Rojas)</Typography>
              </Box>
            }
          />
        </Box>
      </Paper>

      <Card variant="outlined" sx={{ 
        width: '100%', 
        height: { xs: 500, md: 'calc(100vh - 220px)' }, 
        minHeight: 500, 
        position: 'relative', 
        borderRadius: 3, 
        overflow: 'hidden' 
      }}>
        
        <MapContainer 
          center={centroTehuacan} 
          zoom={14} 
          zoomControl={false} 
          style={{ height: '100%', width: '100%', zIndex: 0 }}
          preferCanvas={true}
        >
          <TileLayer 
            url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}" 
            attribution='&copy; Google Maps'
          />
          
          <BuscadorIntegrado />

          {verCobertura && poligonoCobertura && (
            <GeoJSON 
              key={`cobertura-v-${coberturaVersion}`} 
              data={poligonoCobertura} 
              style={{ color: '#3b82f6', weight: 2, fillColor: '#3b82f6', fillOpacity: 0.25 }} 
            />
          )}

          {renderCajasActivas}
          {renderCajasInactivas}

          <ZoomControl position="bottomright" />
        </MapContainer>
      </Card>
    </Box>
  );
};

export default MapaCobertura;