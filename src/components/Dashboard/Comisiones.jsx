import React, { useState } from 'react';
import {
  Box, Card, CardContent, Typography, Grid, TextField, MenuItem,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Button, Chip, Alert, Stack, Divider, Tooltip, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import { 
  AttachMoney, MapOutlined, BarChartOutlined,
  WarningAmberOutlined, PersonSearchOutlined, AccountBalanceWalletOutlined,
  InfoOutlined, Close, ZoomOutMap
} from '@mui/icons-material';

const PRECIOS = {
  basico: 499,
  familiar: 649,
  gamer: 899
};

const inputReglaStyle = {
  width: 40,
  mx: 1, 
  '& .MuiInput-root': {
    color: '#15803d',
    fontWeight: 800,
    fontSize: '0.9rem',
    '&:before': { borderBottomColor: 'rgba(21, 128, 61, 0.4)' },
    '&:hover:not(.Mui-disabled):before': { borderBottomColor: '#15803d' },
    '&:after': { borderBottomColor: '#16a34a' },
  },
  '& input': {
    textAlign: 'center',
    p: 0,
    pb: 0.5,
    MozAppearance: 'textfield', 
    '&::-webkit-outer-spin-button, &::-webkit-inner-spin-button': {
      WebkitAppearance: 'none', 
      m: 0
    }
  }
};

const Comisiones = () => {
  const [configuracion, setConfiguracion] = useState({
    modalidad: 'solo_metas',
    salarioBase: 1000,
    comisionPlana: 50
  });

  const [reglasMetas, setReglasMetas] = useState([
    { min: 1, max: 3, porcentaje: 30 },
    { min: 4, max: 5, porcentaje: 60 },
    { min: 6, porcentaje: 100 }
  ]);

  // Datos del Equipo (contratosDiarios ordenados ahora de Sábado a Viernes)
  const [equipo, setEquipo] = useState([
    { 
      id: 1, nombre: 'Carlos Ruiz', zonaAsignada: 'Polígono Norte', 
      paquetes: { basico: 2, familiar: 4, gamer: 1 },
      horasApp: 42, 
      contratosDiarios: [1, 1, 2, 0, 2, 1], // [Sáb, Lun, Mar, Mié, Jue, Vie]
      estatus: 'Excelente' 
    },
    { 
      id: 2, nombre: 'Ana Gómez', zonaAsignada: 'Polígono Sur', 
      paquetes: { basico: 2, familiar: 0, gamer: 0 },
      horasApp: 30, 
      contratosDiarios: [0, 1, 0, 1, 0, 0], 
      estatus: 'Bajo Rendimiento' 
    },
    { 
      id: 3, nombre: 'Luis Pérez', zonaAsignada: 'Polígono Centro', 
      paquetes: { basico: 2, familiar: 3, gamer: 0 },
      horasApp: 38, 
      contratosDiarios: [0, 1, 1, 1, 0, 2], 
      estatus: 'Regular' 
    }
  ]);

  const [modalInfoPago, setModalInfoPago] = useState(false);
  const [agenteGrafica, setAgenteGrafica] = useState(null);

  const handleConfigChange = (prop, value) => {
    setConfiguracion({ ...configuracion, [prop]: value });
  };

  const handleMetasChange = (index, field, value) => {
    const nuevasReglas = [...reglasMetas];
    nuevasReglas[index][field] = Number(value);
    setReglasMetas(nuevasReglas);
  };

  const calcularRendimientoAgente = (paquetes) => {
    const totalVentas = paquetes.basico + paquetes.familiar + paquetes.gamer;
    const volumenDinero = (paquetes.basico * PRECIOS.basico) + (paquetes.familiar * PRECIOS.familiar) + (paquetes.gamer * PRECIOS.gamer);

    let pagoCalculado = 0;
    let porcentajeAplicado = 0;

    if (configuracion.modalidad === 'solo_metas') {
      let porcentajeEscalonado = 0;
      if (totalVentas >= reglasMetas[2].min) {
        porcentajeEscalonado = reglasMetas[2].porcentaje / 100;
      } else if (totalVentas >= reglasMetas[1].min && totalVentas <= reglasMetas[1].max) {
        porcentajeEscalonado = reglasMetas[1].porcentaje / 100;
      } else if (totalVentas >= reglasMetas[0].min && totalVentas <= reglasMetas[0].max) {
        porcentajeEscalonado = reglasMetas[0].porcentaje / 100;
      }

      pagoCalculado = volumenDinero * porcentajeEscalonado;
      porcentajeAplicado = porcentajeEscalonado * 100;

    } else if (configuracion.modalidad === 'base_mas_comision') {
      pagoCalculado = configuracion.salarioBase + (volumenDinero * (configuracion.comisionPlana / 100));
      porcentajeAplicado = configuracion.comisionPlana;
    } else if (configuracion.modalidad === 'comision_pura') {
      pagoCalculado = volumenDinero * (configuracion.comisionPlana / 100);
      porcentajeAplicado = configuracion.comisionPlana;
    }

    return { totalVentas, volumenDinero, porcentajeAplicado, pagoCalculado };
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
                  <MenuItem value="base_mas_comision">Salario Base + Comisión Fija</MenuItem>
                  <MenuItem value="comision_pura">Comisión Pura (Fija %)</MenuItem>
                </TextField>

                {configuracion.modalidad === 'solo_metas' && (
                  <Box sx={{ backgroundColor: '#f0fdf4', p: 2.5, borderRadius: 2, border: '1px solid #bbf7d0' }}>
                    <Typography variant="body2" sx={{ fontWeight: 800, color: '#166534', mb: 2 }}>
                      Reglas Escalonadas Activas:
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', mb: 1.5 }}>
                      <Typography variant="body2" sx={{ color: '#15803d', fontWeight: 600 }}>• De</Typography>
                      <TextField variant="standard" type="number" sx={inputReglaStyle} value={reglasMetas[0].min} onChange={(e) => handleMetasChange(0, 'min', e.target.value)} />
                      <Typography variant="body2" sx={{ color: '#15803d', fontWeight: 600 }}>a</Typography>
                      <TextField variant="standard" type="number" sx={inputReglaStyle} value={reglasMetas[0].max} onChange={(e) => handleMetasChange(0, 'max', e.target.value)} />
                      <Typography variant="body2" sx={{ color: '#15803d', fontWeight: 600 }}>Ventas =</Typography>
                      <TextField variant="standard" type="number" sx={{ ...inputReglaStyle, width: 45 }} value={reglasMetas[0].porcentaje} onChange={(e) => handleMetasChange(0, 'porcentaje', e.target.value)} />
                      <Typography variant="body2" sx={{ color: '#15803d', fontWeight: 600 }}>%</Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', mb: 1.5 }}>
                      <Typography variant="body2" sx={{ color: '#15803d', fontWeight: 600 }}>• De</Typography>
                      <TextField variant="standard" type="number" sx={inputReglaStyle} value={reglasMetas[1].min} onChange={(e) => handleMetasChange(1, 'min', e.target.value)} />
                      <Typography variant="body2" sx={{ color: '#15803d', fontWeight: 600 }}>a</Typography>
                      <TextField variant="standard" type="number" sx={inputReglaStyle} value={reglasMetas[1].max} onChange={(e) => handleMetasChange(1, 'max', e.target.value)} />
                      <Typography variant="body2" sx={{ color: '#15803d', fontWeight: 600 }}>Ventas =</Typography>
                      <TextField variant="standard" type="number" sx={{ ...inputReglaStyle, width: 45 }} value={reglasMetas[1].porcentaje} onChange={(e) => handleMetasChange(1, 'porcentaje', e.target.value)} />
                      <Typography variant="body2" sx={{ color: '#15803d', fontWeight: 600 }}>%</Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                      <Typography variant="body2" sx={{ color: '#15803d', fontWeight: 600 }}>•</Typography>
                      <TextField variant="standard" type="number" sx={inputReglaStyle} value={reglasMetas[2].min} onChange={(e) => handleMetasChange(2, 'min', e.target.value)} />
                      <Typography variant="body2" sx={{ color: '#15803d', fontWeight: 600 }}>o más Ventas =</Typography>
                      <TextField variant="standard" type="number" sx={{ ...inputReglaStyle, width: 45 }} value={reglasMetas[2].porcentaje} onChange={(e) => handleMetasChange(2, 'porcentaje', e.target.value)} />
                      <Typography variant="body2" sx={{ color: '#15803d', fontWeight: 600 }}>%</Typography>
                    </Box>
                  </Box>
                )}

                {configuracion.modalidad === 'base_mas_comision' && (
                  <>
                    <TextField label="Salario Base Semanal ($)" type="number" size="small" fullWidth value={configuracion.salarioBase} onChange={(e) => handleConfigChange('salarioBase', Number(e.target.value))} />
                    <TextField label="% de Comisión Fija" type="number" size="small" fullWidth value={configuracion.comisionPlana} onChange={(e) => handleConfigChange('comisionPlana', Number(e.target.value))} />
                  </>
                )}

                {configuracion.modalidad === 'comision_pura' && (
                  <TextField label="% de Comisión Fija Pareja" type="number" size="small" fullWidth value={configuracion.comisionPlana} onChange={(e) => handleConfigChange('comisionPlana', Number(e.target.value))} />
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
                      <TableCell align="center" sx={{ fontWeight: 600 }}>Comisión Aplicada</TableCell>
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
                              label={`${stats.porcentajeAplicado}% ${configuracion.modalidad === 'solo_metas' ? 'Alcanzado' : 'Fijo'}`} 
                              size="small" 
                              color={stats.porcentajeAplicado >= 100 ? 'success' : stats.porcentajeAplicado >= 50 ? 'primary' : 'warning'}
                              variant={configuracion.modalidad === 'comision_pura' ? 'outlined' : 'filled'}
                            />
                          </TableCell>
                          
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

        {/* GRÁFICAS INTERACTIVAS (LOGÍSTICA POR DÍA) */}
        <Grid item xs={12}>
          <Card variant="outlined" sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#475569', mb: 2 }}>
                Logística: Días de Mayor Productividad (Haz clic para expandir)
              </Typography>
              
              <Grid container spacing={2}>
                {equipo.map(agente => (
                  <Grid item xs={12} md={4} key={agente.id}>
                    <Box 
                      onClick={() => setAgenteGrafica(agente)}
                      sx={{ 
                        p: 2, backgroundColor: '#f8fafc', borderRadius: 2, border: '1px solid #e2e8f0',
                        cursor: 'pointer', transition: 'all 0.2s',
                        '&:hover': { borderColor: '#3b82f6', boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.2)', transform: 'translateY(-2px)' }
                      }}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="caption" sx={{ fontWeight: 700, color: '#334155' }}>
                          {agente.nombre}
                        </Typography>
                        <ZoomOutMap sx={{ fontSize: 16, color: '#94a3b8' }} />
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: 80, borderBottom: '1px solid #cbd5e1', pb: 0.5 }}>
                        {['S', 'L', 'M', 'M', 'J', 'V'].map((dia, index) => {
                          const cantidad = agente.contratosDiarios[index];
                          const maxVentas = Math.max(...agente.contratosDiarios, 1);
                          const alturaPx = (cantidad / maxVentas) * 55;
                          return (
                            <Box key={index} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '14%' }}>
                              <Typography variant="caption" sx={{ fontSize: '0.6rem', color: '#64748b' }}>{cantidad}</Typography>
                              <Box sx={{ width: '100%', height: `${alturaPx}px`, backgroundColor: '#3b82f6', borderRadius: '2px 2px 0 0' }} />
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

      {/* MODAL PARA LA GRÁFICA AMPLIADA */}
      <Dialog open={Boolean(agenteGrafica)} onClose={() => setAgenteGrafica(null)} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ pb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 800, color: '#1e293b', display: 'flex', alignItems: 'center', gap: 1 }}>
            <BarChartOutlined color="primary" /> Productividad Detallada: {agenteGrafica?.nombre}
          </Typography>
          <IconButton onClick={() => setAgenteGrafica(null)} size="small">
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ py: 4 }}>
          {agenteGrafica && (
            <Box>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 4, textAlign: 'center' }}>
                Distribución de contratos generados de Sábado a Viernes.
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', height: 280, borderBottom: '2px solid #cbd5e1', pb: 1, px: { xs: 1, sm: 4 } }}>
                {/* DÍAS ORDENADOS DE SÁBADO A VIERNES */}
                {['Sábado', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'].map((dia, index) => {
                  const cantidad = agenteGrafica.contratosDiarios[index];
                  const maxVentas = Math.max(...agenteGrafica.contratosDiarios, 1);
                  const alturaPorcentaje = (cantidad / maxVentas) * 100;

                  return (
                    <Box key={index} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '12%', height: '100%', justifyContent: 'flex-end' }}>
                      <Typography variant="h6" sx={{ fontWeight: 800, color: cantidad > 0 ? '#2563eb' : '#94a3b8', mb: 1 }}>
                        {cantidad}
                      </Typography>
                      <Box 
                        sx={{ 
                          width: '100%', maxWidth: 50, height: `${alturaPorcentaje}%`, 
                          backgroundColor: cantidad > 0 ? '#3b82f6' : 'transparent', 
                          borderRadius: '6px 6px 0 0', transition: 'height 0.5s ease-in-out'
                        }} 
                      />
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, mt: 1.5, color: '#475569' }}>
                        {dia.slice(0, 3)}
                      </Typography>
                    </Box>
                  );
                })}
              </Box>

              <Alert severity="info" sx={{ mt: 5, borderRadius: 2 }}>
                La información de esta gráfica se actualiza en tiempo real cada vez que <strong>{agenteGrafica.nombre}</strong> cierra un contrato en su aplicación móvil.
              </Alert>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, px: 3 }}>
          <Button onClick={() => setAgenteGrafica(null)} variant="outlined">Cerrar Gráfica</Button>
        </DialogActions>
      </Dialog>

      {/* MODAL DE INFORMACIÓN DE PAGOS GENERAL */}
      <Dialog open={modalInfoPago} onClose={() => setModalInfoPago(false)} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 800, color: '#1e293b', display: 'flex', alignItems: 'center', gap: 1 }}>
            <AttachMoney color="success" /> Guía de Cálculo de Nómina Semanal
          </Typography>
        </DialogTitle>
        <DialogContent dividers sx={{ py: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
          
          <Typography variant="body2" color="text.secondary">
            El sistema de Solit System calcula las nóminas automáticamente dependiendo de los números configurados. A continuación se explican los escenarios utilizando un <strong>ejemplo base de 7 ventas con un volumen generado de $4,500 MXN</strong>.
          </Typography>

          <Stack spacing={2}>
            <Card variant="outlined" sx={{ borderColor: '#3b82f6', bgcolor: '#eff6ff' }}>
              <CardContent>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#1d4ed8', mb: 1 }}>1. Modalidad: Pago por Metas (Escalonado)</Typography>
                <Typography variant="body2" sx={{ color: '#1e3a8a', mb: 1 }}>La comisión sube de nivel dependiendo de los contratos cerrados:</Typography>
                <ul className="text-sm text-blue-900 space-y-1 ml-4 list-disc" style={{ paddingLeft: '20px', margin: 0 }}>
                  <li><strong>{reglasMetas[0].min} a {reglasMetas[0].max} ventas:</strong> Se paga el {reglasMetas[0].porcentaje}% del volumen generado.</li>
                  <li><strong>{reglasMetas[1].min} a {reglasMetas[1].max} ventas:</strong> Se paga el {reglasMetas[1].porcentaje}% del volumen generado.</li>
                  <li><strong>{reglasMetas[2].min} o más ventas:</strong> Se paga el {reglasMetas[2].porcentaje}% del volumen generado.</li>
                </ul>
                <Divider sx={{ my: 1.5, borderColor: '#bfdbfe' }} />
                <Typography variant="body2" sx={{ fontWeight: 700, color: '#1e40af' }}>
                  Ejemplo: Al tener 7 ventas, se alcanza el nivel superior. El canvaceador se llevaría los $4,500 íntegros.
                </Typography>
              </CardContent>
            </Card>

            <Card variant="outlined" sx={{ borderColor: '#10b981', bgcolor: '#ecfdf5' }}>
              <CardContent>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#047857', mb: 1 }}>2. Modalidad: Salario Base + Comisión Fija</Typography>
                <Typography variant="body2" sx={{ color: '#065f46', mb: 1 }}>
                  El canvaceador recibe un sueldo fijo asegurado (${configuracion.salarioBase.toLocaleString('en-US')} MXN) más la comisión plana sobre el volumen de ventas.
                </Typography>
                <Divider sx={{ my: 1.5, borderColor: '#a7f3d0' }} />
                <Typography variant="body2" sx={{ fontWeight: 700, color: '#064e3b' }}>
                  Ejemplo: ${configuracion.salarioBase.toLocaleString('en-US')} de Base + $2,250 (al {configuracion.comisionPlana}% del volumen generado) = Ganaría ${(configuracion.salarioBase + 2250).toLocaleString('en-US', { minimumFractionDigits: 2 })} MXN.
                </Typography>
              </CardContent>
            </Card>

            <Card variant="outlined" sx={{ borderColor: '#f59e0b', bgcolor: '#fffbeb' }}>
              <CardContent>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#b45309', mb: 1 }}>3. Modalidad: Comisión Pura Fija</Typography>
                <Typography variant="body2" sx={{ color: '#92400e', mb: 1 }}>
                  Se paga un porcentaje fijo y directo por el dinero generado, sin importar las metas (actualmente configurado al {configuracion.comisionPlana}%).
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