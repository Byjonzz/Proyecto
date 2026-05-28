import React, { useState } from 'react';
import { 
  Card, CardHeader, CardContent, TableContainer, Table, TableHead, TableRow, TableCell, 
  TableBody, Chip, IconButton, Box, Button, Tabs, Tab, Typography, Divider 
} from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AddIcon from '@mui/icons-material/Add';

const LeadsFollowUp = () => {
  const [tabValue, setTabValue] = useState(0);

  const leads = [
    { id: 1, name: 'María Fernández', status: 'Interesado', color: 'success', plan: '600 Megas', time: 'Hace 2 horas', location: 'Col. Jardines del Sur', phone: '9871234567' },
    { id: 2, name: 'Juan Pérez', status: 'Volver a llamar', color: 'warning', plan: 'Llamada perdida', time: 'Hace 3 horas', location: 'Vimar a futuro', phone: '9875551234' },
    { id: 3, name: 'Ana Gómez', status: 'Interesado', color: 'success', plan: '1 Giga', time: 'Ayer 5:15 PM', location: 'Mundo Normal', phone: '9879876543' },
    { id: 4, name: 'Luis Martínez', status: 'Rechazado', color: 'error', plan: 'No especificó', time: 'Hace 1 día', location: 'Mitacar del Sur', phone: '9872223333' }
  ];

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Card elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 3 }}>
      <CardHeader 
        title={<Typography variant="subtitle1" fontWeight="bold">Leads y Seguimiento</Typography>}
        subheader="Gestión y estado actual de interacciones en campo"
        action={
          <Button variant="contained" color="primary" startIcon={<AddIcon />} disableElevation sx={{ mt: 1 }}>
            Nuevo Lead
          </Button>
        }
        sx={{ borderBottom: '1px solid #e0e0e0', bgcolor: '#fafafa' }}
      />
      
      <Box sx={{ borderBottom: '1px solid #e0e0e0', px: 2, bgcolor: '#fdfdfd' }}>
        <Tabs value={tabValue} onChange={handleTabChange} variant="scrollable" scrollButtons="auto">
          <Tab label="Todos" sx={{ fontSize: '0.8rem', fontWeight: 'bold' }} />
          <Tab label="Interesado" sx={{ fontSize: '0.8rem', fontWeight: 'bold' }} />
          <Tab label="Volver a llamar" sx={{ fontSize: '0.8rem', fontWeight: 'bold' }} />
          <Tab label="Rechazado" sx={{ fontSize: '0.8rem', fontWeight: 'bold' }} />
        </Tabs>
      </Box>

      <CardContent sx={{ p: 0 }}>
        <TableContainer>
          <Table sx={{ minWidth: 650 }}>
            <TableHead sx={{ bgcolor: '#f9fafb' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: 'text.secondary' }}>NOMBRE</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: 'text.secondary' }}>ESTADO</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: 'text.secondary' }}>PLAN</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: 'text.secondary' }}>UBICACIÓN</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: 'text.secondary' }}>ACTIVIDAD</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: 'text.secondary', pr: 3 }}>ACCIONES</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {leads.map((lead) => (
                <TableRow key={lead.id} sx={{ '&:hover': { bgcolor: '#f9fafb' } }}>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: '0.85rem' }}>{lead.name}</TableCell>
                  <TableCell>
                    <Chip label={lead.status} color={lead.color} size="small" variant="light" sx={{ fontWeight: 'bold', borderRadius: 1 }} />
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.85rem', color: 'text.secondary' }}>{lead.plan}</TableCell>
                  <TableCell sx={{ fontSize: '0.85rem', color: 'text.secondary' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <LocationOnIcon sx={{ fontSize: 16, color: 'action.disabled' }} />
                      {lead.location}
                    </Box>
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.85rem', color: 'text.secondary' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <AccessTimeIcon sx={{ fontSize: 16, color: 'action.disabled' }} />
                      {lead.time}
                    </Box>
                  </TableCell>
                  <TableCell align="right" sx={{ pr: 2 }}>
                    <IconButton size="small" color="primary" sx={{ mr: 1 }}><PhoneIcon fontSize="small" /></IconButton>
                    <IconButton size="small" color="success"><WhatsAppIcon fontSize="small" /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
      <Divider />
      <Box sx={{ p: 2, textCenter: 'center', bgcolor: '#fafafa' }}>
        <Button fullWidth size="small" color="primary" sx={{ fontWeight: 'bold' }}>
          Ver todos los leads de la zona
        </Button>
      </Box>
    </Card>
  );
};

export default LeadsFollowUp;