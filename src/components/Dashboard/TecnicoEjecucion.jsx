import React, { useState } from 'react';
import {
    Box, Card, CardContent, Typography, Switch, FormControlLabel,
    Stack, Button, Alert, Chip, Divider
} from '@mui/material';
import { PhotoCamera, CheckCircle } from '@mui/icons-material';

const TecnicoEjecucion = () => {
    const [checklist, setChecklist] = useState({
        verificarEquipos: false,
        tendidoCable: false,
        configONT: false, // Corregido: sin espacios
        firmaConformidad: false
    });

    const [completado, setCompletado] = useState(false);

    const handleToggle = (e) => {
        // Tomamos el atributo "name" del Switch para actualizar el estado correcto
        setChecklist({ ...checklist, [e.target.name]: e.target.checked });
    };

    // Validamos que los 4 booleanos sean "true" para habilitar el botón
    const isComplete =
        checklist.verificarEquipos &&
        checklist.tendidoCable &&
        checklist.configONT &&
        checklist.firmaConformidad;

    return (
        <Box sx={{ maxWidth: 700, margin: 'auto' }}>
            <Box sx={{ mb: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 700, color: '#1e293b' }}>
                    Módulo de Trabajo de Campo Técnico
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Ejecuta las instalaciones activas asignadas a tu ruta del día.
                </Typography>
            </Box>

            {completado ? (
                <Alert severity="success" sx={{ borderRadius: 2 }}>
                    ¡Instalación marcada como finalizada! El reporte e imágenes se subieron al servidor de Solit System.
                    <Button
                        variant="outlined"
                        sx={{ mt: 2, display: 'block' }}
                        onClick={() => {
                            setCompletado(false);
                            setChecklist({
                                verificarEquipos: false,
                                tendidoCable: false,
                                configONT: false,
                                firmaConformidad: false
                            });
                        }}
                    >
                        Abrir Siguiente Orden
                    </Button>
                </Alert>
            ) : (
                <Card variant="outlined" sx={{ borderRadius: 3 }}>
                    <CardContent sx={{ p: 4 }}>
                        <Box sx={{ mb: 2 }}>
                            <Chip label="Orden de Servicio Activa" color="primary" size="small" sx={{ fontWeight: 600, mb: 1 }} />
                            <Typography variant="h6" sx={{ fontWeight: 700 }}>Juan Pérez García</Typography>
                            <Typography variant="body2" color="text.secondary">Dirección: Av. Reforma 402, Centro</Typography>
                            <Typography variant="body2" color="text.secondary">Paquete: Internet Familiar 50MB</Typography>
                        </Box>

                        <Divider sx={{ my: 2.5 }} />

                        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#475569', mb: 2 }}>
                            Protocolo Técnico Obligatorio
                        </Typography>

                        <Stack spacing={1.5}>
                            <FormControlLabel
                                control={<Switch checked={checklist.verificarEquipos} onChange={handleToggle} name="verificarEquipos" color="secondary" />}
                                label="1. Validación y desempaque de equipos ONT/Router"
                            />
                            <FormControlLabel
                                control={<Switch checked={checklist.tendidoCable} onChange={handleToggle} name="tendidoCable" color="secondary" />}
                                label="2. Tendido e instalación de Cable de Fibra Óptica"
                            />
                            <FormControlLabel
                                control={<Switch checked={checklist.configONT} onChange={handleToggle} name="configONT" color="secondary" />}
                                label="3. Configuración, fusión y pruebas de potencia de internet"
                            />
                            <FormControlLabel
                                control={<Switch checked={checklist.firmaConformidad} onChange={handleToggle} name="firmaConformidad" color="secondary" />}
                                label="4. Verificación de navegación conforme con el cliente"
                            />
                        </Stack>

                        <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid #e2e8f0' }}>
                            <Button
                                variant="outlined"
                                fullWidth
                                startIcon={<PhotoCamera />}
                                sx={{ textTransform: 'none', mb: 2 }}
                            >
                                Capturar Evidencia Fotográfica (Fachada / ONT)
                            </Button>

                            <Button
                                variant="contained"
                                fullWidth
                                color="success"
                                disabled={!isComplete}
                                onClick={() => setCompletado(true)}
                                startIcon={<CheckCircle />}
                                sx={{ textTransform: 'none', py: 1.2, fontWeight: 600 }}
                            >
                                Cerrar Orden e Informar Éxito
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
            )}
        </Box>
    );
};

export default TecnicoEjecucion;