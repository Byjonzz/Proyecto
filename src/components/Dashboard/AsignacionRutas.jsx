import React, { useState, useEffect, useRef } from 'react';
import {
  Box, Card, CardContent, Typography, Grid, TextField, MenuItem,
  Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Chip, Avatar, IconButton, Tooltip, Stack, Alert, InputAdornment, Divider,
  CircularProgress, Autocomplete
} from '@mui/material';
import { 
  AddLocationAlt, SaveOutlined, LayersOutlined, 
  DeleteOutlined, MyLocation, RouteOutlined, SearchOutlined
} from '@mui/icons-material';

import { MapContainer, TileLayer, Marker, Polyline, GeoJSON, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Íconos personalizados
const createCustomIcon = (color) => new L.DivIcon({
  className: 'custom-icon',
  html: `<div style="background-color: ${color}; width: 14px; height: 14px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 4px rgba(0,0,0,0.5);"></div>`,
  iconSize: [14, 14],
  iconAnchor: [7, 7]
});
const iconInicio = createCustomIcon('#10b981');
const iconPunto = createCustomIcon('#3b82f6');
const iconDestino = createCustomIcon('#f43f5e');

const AsignacionRutas = () => {
  const [canvaceador, setCanvaceador] = useState('');
  const [busquedaColonia, setBusquedaColonia] = useState('');
  const [opcionesColonias, setOpcionesColonias] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [centroMapa, setCentroMapa] = useState([18.4628, -97.3928]);
  const [limiteColonia, setLimiteColonia] = useState(null);
  
  const [puntosRuta, setPuntosRuta] = useState([]);
  const [rutaTrazada, setRutaTrazada] = useState([]);
  
  const debounceTimerRef = useRef(null);
  const canvaceadoresDisponibles = ['Jonathan Alexis Alta Bravo', 'Ana Gómez', 'Luis Pérez', 'Carlos Ruiz'];

  const [rutasAsignadas, setRutasAsignadas] = useState([
    { id: 1, canvaceador: 'Jonathan Alexis Alta Bravo', zona: 'Centro, Tehuacán', puntosMarcados: 4, estado: 'En Progreso' }
  ]);

  // ============================================================
  // 🔍 BÚSQUEDA CON NOMINATIM (OpenStreetMap)
  // ============================================================
  const buscarConNominatim = async (query) => {
    if (!query || query.length < 2) {
      setOpcionesColonias([]);
      return;
    }

    setLoading(true);
    
    try {
      const searchQuery = `${query}, Tehuacán, Puebla, México`;
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=8&polygon_geojson=1&addressdetails=1`;
      
      console.log('Buscando:', url);
      
      const response = await fetch(url, {
        headers: {
          'Accept-Language': 'es'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Resultados de Nominatim:', data);

      if (data && data.length > 0) {
        const lugaresEncontrados = data.map(place => ({
          id: place.place_id,
          nombre: place.display_name.split(',')[0],
          direccion: place.display_name,
          lat: parseFloat(place.lat),
          lng: parseFloat(place.lon),
          tipo: place.type || place.class || 'Lugar',
          geojson: place.geojson || null,
          boundingbox: place.boundingbox || null
        }));
        
        console.log('Lugares procesados:', lugaresEncontrados);
        setOpcionesColonias(lugaresEncontrados);
      } else {
        console.log('No se encontraron resultados');
        setOpcionesColonias([]);
      }
    } catch (error) {
      console.error('Error con Nominatim:', error);
      setOpcionesColonias([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (event, value) => {
    setBusquedaColonia(value);
    
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    if (!value || value.length < 2) {
      setOpcionesColonias([]);
      return;
    }
    
    debounceTimerRef.current = setTimeout(() => {
      buscarConNominatim(value);
    }, 400);
  };

  const handleSeleccionarColonia = (event, seleccion) => {
    if (!seleccion) {
      setLimiteColonia(null);
      return;
    }

    console.log('Colonia seleccionada:', seleccion);
    setCentroMapa([seleccion.lat, seleccion.lng]);
    
    if (seleccion.geojson) {
      setLimiteColonia(seleccion.geojson);
    } else if (seleccion.boundingbox) {
      const [south, north, west, east] = seleccion.boundingbox.map(parseFloat);
      const rectangulo = {
        type: 'Polygon',
        coordinates: [[
          [west, south],
          [east, south],
          [east, north],
          [west, north],
          [west, south]
        ]]
      };
      setLimiteColonia(rectangulo);
    } else {
      const offset = 0.002;
      const rectangulo = {
        type: 'Polygon',
        coordinates: [[
          [seleccion.lng - offset, seleccion.lat - offset],
          [seleccion.lng + offset, seleccion.lat - offset],
          [seleccion.lng + offset, seleccion.lat + offset],
          [seleccion.lng - offset, seleccion.lat + offset],
          [seleccion.lng - offset, seleccion.lat - offset]
        ]]
      };
      setLimiteColonia(rectangulo);
    }
  };

  const fetchRoute = async (puntos) => {
    if (!Array.isArray(puntos) || puntos.length < 2) return;

    const coordenadasUrl = puntos.map(p => `${p.lng},${p.lat}`).join(';');

    let url = `https://routing.openstreetmap.de/routed-foot/route/v1/foot/${coordenadasUrl}?overview=full&geometries=geojson`;

    try {
      let response = await fetch(url);

      if (!response.ok) {
        url = `https://router.project-osrm.org/route/v1/foot/${coordenadasUrl}?overview=full&geometries=geojson&continue_straight=false`;
        response = await fetch(url);
      }

      const data = await response.json();

      if (data && data.routes && data.routes.length > 0) {
        const coords = data.routes[0]?.geometry?.coordinates;
        if (coords && Array.isArray(coords)) {
          const coordenadasCamino = coords.map(c => [c[1], c[0]]);
          setRutaTrazada(coordenadasCamino);
        }
      }
    } catch (error) {
      console.error("Error al calcular la ruta peatonal:", error);
    }
  };

  useEffect(() => {
    if (Array.isArray(puntosRuta) && puntosRuta.length >= 2) {
      fetchRoute(puntosRuta);
    }
  }, [puntosRuta]);

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  const limpiarMapa = () => {
    setPuntosRuta([]);
    setRutaTrazada([]);
  };

  const handleGuardarRuta = () => {
    const nuevaRuta = {
      id: rutasAsignadas.length + 1,
      canvaceador,
      zona: busquedaColonia || 'Zona sin especificar',
      puntosMarcados: Array.isArray(puntosRuta) ? puntosRuta.length : 0,
      estado: 'Asignada'
    };

    setRutasAsignadas([nuevaRuta, ...rutasAsignadas]);
    setCanvaceador('');
    setBusquedaColonia('');
    setOpcionesColonias([]);
    setLimiteColonia(null);
    limpiarMapa();
  };

  const MapCenterUpdater = ({ center }) => {
    const map = useMap();
    useEffect(() => {
      if (center && center.length === 2) {
        map.flyTo(center, 16, { animate: true, duration: 1.5 });
      }
    }, [center, map]);
    return null;
  };

  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        if (e.latlng) {
          setPuntosRuta(prev => [...(Array.isArray(prev) ? prev : []), e.latlng]);
        }
      }
    });
    return null;
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, width: '100%' }}>
      
      <Box>
        <Typography variant="h5" sx={{ fontWeight: 800, color: '#1e293b', display: 'flex', alignItems: 'center', gap: 1 }}>
          <RouteOutlined color="primary" fontSize="large" /> Ruteo Inteligente de Equipo
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Busca una colonia (el sistema buscará exclusivamente dentro de tu ciudad) y asigna la ruta peatonal.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        
        <Grid item xs={12} md={4}>
          <Card variant="outlined" sx={{ borderRadius: 3, position: 'sticky', top: 20 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1e293b', display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <AddLocationAlt color="primary" /> Configurar Ruta Diaria
              </Typography>

              <Stack spacing={3}>
                
                <Box>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: '#475569', mb: 1, display: 'block' }}>
                    1. Buscar Colonia
                  </Typography>
                  <Autocomplete
                    freeSolo
                    options={opcionesColonias}
                    getOptionLabel={(option) => typeof option === 'string' ? option : option.nombre}
                    loading={loading}
                    value={busquedaColonia}
                    onInputChange={handleInputChange}
                    onChange={handleSeleccionarColonia}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="Ej. Del Valle"
                        fullWidth
                        size="small"
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <>
                              {loading ? <CircularProgress color="inherit" size={20} sx={{ mr: 1 }} /> : null}
                              <InputAdornment position="end">
                                <IconButton size="small" sx={{ color: '#3b82f6' }}>
                                  <SearchOutlined />
                                </IconButton>
                              </InputAdornment>
                            </>
                          ),
                        }}
                      />
                    )}
                    renderOption={(props, option) => (
                      <Box component="li" {...props} sx={{ '&:hover': { backgroundColor: '#f5f5f5' } }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {option.nombre}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {option.direccion}
                          </Typography>
                        </Box>
                      </Box>
                    )}
                    noOptionsText={busquedaColonia.length >= 2 ? "No se encontraron colonias" : "Escribe al menos 2 caracteres"}
                  />
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                    * El buscador está restringido automáticamente a tu ciudad.
                  </Typography>
                </Box>

                <Divider sx={{ borderStyle: 'dashed' }} />

                <Box>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: '#475569', mb: 1, display: 'block' }}>
                    2. Seleccionar Responsable
                  </Typography>
                  <TextField 
                    select 
                    fullWidth 
                    size="small"
                    value={canvaceador} 
                    onChange={(e) => setCanvaceador(e.target.value)}
                  >
                    {canvaceadoresDisponibles.map((nombre, i) => (
                      <MenuItem key={i} value={nombre}>{nombre}</MenuItem>
                    ))}
                  </TextField>
                </Box>

                <Box sx={{ 
                  p: 1.5, border: '1px solid', borderColor: Array.isArray(puntosRuta) && puntosRuta.length > 0 ? '#bfdbfe' : '#e2e8f0', 
                  borderRadius: 2, backgroundColor: Array.isArray(puntosRuta) && puntosRuta.length > 0 ? '#eff6ff' : '#f8fafc',
                  textAlign: 'center', transition: 'all 0.3s'
                }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: Array.isArray(puntosRuta) && puntosRuta.length > 0 ? '#1d4ed8' : '#64748b' }}>
                    Destinos marcados en mapa: {Array.isArray(puntosRuta) ? puntosRuta.length : 0}
                  </Typography>
                </Box>

                <Button 
                  variant="contained" 
                  color="primary" 
                  fullWidth 
                  startIcon={<SaveOutlined />}
                  disabled={!Array.isArray(puntosRuta) || puntosRuta.length < 2 || !canvaceador} 
                  onClick={handleGuardarRuta} 
                  sx={{ py: 1.5, fontWeight: 700 }}
                >
                  GUARDAR Y ASIGNAR RUTA
                </Button>

                <Alert severity="info" sx={{ '& .MuiAlert-message': { fontSize: '0.75rem' } }}>
                  El motor calculará el camino peatonal más corto dentro de la colonia seleccionada, utilizando sus vías y accesos oficiales.
                </Alert>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Stack spacing={3}>

            <Card variant="outlined" sx={{ borderRadius: 3, border: '2px solid #3b82f6', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
              <Box sx={{ p: 2, backgroundColor: '#eff6ff', borderBottom: '1px solid #bfdbfe', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1e3a8a', display: 'flex', alignItems: 'center', gap: 1 }}>
                  <MyLocation fontSize="small" /> Trazado de Ruta Peatonal
                </Typography>
                <Tooltip title="Borrar trazo actual">
                  <span>
                    <IconButton 
                      size="small" 
                      color="error" 
                      onClick={limpiarMapa} 
                      disabled={!Array.isArray(puntosRuta) || puntosRuta.length === 0}
                    >
                      <DeleteOutlined />
                    </IconButton>
                  </span>
                </Tooltip>
              </Box>
              
              <Box sx={{ width: '100%', height: 480, position: 'relative' }}>
                <MapContainer 
                  center={centroMapa} 
                  zoom={15} 
                  style={{ width: '100%', height: '100%', zIndex: 1, cursor: 'crosshair' }} 
                  scrollWheelZoom={true}
                >
                  <TileLayer 
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>' 
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" 
                  />
                  <MapCenterUpdater center={centroMapa} />
                  <MapClickHandler />

                  {limiteColonia && (
                    <GeoJSON 
                      key={JSON.stringify(limiteColonia)}
                      data={limiteColonia} 
                      style={{ color: '#8b5cf6', weight: 3, fillColor: '#8b5cf6', fillOpacity: 0.15 }}
                    >
                      <Tooltip sticky>Límites de la Colonia</Tooltip>
                    </GeoJSON>
                  )}

                  {Array.isArray(rutaTrazada) && rutaTrazada.length > 0 && (
                    <Polyline positions={rutaTrazada} color="#3b82f6" weight={6} opacity={0.8} />
                  )}

                  {Array.isArray(puntosRuta) && puntosRuta.map((pos, idx) => {
                    let iconToUse = iconPunto;
                    if (idx === 0) iconToUse = iconInicio; 
                    if (idx === puntosRuta.length - 1 && puntosRuta.length > 1) iconToUse = iconDestino; 
                    return <Marker key={idx} position={pos} icon={iconToUse} />;
                  })}
                </MapContainer>

                {(!Array.isArray(puntosRuta) || puntosRuta.length === 0) && (
                  <Box sx={{ position: 'absolute', top: 20, left: '50%', transform: 'translateX(-50%)', backgroundColor: 'rgba(255,255,255,0.95)', px: 3, py: 1.5, borderRadius: 3, pointerEvents: 'none', boxShadow: '0 4px 10px rgba(0,0,0,0.15)', zIndex: 1000 }}>
                    <Typography variant="body2" sx={{ color: '#334155', fontWeight: 700, textAlign: 'center' }}>
                      Haz clics en las calles para crear la ruta peatonal
                    </Typography>
                  </Box>
                )}
              </Box>
            </Card>

            <Card variant="outlined" sx={{ borderRadius: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#475569', display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <LayersOutlined color="secondary" /> Historial de Rutas Activas
                </Typography>
                
                <TableContainer>
                  <Table size="small">
                    <TableHead sx={{ backgroundColor: '#f8fafc' }}>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 600, color: '#64748b' }}>Canvaceador</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: '#64748b' }}>Zona / Colonia</TableCell>
                        <TableCell align="center" sx={{ fontWeight: 600, color: '#64748b' }}>Puntos Asignados</TableCell>
                        <TableCell align="center" sx={{ fontWeight: 600, color: '#64748b' }}>Estado</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {!Array.isArray(rutasAsignadas) || rutasAsignadas.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={4} align="center" sx={{ py: 3, color: '#94a3b8' }}>
                            No hay rutas asignadas aún.
                          </TableCell>
                        </TableRow>
                      ) : (
                        rutasAsignadas.map((ruta) => (
                          <TableRow key={ruta.id} hover>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <Avatar sx={{ width: 28, height: 28, fontSize: '0.8rem', bgcolor: '#e2e8f0', color: '#475569' }}>
                                  {ruta.canvaceador.charAt(0)}
                                </Avatar>
                                <Typography variant="body2" sx={{ fontWeight: 600, color: '#334155' }}>
                                  {ruta.canvaceador}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell sx={{ color: '#475569', fontSize: '0.85rem' }}>
                              {ruta.zona}
                            </TableCell>
                            <TableCell align="center">
                              <Chip 
                                label={`${ruta.puntosMarcados} Destinos`} 
                                size="small" 
                                variant="outlined" 
                                sx={{ fontWeight: 600 }} 
                              />
                            </TableCell>
                            <TableCell align="center">
                              <Chip 
                                label={ruta.estado} 
                                size="small" 
                                color={ruta.estado === 'En Progreso' ? 'primary' : 'success'} 
                                sx={{ fontWeight: 600, fontSize: '0.7rem', height: 20 }} 
                              />
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>

          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AsignacionRutas;