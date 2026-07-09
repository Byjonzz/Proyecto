import React, { useState, useEffect, useRef } from 'react';
import {
  Box, Card, CardContent, Typography, Grid, TextField, MenuItem,
  Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Chip, Avatar, IconButton, Tooltip, Stack, Alert, InputAdornment, Divider,
  CircularProgress, Autocomplete
} from '@mui/material';
import { 
  AddLocationAlt, SaveOutlined, LayersOutlined, 
  DeleteOutlined, MyLocation, RouteOutlined, SearchOutlined,
  UndoOutlined
} from '@mui/icons-material';

import { MapContainer, TileLayer, Marker, Polyline, GeoJSON, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { GeoSearchControl, LocationIQProvider } from 'leaflet-geosearch';

const createCustomIcon = (color) => new L.DivIcon({
  className: 'custom-icon',
  html: `<div style="background-color: ${color}; width: 14px; height: 14px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 4px rgba(0,0,0,0.5);"></div>`,
  iconSize: [14, 14],
  iconAnchor: [7, 7]
});
const iconInicio = createCustomIcon('#10b981');
const iconPunto = createCustomIcon('#3b82f6');
const iconDestino = createCustomIcon('#f43f5e');

const API_RUTAS_URL = '/rutas_canvaceadores/';
const API_USUARIOS_URL = '/usuarios/';

const AsignacionRutas = () => {
  const [canvaceadorId, setCanvaceadorId] = useState('');
  const [busquedaColonia, setBusquedaColonia] = useState('');
  const [opcionesColonias, setOpcionesColonias] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [centroMapa, setCentroMapa] = useState([18.4628, -97.3928]);
  const [limiteColonia, setLimiteColonia] = useState(null);
  
  const [puntosRuta, setPuntosRuta] = useState([]);
  const [rutaTrazada, setRutaTrazada] = useState([]);
  
  const debounceTimerRef = useRef(null);
  
  const [canvaceadoresDisponibles, setCanvaceadoresDisponibles] = useState([]);
  const [rutasAsignadas, setRutasAsignadas] = useState([]);

  const cargarDatosIniciales = async () => {
    try {
      const responseUsuarios = await fetch(API_USUARIOS_URL);
      const usuariosData = await responseUsuarios.json();

      const canvaceadoresFiltrados = usuariosData
        .filter(usuario => usuario.rol && usuario.rol.toLowerCase() === 'canvaceador')
        .map(usuario => ({
          id: usuario.id,
          nombre: `${usuario.nombre} ${usuario.apellido || ''}`.trim()
        }));

      setCanvaceadoresDisponibles(canvaceadoresFiltrados);

      const responseRutas = await fetch(API_RUTAS_URL);
      const rutasData = await responseRutas.json();
      
      const rutasFormateadas = rutasData.map(ruta => {
        const idBuscado = ruta.canvaceador || ruta.canvaceador_id;
        const canv = canvaceadoresFiltrados.find(c => c.id === idBuscado);
        
        let puntosMarcados = 0;
        if (ruta.camino_trazado && ruta.camino_trazado.includes('LINESTRING')) {
          puntosMarcados = ruta.camino_trazado.split(',').length;
        }
        
        return {
          id: ruta.id,
          canvaceador: canv ? canv.nombre : `Desconocido (ID: ${idBuscado})`,
          zona: ruta.zona_asignada,
          puntosMarcados: puntosMarcados,
          estado: ruta.estado
        };
      });
      
      setRutasAsignadas(rutasFormateadas);
    } catch (error) {
      console.error('Error de conexión al cargar datos:', error);
    }
  };

  useEffect(() => {
    cargarDatosIniciales();
  }, []);
  
  const buscarConNominatim = async (query) => {
    if (!query || query.length < 2) {
      setOpcionesColonias([]);
      return;
    }
    setLoading(true);
    try {
      const queryLimpia = query.replace(/^(colonia|col\.|fraccionamiento|fracc\.|barrio)\s+/i, '').trim();
      const searchQuery = `${queryLimpia}, Tehuacán, Puebla`;
      
      const token_locationiq = 'pk.9fa27d5eba9a709ced3f58083e83b432'; 
      const url = `https://us1.locationiq.com/v1/search.php?key=${token_locationiq}&q=${encodeURIComponent(searchQuery)}&format=json&polygon_geojson=1&addressdetails=1&countrycodes=mx`;
      
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
      
      const data = await response.json();

      if (data && data.length > 0) {
        const lugaresEncontrados = data.map(place => ({
          id: place.place_id,
          nombre: place.display_name.split(',')[0],
          direccion: place.display_name,
          lat: parseFloat(place.lat),
          lng: parseFloat(place.lon),
          geojson: place.geojson || null,
          boundingbox: place.boundingbox || null
        }));
        setOpcionesColonias(lugaresEncontrados);
      } else {
        setOpcionesColonias([]);
      }
    } catch (error) {
      console.error("Error en buscador LocationIQ:", error);
      setOpcionesColonias([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (event, value) => {
    setBusquedaColonia(value);
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    if (!value || value.length < 2) {
      setOpcionesColonias([]);
      return;
    }
    debounceTimerRef.current = setTimeout(() => buscarConNominatim(value), 400);
  };

  const handleSeleccionarColonia = (event, seleccion) => {
    if (!seleccion) {
      setLimiteColonia(null);
      return;
    }
    setCentroMapa([seleccion.lat, seleccion.lng]);
    if (seleccion.geojson) {
      setLimiteColonia(seleccion.geojson);
    } else if (seleccion.boundingbox) {
      const [south, north, west, east] = seleccion.boundingbox.map(parseFloat);
      setLimiteColonia({
        type: 'Polygon',
        coordinates: [[[west, south], [east, south], [east, north], [west, north], [west, south]]]
      });
    } else {
      const offset = 0.002;
      setLimiteColonia({
        type: 'Polygon',
        coordinates: [[[seleccion.lng - offset, seleccion.lat - offset], [seleccion.lng + offset, seleccion.lat - offset], [seleccion.lng + offset, seleccion.lat + offset], [seleccion.lng - offset, seleccion.lat + offset], [seleccion.lng - offset, seleccion.lat - offset]]]
      });
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
          setRutaTrazada(coords.map(c => [c[1], c[0]]));
        }
      }
    } catch (error) {
      console.error('Error calculando ruta:', error);
    }
  };

  useEffect(() => {
    if (Array.isArray(puntosRuta) && puntosRuta.length >= 2) {
      fetchRoute(puntosRuta);
    } else {
      setRutaTrazada([]);
    }
  }, [puntosRuta]);

  const limpiarMapa = () => {
    setPuntosRuta([]);
    setRutaTrazada([]);
  };

  const deshacerUltimoPunto = () => {
    setPuntosRuta(prev => {
      if (!Array.isArray(prev) || prev.length === 0) return [];
      const nuevosPuntos = [...prev];
      nuevosPuntos.pop(); 
      return nuevosPuntos;
    });
  };

  const handleGuardarRuta = async () => {
    const wktLineString = `LINESTRING(${puntosRuta.map(p => `${p.lng} ${p.lat}`).join(', ')})`;

    const payload = {
      zona_asignada: busquedaColonia || 'Zona sin especificar',
      modo_trazado: 'Peatonal',
      estado: 'En Progreso',
      camino_trazado: wktLineString, 
      canvaceador_id: parseInt(canvaceadorId) 
    };

    try {
      const response = await fetch(API_RUTAS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        cargarDatosIniciales();
        setCanvaceadorId('');
        setBusquedaColonia('');
        setOpcionesColonias([]);
        setLimiteColonia(null);
        limpiarMapa();
      } else {
        const errorData = await response.json();
        alert(`❌ Django rechazó los datos.\nMotivo:\n${JSON.stringify(errorData, null, 2)}`);
      }
    } catch (error) {
      alert(`Error de red o servidor caído: ${error.message}`);
    }
  };

  const MapCenterUpdater = ({ center }) => {
    const map = useMap();
    useEffect(() => {
      if (center && center.length === 2) map.flyTo(center, 16, { animate: true, duration: 1.5 });
    }, [center, map]);
    return null;
  };

  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        if (e.latlng) setPuntosRuta(prev => [...(Array.isArray(prev) ? prev : []), e.latlng]);
      }
    });
    return null;
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, width: '100%', pb: 5 }}>
      
      <Box>
        <Typography variant="h5" sx={{ fontWeight: 800, color: '#1e293b', display: 'flex', alignItems: 'center', gap: 1 }}>
          <RouteOutlined color="primary" fontSize="large" /> Ruteo Inteligente de Equipo
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Busca una colonia (el sistema buscará exclusivamente dentro de tu ciudad) y asigna la ruta peatonal.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        
        <Grid item xs={12} md={5} lg={4}>
          <Card variant="outlined" sx={{ borderRadius: 3, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', height: '100%' }}>
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
                    renderInput={(params) => {
                      const { InputProps, ...restParams } = params;
                      return (
                        <TextField
                          {...restParams}
                          placeholder="Ej. Del Valle"
                          fullWidth
                          size="small"
                          InputProps={{
                            ...InputProps,
                            endAdornment: (
                              <React.Fragment>
                                {loading ? <CircularProgress color="inherit" size={20} sx={{ mr: 1 }} /> : null}
                                {params.InputProps?.endAdornment}
                                <InputAdornment position="end">
                                  <IconButton size="small" sx={{ color: '#3b82f6' }}>
                                    <SearchOutlined />
                                  </IconButton>
                                </InputAdornment>
                              </React.Fragment>
                            ),
                          }}
                        />
                      );
                    }}
                    renderOption={(props, option) => {
                      const { key, ...optionProps } = props;
                      return (
                        <Box key={key} component="li" {...optionProps} sx={{ '&:hover': { backgroundColor: '#f5f5f5' } }}>
                          <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>{option.nombre}</Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {option.direccion}
                            </Typography>
                          </Box>
                        </Box>
                      );
                    }}
                    noOptionsText={busquedaColonia.length >= 2 ? "No se encontraron colonias" : "Escribe al menos 2 caracteres"}
                  />
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
                    value={canvaceadorId} 
                    onChange={(e) => setCanvaceadorId(e.target.value)}
                  >
                    {canvaceadoresDisponibles.length === 0 ? (
                      <MenuItem disabled value="">Cargando canvaceadores...</MenuItem>
                    ) : (
                      canvaceadoresDisponibles.map((canv) => (
                        <MenuItem key={canv.id} value={canv.id}>{canv.nombre}</MenuItem>
                      ))
                    )}
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
                  disabled={!Array.isArray(puntosRuta) || puntosRuta.length < 2 || !canvaceadorId} 
                  onClick={handleGuardarRuta} 
                  sx={{ py: 1.5, fontWeight: 700, textTransform: 'none', fontSize: '1rem' }}
                >
                  Guardar y Asignar Ruta
                </Button>

                <Alert severity="info" sx={{ '& .MuiAlert-message': { fontSize: '0.75rem' } }}>
                  El motor calculará automáticamente el camino peatonal utilizando calles y accesos oficiales.
                </Alert>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={5} lg={8}>
          <Card variant="outlined" sx={{ borderRadius: 3, border: '1px solid #cbd5e1', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', height: '100%' }}>
            
            <Box sx={{ p: 2, backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#334155', display: 'flex', alignItems: 'center', gap: 1 }}>
                <MyLocation fontSize="small" color="primary" /> Lienzo de Trazado
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Tooltip title="Deshacer último punto trazado">
                  <span>
                    <IconButton size="small" color="warning" onClick={deshacerUltimoPunto} disabled={!Array.isArray(puntosRuta) || puntosRuta.length === 0} sx={{ bgcolor: 'rgba(245, 158, 11, 0.1)' }}>
                      <UndoOutlined fontSize="small" />
                    </IconButton>
                  </span>
                </Tooltip>
                <Tooltip title="Borrar toda la ruta">
                  <span>
                    <IconButton size="small" color="error" onClick={limpiarMapa} disabled={!Array.isArray(puntosRuta) || puntosRuta.length === 0} sx={{ bgcolor: 'rgba(239, 68, 68, 0.1)' }}>
                      <DeleteOutlined fontSize="small" />
                    </IconButton>
                  </span>
                </Tooltip>
              </Box>
            </Box>
            
            <Box sx={{ width: 900, height: { xs: 400, md: 600 }, position: 'relative' }}>
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
                  />
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
        </Grid>
      </Grid>

      <Box sx={{ width: '100%' }}>
        <Card variant="outlined" sx={{ borderRadius: 3, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
          <CardContent sx={{ p: 0 }}>
            <Box sx={{ p: 2, px: 3, backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#475569', display: 'flex', alignItems: 'center', gap: 1 }}>
                <LayersOutlined color="secondary" fontSize="small" /> Historial de Rutas Activas
              </Typography>
            </Box>
            
            <TableContainer sx={{ maxHeight: 400 }}>
              <Table stickyHeader size="medium">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600, color: '#64748b', backgroundColor: '#fff' }}>Canvaceador Asignado</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#64748b', backgroundColor: '#fff' }}>Zona / Colonia</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 600, color: '#64748b', backgroundColor: '#fff' }}>Total de Puntos</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 600, color: '#64748b', backgroundColor: '#fff' }}>Estado Operativo</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {!Array.isArray(rutasAsignadas) || rutasAsignadas.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} align="center" sx={{ py: 5, color: '#94a3b8' }}>
                        <Typography variant="body2">Aún no hay rutas registradas en el servidor.</Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    rutasAsignadas.map((ruta) => (
                      <TableRow key={ruta.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Avatar sx={{ width: 32, height: 32, fontSize: '0.9rem', bgcolor: '#e0e7ff', color: '#4338ca' }}>
                              {ruta.canvaceador.charAt(0)}
                            </Avatar>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: '#1e293b' }}>
                              {ruta.canvaceador}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell sx={{ color: '#475569', fontSize: '0.9rem' }}>
                          {ruta.zona}
                        </TableCell>
                        <TableCell align="center">
                          <Chip 
                            label={`${ruta.puntosMarcados} Destinos`} 
                            size="small" 
                            variant="outlined" 
                            sx={{ fontWeight: 600, color: '#3b82f6', borderColor: '#bfdbfe' }} 
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Chip 
                            label={ruta.estado} 
                            size="small" 
                            color={ruta.estado === 'En Progreso' ? 'primary' : 'success'} 
                            sx={{ fontWeight: 600, fontSize: '0.75rem' }} 
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
      </Box>

    </Box>
  );
};

export default AsignacionRutas;