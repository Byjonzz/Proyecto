import React, { useState } from 'react';
import {
  Box, Card, CardContent, Typography, Grid, TextField, MenuItem,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Button, Chip, Alert, Stack, Divider, Tooltip, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import { 
  AttachMoney, MapOutlined, AccessTimeOutlined, BarChartOutlined,
  WarningAmberOutlined, PersonSearchOutlined, AccountBalanceWalletOutlined,
  InfoOutlined, AssignmentTurnedIn
} from '@mui/icons-material';

// Precios oficiales de los paquetes
const PRECIOS = {
  basico: 499,
  familiar: 649,
  gamer: 899
};

const Comisiones = () => {
  // Lógica de Configuración Semanal
  const [configuracion, setConfiguracion] = useState({
    modalidad: 'solo_metas', // solo_metas | base_mas_comision | comision_pura
    salarioBase: 1000,
    comisionPlana: 50
  });

  // Datos del Equipo de Canvaceadores
  const [equipo, setEquipo] = useState([
    { 
      id: 1, nombre: 'Carlos Ruiz', zonaAsignada: 'Polígono Norte', 
      paquetes: { basico: 2, familiar: 4, gamer: 1 }, // Total: 7 ventas
      horasApp: 42, 
      contratosDiarios: [1, 2, 0, 2, 1, 1], 
      estatus: 'Excelente' 
    },
    { 
      id: 2, nombre: 'Ana Gómez', zonaAsignada: 'Polígono Sur', 
      paquetes: { basico: 2, familiar: 0, gamer: 0 }, // Total: 2 ventas
      horasApp: 30, 
      contratosDiarios: [1, 0, 1, 0, 0, 0], 
      estatus: 'Bajo Rendimiento' 
    },
    { 
      id: 3, nombre: 'Luis Pérez', zonaAsignada: 'Polígono Centro', 
      paquetes: { basico: 2, familiar: 3, gamer: 0 }, // Total: 5 ventas
      horasApp: 38, 
      contratosDiarios: [1, 1, 1, 0, 2, 0], 
      estatus: 'Regular' 
    }
  ]);

  // Estado para el Modal de Explicación de Pagos
  const [modalInfoPago, setModalInfoPago] = useState(false);

  const handleConfigChange = (prop, value) => {
    setConfiguracion({ ...configuracion, [prop]: value });
  };

  // --- MOTOR DE CÁLCULO DE COMISIONES ---
  const calcularRendimientoAgente = (paquetes) => {
    const totalVentas = paquetes.basico + paquetes.familiar + paquetes.gamer;
    const volumenDinero = (paquetes.basico * PRECIOS.basico) + (paquetes.familiar * PRECIOS.familiar) + (paquetes.gamer * PRECIOS.gamer);

    let porcentajeNivel = 0;
    if (totalVentas >= 6) porcentajeNivel = 1.00;
    else if (totalVentas >= 4) porcentajeNivel = 0.60;
    else if (totalVentas >= 1) porcentajeNivel = 0.30;

    let pagoCalculado = 0;
    if (configuracion.modalidad === 'solo_metas') {
      pagoCalculado = volumenDinero * porcentajeNivel;
    } else if (configuracion.modalidad === 'base_mas_comision') {
      pagoCalculado = configuracion.salarioBase + (volumenDinero * porcentajeNivel);
    } else if (configuracion.modalidad === 'comision_pura') {
      pagoCalculado = volumenDinero * (configuracion.comisionPlana / 100);
    }

    return { totalVentas, volumenDinero, porcentajeNivel, pagoCalculado };
  };

  const getRendimientoColor = (estatus) => {
    if (estatus === 'Excelente') return 'success';
    if (estatus === 'Regular') return 'warning';
    return 'error';
  };

  return (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 3 }}>
      
      <Box>
        <Typography variant="h5" sx={{ fontWeight: 700, color: '#1e293b', display: 'flex', alignItems: 'center', gap: 1 }}>
          <PersonSearchOutlined color="primary" fontSize="large" /> Administración Ventas y Comisiones
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Supervisión semanal de canvaceadores, cálculo inteligente por paquetes y evaluación de metas.
        </Typography>
      </Box>

      <Alert severity="warning" icon={<WarningAmberOutlined fontSize="inherit" />} sx={{ borderRadius: 2 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Aprobación Pendiente - Ing. César</Typography>
        Configura la modalidad de pago semanal a continuación. Al presionar "Solicitar Aprobación", se enviará la propuesta a Dirección.
      </Alert>

      <Grid container spacing={3}>
        
        {/* PANEL DE CONFIGURACIÓN */}
        <Grid item xs={12} lg={4}>
          <Card variant="outlined" sx={{ borderRadius: 3, height: '100%' }}>
            <CardContent>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#475569', mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                <AccountBalanceWalletOutlined color="success" /> Parámetros de Pago Semanal
              </Typography>

              <Stack spacing={3}>
                <TextField select label="Modalidad de Trabajo" size="small" fullWidth value={configuracion.modalidad} onChange={(e) => handleConfigChange('modalidad', e.target.value)}>
                  <MenuItem value="solo_metas">Pago por Metas (Escalonado)</MenuItem>
                  <MenuItem value="base_mas_comision">Salario Base + Metas</MenuItem>
                  <MenuItem value="comision_pura">Comisión Pura (Fija %)</MenuItem>
                </TextField>

                {(configuracion.modalidad === 'solo_metas' || configuracion.modalidad === 'base_mas_comision') && (
                  <Box sx={{ backgroundColor: '#f0fdf4', p: 2, borderRadius: 2, border: '1px solid #bbf7d0' }}>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: '#166534', display: 'block', mb: 1 }}>Reglas Escalonadas Activas:</Typography>
                    <Typography variant="caption" sx={{ color: '#15803d', display: 'block' }}>• 1 a 3 Ventas = 30% del volumen</Typography>
                    <Typography variant="caption" sx={{ color: '#15803d', display: 'block' }}>• 4 a 5 Ventas = 60% del volumen</Typography>
                    <Typography variant="caption" sx={{ color: '#15803d', display: 'block' }}>• 6 o más Ventas = 100% del volumen</Typography>
                  </Box>
                )}

                {configuracion.modalidad === 'base_mas_comision' && (
                  <TextField label="Salario Base Semanal ($)" type="number" size="small" fullWidth value={configuracion.salarioBase} onChange={(e) => handleConfigChange('salarioBase', Number(e.target.value))} />
                )}

                {configuracion.modalidad === 'comision_pura' && (
                  <TextField label="% de Comisión Pareja" type="number" size="small" fullWidth value={configuracion.comisionPlana} onChange={(e) => handleConfigChange('comisionPlana', Number(e.target.value))} />
                )}

                <Button variant="contained" color="primary" fullWidth sx={{ fontWeight: 700, mt: 2 }}>
                  Solicitar Aprobación de Esquema
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* TABLA DE DESEMPEÑO */}
        <Grid item xs={12} lg={8}>
          <Card variant="outlined" sx={{ borderRadius: 3, height: '100%' }}>
            <CardContent>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#475569', mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                <BarChartOutlined color="primary" /> Productividad y Cálculo de Nómina Semanal
              </Typography>

              <TableContainer>
                <Table size="small">
                  <TableHead sx={{ backgroundColor: '#f8fafc' }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600 }}>Canvaceador</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 600 }}>Ventas Semanales</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 600 }}>Volumen ($)</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 600 }}>Nivel de Comisión</TableCell>
                      
                      {/* === BOTÓN "i" MOVIDO A LA CABECERA === */}
                      <TableCell align="center" sx={{ fontWeight: 600 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                          Pago Calculado
                          <Tooltip title="Ver reglas de cálculo">
                            <IconButton size="small" onClick={() => setModalInfoPago(true)} sx={{ color: '#64748b', '&:hover': { color: '#3b82f6' } }}>
                              <InfoOutlined fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                      
                      <TableCell align="center" sx={{ fontWeight: 600 }}>Ubicación</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {equipo.map((agente) => {
                      const stats = calcularRendimientoAgente(agente.paquetes);
                      
                      return (
                        <TableRow key={agente.id} hover>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>{agente.nombre}</Typography>
                            <Chip label={agente.estatus} color={getRendimientoColor(agente.estatus)} size="small" sx={{ height: 16, fontSize: '0.65rem', mt: 0.5 }} />
                          </TableCell>
                          
                          <TableCell align="center">
                            <Tooltip title={`Básico: ${agente.paquetes.basico} | Familiar: ${agente.paquetes.familiar} | Gamer: ${agente.paquetes.gamer}`}>
                              <Typography variant="body2" sx={{ fontWeight: 700, color: '#3b82f6', cursor: 'help' }}>
                                {stats.totalVentas} Contratos
                              </Typography>
                            </Tooltip>
                          </TableCell>
                          
                          <TableCell align="center">
                            <Typography variant="body2" sx={{ color: '#475569' }}>
                              ${stats.volumenDinero.toLocaleString('en-US')}
                            </Typography>
                          </TableCell>

                          <TableCell align="center">
                            <Chip 
                              label={`${stats.porcentajeNivel * 100}% Alcanzado`} 
                              size="small" 
                              color={stats.porcentajeNivel === 1 ? 'success' : stats.porcentajeNivel === 0.6 ? 'primary' : 'warning'}
                              variant={configuracion.modalidad === 'comision_pura' ? 'outlined' : 'filled'}
                            />
                          </TableCell>
                          
                          {/* CELDA DE PAGO LIMPIA (Solo el número) */}
                          <TableCell align="center">
                            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#16a34a' }}>
                              ${stats.pagoCalculado.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </Typography>
                          </TableCell>

                          <TableCell align="center">
                            <Tooltip title={`Ver zona: ${agente.zonaAsignada} (${agente.horasApp}h en campo)`}>
                              <IconButton color="primary" size="small"><MapOutlined /></IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>

              <Box sx={{ mt: 3, p: 1.5, backgroundColor: '#f1f5f9', borderRadius: 2 }}>
                <Typography variant="caption" color="text.secondary">
                  * El volumen de dinero ($) se calcula sumando el costo de cada paquete vendido: Básico ($499), Familiar ($649), Gamer ($899).
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* GRÁFICA LOGÍSTICA: CONTRATOS POR DÍA */}
        <Grid item xs={12}>
          <Card variant="outlined" sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#475569', mb: 2 }}>
                Logística: Días de Mayor Productividad
              </Typography>
              
              <Grid container spacing={2}>
                {equipo.map(agente => (
                  <Grid item xs={12} md={4} key={agente.id}>
                    <Box sx={{ p: 2, backgroundColor: '#f8fafc', borderRadius: 2, border: '1px solid #e2e8f0' }}>
                      <Typography variant="caption" sx={{ fontWeight: 700, color: '#334155', mb: 1, display: 'block' }}>
                        {agente.nombre}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: 80, borderBottom: '1px solid #cbd5e1', pb: 0.5 }}>
                        {['L', 'M', 'M', 'J', 'V', 'S'].map((dia, index) => {
                          const cantidad = agente.contratosDiarios[index];
                          const altura = cantidad * 20; 
                          return (
                            <Box key={index} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '14%' }}>
                              <Typography variant="caption" sx={{ fontSize: '0.6rem', color: '#64748b' }}>{cantidad}</Typography>
                              <Box sx={{ width: '100%', height: `${altura}px`, backgroundColor: '#3b82f6', borderRadius: '2px 2px 0 0' }} />
                              <Typography variant="caption" sx={{ fontSize: '0.6rem', fontWeight: 600 }}>{dia}</Typography>
                            </Box>
                          );
                        })}
                      </Box>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* =========================================================
          MODAL EXPLICATIVO DE CÁLCULO GENERAL (SIN AGENTE ESPECÍFICO)
          ========================================================= */}
      <Dialog open={modalInfoPago} onClose={() => setModalInfoPago(false)} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 800, color: '#1e293b', display: 'flex', alignItems: 'center', gap: 1 }}>
            <AttachMoney color="success" /> ¿Cómo se calculan los pagos semanales?
          </Typography>
        </DialogTitle>
        <DialogContent dividers sx={{ py: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
          
          <Typography variant="body2" color="text.secondary">
            El sistema de Solit System calcula las nóminas automáticamente dependiendo de la modalidad configurada. A continuación se explican los escenarios utilizando un <strong>ejemplo base de 7 ventas con un volumen generado de $4,500 MXN</strong>.
          </Typography>

          <Stack spacing={2}>
            {/* Ejemplo 1: Escalonado por Metas */}
            <Card variant="outlined" sx={{ borderColor: '#3b82f6', bgcolor: '#eff6ff' }}>
              <CardContent>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#1d4ed8', mb: 1 }}>1. Modalidad: Pago por Metas (Escalonado)</Typography>
                <Typography variant="body2" sx={{ color: '#1e3a8a', mb: 1 }}>La comisión sube de nivel dependiendo de los contratos cerrados en la semana:</Typography>
                <ul className="text-sm text-blue-900 space-y-1 ml-4 list-disc" style={{ paddingLeft: '20px', margin: 0 }}>
                  <li><strong>1 a 3 ventas:</strong> Se paga el 30% del volumen generado.</li>
                  <li><strong>4 a 5 ventas:</strong> Se paga el 60% del volumen generado.</li>
                  <li><strong>6 a 10 ventas:</strong> Se paga el 100% del volumen generado.</li>
                </ul>
                <Divider sx={{ my: 1.5, borderColor: '#bfdbfe' }} />
                <Typography variant="body2" sx={{ fontWeight: 700, color: '#1e40af' }}>
                  Ejemplo: Al tener 7 ventas, se alcanza el nivel del 100%. El canvaceador se llevaría los $4,500 íntegros.
                </Typography>
              </CardContent>
            </Card>

            {/* Ejemplo 2: Salario Base + Metas */}
            <Card variant="outlined" sx={{ borderColor: '#10b981', bgcolor: '#ecfdf5' }}>
              <CardContent>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#047857', mb: 1 }}>2. Modalidad: Salario Base + Metas</Typography>
                <Typography variant="body2" sx={{ color: '#065f46', mb: 1 }}>
                  El canvaceador recibe un sueldo fijo asegurado (ej. ${configuracion.salarioBase.toLocaleString('en-US')} MXN) más la comisión escalonada de sus ventas.
                </Typography>
                <Divider sx={{ my: 1.5, borderColor: '#a7f3d0' }} />
                <Typography variant="body2" sx={{ fontWeight: 700, color: '#064e3b' }}>
                  Ejemplo: ${configuracion.salarioBase.toLocaleString('en-US')} de Base + $4,500 (al 100% por hacer 7 ventas) = Ganaría ${(configuracion.salarioBase + 4500).toLocaleString('en-US', { minimumFractionDigits: 2 })} MXN.
                </Typography>
              </CardContent>
            </Card>

            {/* Ejemplo 3: Comisión Pura */}
            <Card variant="outlined" sx={{ borderColor: '#f59e0b', bgcolor: '#fffbeb' }}>
              <CardContent>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#b45309', mb: 1 }}>3. Modalidad: Comisión Pura Fija</Typography>
                <Typography variant="body2" sx={{ color: '#92400e', mb: 1 }}>
                  Se paga un porcentaje fijo y directo por cada paquete vendido, sin importar las metas semanales (actualmente configurado al {configuracion.comisionPlana}%).
                </Typography>
                <Divider sx={{ my: 1.5, borderColor: '#fde68a' }} />
                <Typography variant="body2" sx={{ fontWeight: 700, color: '#78350f' }}>
                  Ejemplo: El {configuracion.comisionPlana}% del volumen de $4,500 = Ganaría ${(4500 * (configuracion.comisionPlana / 100)).toLocaleString('en-US', { minimumFractionDigits: 2 })} MXN.
                </Typography>
              </CardContent>
            </Card>
          </Stack>

        </DialogContent>
        <DialogActions sx={{ p: 2, px: 3 }}>
          <Button onClick={() => setModalInfoPago(false)} variant="contained" color="primary">Entendido</Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
};

export default Comisiones;