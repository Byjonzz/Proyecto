import React, { useState, useEffect } from 'react';
import {
    Box, Card, CardContent, Typography, Grid, FormControl, InputLabel,
    Select, MenuItem, Button, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, Chip, Avatar
} from '@mui/material';
import { AddLocationAlt, AssignmentInd, MapOutlined, DeleteOutlined } from '@mui/icons-material';
import { MapContainer, TileLayer, Marker, Polyline, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';

// Importamos las imágenes directamente desde node_modules para que Vite las empaquete correctamente
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Configuramos Leaflet para usar nuestras imágenes importadas
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

// Componente auxiliar para mover el mapa cuando cambia la zona seleccionada
const MapUpdater = ({ center }) => {
    const map = useMap();
    useEffect(() => {
        if (center) {
            map.flyTo(center, 15, { animate: true });
        }
    }, [center, map]);
    return null;
};

// Componente auxiliar para capturar los clics del administrador en el mapa
const MapClickHandler = ({ onMapClick }) => {
    useMapEvents({
        click(e) {
            onMapClick([e.latlng.lat, e.latlng.lng]);
        },
    });
    return null;
};

const AsignacionRutas = () => {
    const [canvaceador, setCanvaceador] = useState('');
    const [zonaId, setZonaId] = useState('');
    const [routePoints, setRoutePoints] = useState([]);

    // Datos simulados del equipo (puedes conectarlo a tu backend después)
    const canvaceadores = [
        'Jonathan Alexis Alta Bravo',
        'María de los Ángeles',
        'Luis Fernando López'
    ];

    // Coordenadas base simuladas (usando Tehuacán como referencia)
    const zonasDisponibles = [
        { id: 'z1', nombre: 'Sector A - Centro', coords: [18.4628, -97.3928] },
        { id: 'z2', nombre: 'Sector B - Norte', coords: [18.4750, -97.3900] },
        { id: 'z3', nombre: 'Fraccionamiento Las Palmas', coords: [18.4500, -97.3800] },
        { id: 'z4', nombre: 'Zona Industrial', coords: [18.4800, -97.4000] }
    ];

    const [rutasAsignadas, setRutasAsignadas] = useState([
        { id: 1, canvaceador: 'Jonathan Alexis Alta Bravo', zona: 'Fraccionamiento Las Palmas', puntos: 4, estado: 'En Progreso' },
    ]);

    // Centro por defecto al abrir la pantalla
    const defaultCenter = [18.4628, -97.3928];
    const [mapCenter, setMapCenter] = useState(defaultCenter);

    const handleZonaChange = (e) => {
        const selectedZonaId = e.target.value;
        setZonaId(selectedZonaId);

        const zonaSeleccionada = zonasDisponibles.find(z => z.id === selectedZonaId);
        if (zonaSeleccionada) {
            setMapCenter(zonaSeleccionada.coords);
        }
    };

    const handleMapClick = (latlng) => {
        if (zonaId) {
            setRoutePoints((prev) => [...prev, latlng]);
        } else {
            alert("Por favor, selecciona una zona primero para comenzar a trazar la ruta.");
        }
    };

    const handleClearRoute = () => {
        setRoutePoints([]);
    };

    const handleAsignar = () => {
        if (canvaceador && zonaId && routePoints.length > 1) {
            const zonaInfo = zonasDisponibles.find(z => z.id === zonaId);

            setRutasAsignadas([
                ...rutasAsignadas,
                {
                    id: rutasAsignadas.length + 1,
                    canvaceador,
                    zona: zonaInfo.nombre,
                    puntos: routePoints.length,
                    estado: 'Pendiente'
                }
            ]);

            setCanvaceador('');
            setZonaId('');
            setRoutePoints([]);
        } else if (routePoints.length <= 1) {
            alert("Haz clic en el mapa para trazar al menos 2 puntos para la ruta.");
        }
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Encabezado */}
            <Box>
                <Typography variant="h5" sx={{ fontWeight: 700, color: '#1e293b' }}>
                    Trazado y Asignación de Rutas
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748b', mt: 0.5 }}>
                    Selecciona una zona, dibuja la ruta haciendo clic en el mapa y asígnala al equipo de cambaceo.
                </Typography>
            </Box>

            <Grid container spacing={3}>
                {/* Formulario de Asignación */}
                <Grid item xs={12} md={4}>
                    <Card variant="outlined" sx={{ borderRadius: 3, height: '100%' }}>
                        <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
                                <AddLocationAlt color="primary" /> Configurar Ruta
                            </Typography>

                            <FormControl fullWidth size="small">
                                <InputLabel id="label-canvaceador">Canvaceador</InputLabel>
                                <Select
                                    labelId="label-canvaceador"
                                    id="select-canvaceador"
                                    value={canvaceador}
                                    label="Canvaceador"
                                    onChange={(e) => setCanvaceador(e.target.value)}
                                    MenuProps={{ disableScrollLock: true }}
                                >
                                    {canvaceadores.map((nombre, index) => (
                                        <MenuItem key={index} value={nombre}>{nombre}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <FormControl fullWidth size="small">
                                <InputLabel id="label-zona">Zona de Cobertura</InputLabel>
                                <Select
                                    labelId="label-zona"
                                    id="select-zona"
                                    value={zonaId}
                                    label="Zona de Cobertura"
                                    onChange={handleZonaChange}
                                    MenuProps={{ disableScrollLock: true }}
                                >
                                    {zonasDisponibles.map((z) => (
                                        <MenuItem key={z.id} value={z.id}>{z.nombre}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            {/* Estadísticas de la ruta dibujada */}
                            <Box sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: 2, border: '1px dashed #cbd5e1' }}>
                                <Typography variant="body2" sx={{ fontWeight: 600, color: '#475569' }}>
                                    Puntos trazados en mapa: {routePoints.length}
                                </Typography>
                                {routePoints.length > 0 && (
                                    <Button
                                        size="small"
                                        color="error"
                                        startIcon={<DeleteOutlined />}
                                        onClick={handleClearRoute}
                                        sx={{ mt: 1, textTransform: 'none' }}
                                    >
                                        Borrar trazado
                                    </Button>
                                )}
                            </Box>

                            <Button
                                variant="contained"
                                color="primary"
                                fullWidth
                                startIcon={<AssignmentInd />}
                                onClick={handleAsignar}
                                disabled={!canvaceador || !zonaId || routePoints.length < 2}
                                sx={{ mt: 'auto', borderRadius: 2, fontWeight: 600 }}
                            >
                                Guardar y Asignar Ruta
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Mapa Interactivo */}
                <Grid item xs={12} md={8}>
                    <Card variant="outlined" sx={{ borderRadius: 3, overflow: 'hidden', height: '400px', zIndex: 1 }}>
                        <MapContainer
                            center={mapCenter}
                            zoom={14}
                            style={{ height: '400px', width: '100%', zIndex: 1 }}
                        >
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='&copy; OpenStreetMap contributors'
                            />

                            <MapUpdater center={mapCenter} />
                            <MapClickHandler onMapClick={handleMapClick} />

                            {/* Dibujar la ruta (línea) */}
                            {routePoints.length > 1 && (
                                <Polyline positions={routePoints} color="#f43f5e" weight={4} dashArray="5, 10" />
                            )}

                            {/* Marcador de Inicio (punto A) */}
                            {routePoints.length > 0 && (
                                <Marker position={routePoints[0]} />
                            )}

                            {/* Marcador de Fin (punto B o actual) */}
                            {routePoints.length > 1 && (
                                <Marker position={routePoints[routePoints.length - 1]} />
                            )}
                        </MapContainer>
                    </Card>
                </Grid>

                {/* Tabla de Rutas Activas */}
                <Grid item xs={12}>
                    <Card variant="outlined" sx={{ borderRadius: 3 }}>
                        <CardContent sx={{ p: 3 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                <MapOutlined color="secondary" /> Rutas Asignadas
                            </Typography>

                            <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
                                <Table>
                                    <TableHead sx={{ backgroundColor: '#f8fafc' }}>
                                        <TableRow>
                                            <TableCell sx={{ fontWeight: 600 }}>Canvaceador</TableCell>
                                            <TableCell sx={{ fontWeight: 600 }}>Zona Asignada</TableCell>
                                            <TableCell sx={{ fontWeight: 600 }}>Detalle de Ruta</TableCell>
                                            <TableCell sx={{ fontWeight: 600 }}>Estado</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {rutasAsignadas.map((ruta) => (
                                            <TableRow key={ruta.id} hover>
                                                <TableCell>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                        <Avatar sx={{ width: 30, height: 30, bgcolor: '#e2e8f0', color: '#475569', fontSize: '0.875rem' }}>
                                                            {ruta.canvaceador.charAt(0)}
                                                        </Avatar>
                                                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                            {ruta.canvaceador}
                                                        </Typography>
                                                    </Box>
                                                </TableCell>
                                                <TableCell>{ruta.zona}</TableCell>
                                                <TableCell>
                                                    <Typography variant="body2" sx={{ color: '#64748b' }}>
                                                        Ruta trazada ({ruta.puntos} puntos)
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={ruta.estado}
                                                        size="small"
                                                        color={ruta.estado === 'En Progreso' ? 'info' : 'default'}
                                                        sx={{ fontWeight: 600, fontSize: '0.75rem' }}
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </CardContent>
                    </Card>
                </Grid>

            </Grid>
        </Box>
    );
};

export default AsignacionRutas;