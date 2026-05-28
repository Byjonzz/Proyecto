import React, { useState } from 'react';
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, Button, Chip, Dialog, DialogTitle, DialogContent, 
  DialogActions, TextField, MenuItem, Stack, IconButton, Tooltip
} from '@mui/material';
import { Phone, WhatsApp, DirectionsWalk, Close, History } from '@mui/icons-material';

const LeadsFollowUp = () => {
  const [leads, setLeads] = useState([
    { id: 'L-001', nombre: 'Carlos Mendoza', telefono: '5512345678', interes: '500 Megas', estatus: 'Seguimiento', ultimaInteraccion: 'Llamada (Ayer)' },
    { id: 'L-002', nombre: 'Ana Gómez', telefono: '5598765432', interes: '1 Giga', estatus: 'No Contesta', ultimaInteraccion: 'WhatsApp (Hace 2 hrs)' },
    { id: 'L-003', nombre: 'Luis Torres', telefono: '5544332211', interes: '600 Megas', estatus: 'Interesado', ultimaInteraccion: 'Visita en sitio (Hoy)' }
  ]);

  const [modalAbierto, setModalAbierto] = useState(false);
  const [leadSeleccionado, setLeadSeleccionado] = useState(null);
  const [tipoInteraccion, setTipoInteraccion] = useState('llamada');
  const [notas, setNotas] = useState('');

  const abrirModal = (lead) => {
    setLeadSeleccionado(lead);
    setTipoInteraccion('llamada');
    setNotas('');
    setModalAbierto(true);
  };

  const guardarInteraccion = (e) => {
    e.preventDefault();
    // Actualizamos el lead simulando el registro en base de datos
    setLeads(leads.map(l => l.id === leadSeleccionado.id 
      ? { ...l, ultimaInteraccion: `${tipoInteraccion.charAt(0).toUpperCase() + tipoInteraccion.slice(1)} (Justo ahora)` } 
      : l
    ));
    setModalAbierto(false);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box>
        <Typography variant="h5" sx={{ fontWeight: 700, color: '#1e293b' }}>Seguimiento Comercial (Leads)</Typography>
        <Typography variant="body2" color="text.secondary">Gestiona los prospectos que requieren labor de convencimiento para cerrar el contrato en campo.</Typography>
      </Box>

      <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead sx={{ backgroundColor: '#f8fafc' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>Nombre del Lead</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Teléfono</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Interés</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Última Interacción</TableCell>
              <TableCell align="center" sx={{ fontWeight: 600 }}>Registrar Acción</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {leads.map((lead) => (
              <TableRow key={lead.id} hover>
                <TableCell sx={{ fontWeight: 600 }}>{lead.nombre}</TableCell>
                <TableCell>{lead.telefono}</TableCell>
                <TableCell><Chip label={lead.interes} size="small" variant="outlined" color="primary" /></TableCell>
                <TableCell>
                  <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#64748b' }}>
                    <History fontSize="small" /> {lead.ultimaInteraccion}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Button variant="contained" size="small" onClick={() => abrirModal(lead)} sx={{ textTransform: 'none' }}>
                    Añadir Interacción
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal de Registro de Interacción */}
      <Dialog open={modalAbierto} onClose={() => setModalAbierto(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>Bitácora de {leadSeleccionado?.nombre}</Typography>
          <IconButton onClick={() => setModalAbierto(false)} size="small"><Close /></IconButton>
        </DialogTitle>
        <form onSubmit={guardarInteraccion}>
          <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField select label="Tipo de Interacción" fullWidth value={tipoInteraccion} onChange={(e) => setTipoInteraccion(e.target.value)}>
              <MenuItem value="llamada"><Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><Phone fontSize="small" color="primary"/> Llamada Telefónica</Box></MenuItem>
              <MenuItem value="whatsapp"><Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><WhatsApp fontSize="small" color="success"/> Mensaje de WhatsApp</Box></MenuItem>
              <MenuItem value="visita fallida"><Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><DirectionsWalk fontSize="small" color="error"/> Visita Física (No encontrado/Rechazo)</Box></MenuItem>
              <MenuItem value="visita exitosa"><Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><DirectionsWalk fontSize="small" color="success"/> Visita Física (Recuperado/Cierre)</Box></MenuItem>
            </TextField>
            <TextField label="Notas Comerciales" multiline rows={3} fullWidth placeholder="Ej. Dijo que le marcara mañana a las 5 PM..." value={notas} onChange={(e) => setNotas(e.target.value)} required />
          </DialogContent>
          <DialogActions sx={{ p: 2, px: 3 }}>
            <Button onClick={() => setModalAbierto(false)} color="inherit">Cancelar</Button>
            <Button type="submit" variant="contained">Guardar en Historial</Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};
export default LeadsFollowUp;