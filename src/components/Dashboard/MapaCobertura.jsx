import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Box, Typography, Card, Paper, FormControlLabel, Checkbox, 
  Autocomplete, TextField, CircularProgress, InputAdornment 
} from '@mui/material';
import { SearchOutlined, LocationOn } from '@mui/icons-material';
import { MapContainer, TileLayer, GeoJSON, ZoomControl, CircleMarker, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import * as turf from '@turf/turf'; 

import api from '../../services/api';

const MapController = ({ center, bounds }) => {
  const map = useMap();
  useEffect(() => {
    if (bounds) {
      map.fitBounds(bounds, { animate: true, duration: 1.5 });
    } else if (center) {
      map.flyTo(center, 15, { animate: true, duration: 1.5 });
    }
  }, [center, bounds, map]);
  return null;
};

const FixMapSize = () => {
  const map = useMap();
  useEffect(() => {
    const timer = setTimeout(() => map.invalidateSize(), 400);
    return () => clearTimeout(timer);
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

  const [googleCargado, setGoogleCargado] = useState(false);
  const [cargandoGoogle, setCargandoGoogle] = useState(false);
  const [inputValue, setInputValue] = useState('');
  
  const [lugarSeleccionado, setLugarSeleccionado] = useState(null);
  
  const [opcionesLugares, setOpcionesLugares] = useState([]);
  const [loadingBusqueda, setLoadingBusqueda] = useState(false);
  const debounceTimerRef = useRef(null);
  
  const [centroMapa, setCentroMapa] = useState([18.4628, -97.3928]);
  const [limitesMapa, setLimitesMapa] = useState(null);

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
        console.error('Error al obtener cajas de la API:', error);
      }
    };
    
    obtenerCajas();
    return () => { montado = false; };
  }, []);

  const iniciarGoogleMaps = async () => {
    if (window.google?.maps?.importLibrary || googleCargado || cargandoGoogle) return;
    setCargandoGoogle(true);

    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    (g=>{var h,a,k,p="The Google Maps JavaScript API",c="google",l="importLibrary",q="__ib__",m=document,b=window;b=b[c]||(b[c]={});var d=b.maps||(b.maps={}),r=new Set,e=new URLSearchParams,u=()=>h||(h=new Promise(async(f,n)=>{await (a=m.createElement("script"));e.set("libraries",[...r]+"");for(k in g)e.set(k.replace(/[A-Z]/g,t=>"_"+t[0].toLowerCase()),g[k]);e.set("callback",c+".maps."+q);a.src=`https://maps.${c}apis.com/maps/api/js?`+e;d[q]=f;a.onerror=()=>h=n(Error(p+" could not load."));a.nonce=m.querySelector("script[nonce]")?.nonce||"";m.head.append(a)}));d[l]?console.warn(p+" only loads once. Ignoring:",g):d[l]=(f,...n)=>r.add(f)&&u().then(()=>d[l](f,...n))})({
      key: apiKey,
      v: "weekly"
    });

    try {
      await window.google.maps.importLibrary("places");
      await window.google.maps.importLibrary("geocoding");
      setGoogleCargado(true);
    } catch (error) {
      console.error("Error al cargar Google Maps:", error);
    } finally {
      setCargandoGoogle(false);
    }
  };

  const buscarLugar = async (query) => {
    if (!query || !window.google?.maps) return;
    setLoadingBusqueda(true);

    try {
      const { AutocompleteSuggestion } = await window.google.maps.importLibrary("places");
      const request = {
        input: query,
        includedRegionCodes: ["MX"], 
        locationBias: {
          center: { lat: 18.4628, lng: -97.3928 }, 
          radius: 15000 
        }
      };

      const { suggestions } = await AutocompleteSuggestion.fetchAutocompleteSuggestions(request);

      if (suggestions && suggestions.length > 0) {
        const lugaresEncontrados = suggestions
          .filter(s => s.placePrediction)
          .map(s => {
            const prediction = s.placePrediction;
            return {
              id: prediction.placeId,
              nombre: prediction.mainText.text, 
              direccion: prediction.secondaryText ? prediction.secondaryText.text : prediction.text.text, 
              placeId: prediction.placeId
            };
          });
        setOpcionesLugares(lugaresEncontrados);
      } else {
        setOpcionesLugares([]);
      }
    } catch (error) {
      setOpcionesLugares([]);
    } finally {
      setLoadingBusqueda(false);
    }
  };

  const handleInputChange = (event, newInputValue) => {
    setInputValue(newInputValue);
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    if (!newInputValue || newInputValue.length < 2) {
      setOpcionesLugares([]);
      return;
    }
    debounceTimerRef.current = setTimeout(() => buscarLugar(newInputValue), 700);
  };

  const handleSeleccionarLugar = async (event, placeSeleccionado) => {
    setLugarSeleccionado(placeSeleccionado);
    
    if (!placeSeleccionado) return;
    try {
      const { Geocoder } = await window.google.maps.importLibrary("geocoding");
      const geocoder = new Geocoder();
      
      geocoder.geocode({ placeId: placeSeleccionado.placeId }, (results, status) => {
        if (status === 'OK' && results[0]) {
          const { location, viewport } = results[0].geometry;
          if (viewport) {
            const ne = viewport.getNorthEast();
            const sw = viewport.getSouthWest();
            setLimitesMapa([[sw.lat(), sw.lng()], [ne.lat(), ne.lng()]]);
          } else {
            setCentroMapa([location.lat(), location.lng()]);
            setLimitesMapa(null);
          }
        }
      });
    } catch (error) {
      console.error("Error geocodificando el lugar:", error);
    }
  };

  const renderCajasActivas = useMemo(() => {
    if (!verActivas) return null;
    return cajasActivas.map((caja, idx) => (
      <CircleMarker 
        key={`act-${idx}`} 
        center={[parseFloat(caja.lat), parseFloat(caja.lng)]} 
        radius={5} 
        pathOptions={{ color: '#16a34a', fillColor: '#22c55e', fillOpacity: 1, weight: 2 }}
        eventHandlers={{
          click: (e) => e.target.bindPopup(`<b>${caja.name}</b><br/>✅ Caja Activa`).openPopup()
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
          click: (e) => e.target.bindPopup(`<b>${caja.name}</b><br/>❌ Caja Pendiente`).openPopup()
        }}
      />
    ));
  }, [verInactivas, cajasInactivas]);

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

      <Paper variant="outlined" sx={{ p: '8px 16px', mb: 2, borderRadius: 2, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'flex-start', sm: 'center' }, gap: { xs: 1, sm: 3 }, backgroundColor: '#f8fafc' }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#475569' }}>Capas Visibles:</Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: { xs: 0.5, sm: 2 } }}>
          <FormControlLabel control={<Checkbox size="small" checked={verCobertura} onChange={(e) => setVerCobertura(e.target.checked)} />} label={<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><Box sx={{ width: 14, height: 14, borderRadius: 0.5, bgcolor: '#3b82f6', opacity: 0.6, flexShrink: 0 }} /><Typography variant="body2" sx={{ fontWeight: 600, color: '#334155' }}>Zona con Cobertura</Typography></Box>} />
          <FormControlLabel control={<Checkbox size="small" color="success" checked={verActivas} onChange={(e) => setVerActivas(e.target.checked)} />} label={<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#22c55e', border: '2px solid #16a34a', flexShrink: 0 }} /><Typography variant="body2" sx={{ fontWeight: 600, color: '#334155' }}>Cajas Activas (Verdes)</Typography></Box>} />
          <FormControlLabel control={<Checkbox size="small" color="error" checked={verInactivas} onChange={(e) => setVerInactivas(e.target.checked)} />} label={<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#ef4444', border: '2px solid #dc2626', flexShrink: 0 }} /><Typography variant="body2" sx={{ fontWeight: 600, color: '#334155' }}>Cajas Inactivas (Rojas)</Typography></Box>} />
        </Box>
      </Paper>

      <Box sx={{ position: 'relative', width: '100%', height: { xs: 500, md: 'calc(100vh - 220px)' }, minHeight: 500 }}>
        
        <Box sx={{ position: 'absolute', top: 20, left: '50%', transform: 'translateX(-50%)', zIndex: 1000, width: { xs: '90%', sm: 400 } }}>
          <Paper elevation={4} sx={{ borderRadius: 8, overflow: 'hidden' }}>
            <Autocomplete
              freeSolo
              options={opcionesLugares}
              filterOptions={(x) => x} 
              getOptionLabel={(option) => typeof option === 'string' ? option : option.nombre}
              loading={loadingBusqueda}
              value={lugarSeleccionado}
              onChange={handleSeleccionarLugar}
              inputValue={inputValue}
              onInputChange={handleInputChange}
              disabled={cargandoGoogle}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder={cargandoGoogle ? "Despertando buscador..." : "Buscar colonia o dirección..."}
                  fullWidth
                  variant="outlined"
                  onFocus={iniciarGoogleMaps}
                  onPointerEnter={iniciarGoogleMaps}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      paddingRight: '12px !important', backgroundColor: '#fff', borderRadius: 8,
                      '& fieldset': { border: 'none' }, 
                    }
                  }}
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: (
                      <InputAdornment position="start" sx={{ pl: 1 }}>
                        <SearchOutlined sx={{ color: '#64748b' }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <React.Fragment>
                        {loadingBusqueda || cargandoGoogle ? <CircularProgress color="inherit" size={20} /> : null}
                        {params.InputProps?.endAdornment}
                      </React.Fragment>
                    ),
                  }}
                />
              )}
              renderOption={(props, option) => {
                const { key, ...optionProps } = props;
                return (
                  <Box key={key} component="li" {...optionProps} sx={{ '&:hover': { backgroundColor: '#f5f5f5' } }}>
                    <LocationOn sx={{ color: '#94a3b8', mr: 2, fontSize: 20 }} />
                    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: '#0f172a' }}>{option.nombre}</Typography>
                      <Typography variant="caption" sx={{ color: '#64748b' }}>{option.direccion}</Typography>
                    </Box>
                  </Box>
                );
              }}
              noOptionsText={inputValue.length >= 2 ? "No se encontraron resultados" : "Escribe al menos 2 caracteres"}
            />
          </Paper>
        </Box>

        <Card variant="outlined" sx={{ width: '100%', height: '100%', borderRadius: 3, overflow: 'hidden' }}>
          <MapContainer center={centroMapa} zoom={14} zoomControl={false} style={{ height: '100%', width: '100%', zIndex: 0 }} preferCanvas={true}>
            <TileLayer url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}" attribution='&copy; Google Maps' />
            <MapController center={centroMapa} bounds={limitesMapa} />
            <FixMapSize />
            {verCobertura && poligonoCobertura && (<GeoJSON key={`cobertura-v-${coberturaVersion}`} data={poligonoCobertura} style={{ color: '#3b82f6', weight: 2, fillColor: '#3b82f6', fillOpacity: 0.25 }} />)}
            {renderCajasActivas}
            {renderCajasInactivas}
            <ZoomControl position="bottomright" />
          </MapContainer>
        </Card>
      </Box>
    </Box>
  );
};

export default MapaCobertura;