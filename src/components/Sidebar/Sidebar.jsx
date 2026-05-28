import React, { useState } from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Typography,
  Box,
  Divider,
  Avatar
} from '@mui/material';
import {
  MapOutlined,
  MonetizationOnOutlined,
  LocalShippingOutlined,
  EngineeringOutlined,
  ExpandLess,
  ExpandMore,
  Layers,
  Map,
  PersonAdd,
  DirectionsRun,
  Assignment,
  Assessment,
  Build
} from '@mui/icons-material';

const drawerWidth = 260;

const Sidebar = ({ currentView, setCurrentView }) => {
  const [openMenus, setOpenMenus] = useState({
    canvaceo: true,
    ventas: false,
    logistica: false,
    tecnico: false
  });

  const handleToggle = (menu) => {
    setOpenMenus((prev) => ({ ...prev, [menu]: !prev[menu] }));
  };

  const isActive = (viewName) => currentView === viewName;

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: 'border-box',
          backgroundColor: '#1e293b',
          color: '#f8fafc',
          borderRight: '1px solid #334155',
        },
      }}
    >
      {/* Header */}
      <Box sx={{ p: 2.5, display: 'flex', alignItems: 'center', gap: 2, backgroundColor: '#0f172a' }}>
        <Avatar sx={{ bgcolor: '#3b82f6', width: 40, height: 40 }}>
          <Layers />
        </Avatar>
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
            Solit System
          </Typography>
          <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 500 }}>
            Panel Corporativo
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ borderColor: '#334155' }} />

      <List sx={{ px: 1.5, py: 2, flexGrow: 1 }} component="nav">
        
        {/* CANVACEO */}
        <ListItem disablePadding sx={{ display: 'block', mb: 0.5 }}>
          <ListItemButton onClick={() => handleToggle('canvaceo')} sx={{ borderRadius: '8px', color: openMenus.canvaceo ? '#60a5fa' : '#cbd5e1' }}>
            <ListItemIcon sx={{ color: openMenus.canvaceo ? '#60a5fa' : '#94a3b8', minWidth: 40 }}><MapOutlined /></ListItemIcon>
            <ListItemText primary="Canvaceo" slotProps={{ primary: { sx: { fontWeight: 600, fontSize: '0.95rem' } } }} />
            {openMenus.canvaceo ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={openMenus.canvaceo} timeout="auto" unmountOnExit>
            <List component="div" disablePadding sx={{ pl: 3, mt: 0.5, position: 'relative' }}>
              <Box sx={{ position: 'absolute', left: 12, top: 0, bottom: 0, width: '1px', backgroundColor: '#334155' }} />
              <ListItemButton onClick={() => setCurrentView('canvaceo-dashboard')} selected={isActive('canvaceo-dashboard')} sx={{ borderRadius: '6px', mb: 0.5, color: isActive('canvaceo-dashboard') ? '#60a5fa' : '#94a3b8', '&.Mui-selected': { backgroundColor: 'rgba(59, 130, 246, 0.15)' } }}>
                <ListItemIcon sx={{ color: 'inherit', minWidth: 32 }}><Map sx={{ fontSize: 18 }} /></ListItemIcon>
                <ListItemText primary="Mapa de Cobertura" slotProps={{ primary: { sx: { fontSize: '0.85rem' } } }} />
              </ListItemButton>
              <ListItemButton onClick={() => setCurrentView('canvaceo-registro')} selected={isActive('canvaceo-registro')} sx={{ borderRadius: '6px', mb: 0.5, color: isActive('canvaceo-registro') ? '#60a5fa' : '#94a3b8', '&.Mui-selected': { backgroundColor: 'rgba(59, 130, 246, 0.15)' } }}>
                <ListItemIcon sx={{ color: 'inherit', minWidth: 32 }}><PersonAdd sx={{ fontSize: 18 }} /></ListItemIcon>
                <ListItemText primary="Nuevo Prospecto" slotProps={{ primary: { sx: { fontSize: '0.85rem' } } }} />
              </ListItemButton>
              <ListItemButton onClick={() => setCurrentView('canvaceo-ruta')} selected={isActive('canvaceo-ruta')} sx={{ borderRadius: '6px', mb: 0.5, color: isActive('canvaceo-ruta') ? '#60a5fa' : '#94a3b8', '&.Mui-selected': { backgroundColor: 'rgba(59, 130, 246, 0.15)' } }}>
                <ListItemIcon sx={{ color: 'inherit', minWidth: 32 }}><DirectionsRun sx={{ fontSize: 18 }} /></ListItemIcon>
                <ListItemText primary="Mi Ruta Diaria" slotProps={{ primary: { sx: { fontSize: '0.85rem' } } }} />
              </ListItemButton>
            </List>
          </Collapse>
        </ListItem>

        {/* VENTAS */}
        <ListItem disablePadding sx={{ display: 'block', mb: 0.5 }}>
          <ListItemButton onClick={() => handleToggle('ventas')} sx={{ borderRadius: '8px', color: openMenus.ventas ? '#34d399' : '#cbd5e1' }}>
            <ListItemIcon sx={{ color: openMenus.ventas ? '#34d399' : '#94a3b8', minWidth: 40 }}><MonetizationOnOutlined /></ListItemIcon>
            <ListItemText primary="Ventas" slotProps={{ primary: { sx: { fontWeight: 600, fontSize: '0.95rem' } } }} />
            {openMenus.ventas ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={openMenus.ventas} timeout="auto" unmountOnExit>
            <List component="div" disablePadding sx={{ pl: 3, mt: 0.5, position: 'relative' }}>
              <Box sx={{ position: 'absolute', left: 12, top: 0, bottom: 0, width: '1px', backgroundColor: '#334155' }} />
              <ListItemButton onClick={() => setCurrentView('ventas-contrato-directo')} selected={isActive('ventas-contrato-directo')} sx={{ borderRadius: '6px', mb: 0.5, color: isActive('ventas-contrato-directo') ? '#34d399' : '#94a3b8', '&.Mui-selected': { backgroundColor: 'rgba(16, 185, 129, 0.15)' } }}>
                <ListItemIcon sx={{ color: 'inherit', minWidth: 32 }}><Assignment sx={{ fontSize: 18 }} /></ListItemIcon>
                <ListItemText primary="Contrato Directo" slotProps={{ primary: { sx: { fontSize: '0.85rem' } } }} />
              </ListItemButton>
              <ListItemButton onClick={() => setCurrentView('ventas-seguimiento')} selected={isActive('ventas-seguimiento')} sx={{ borderRadius: '6px', mb: 0.5, color: isActive('ventas-seguimiento') ? '#34d399' : '#94a3b8', '&.Mui-selected': { backgroundColor: 'rgba(16, 185, 129, 0.15)' } }}>
                <ListItemIcon sx={{ color: 'inherit', minWidth: 32 }}><Assessment sx={{ fontSize: 18 }} /></ListItemIcon>
                <ListItemText primary="Seguimiento Leads" slotProps={{ primary: { sx: { fontSize: '0.85rem' } } }} />
              </ListItemButton>
            </List>
          </Collapse>
        </ListItem>

        {/* LOGÍSTICA */}
        <ListItem disablePadding sx={{ display: 'block', mb: 0.5 }}>
          <ListItemButton onClick={() => handleToggle('logistica')} sx={{ borderRadius: '8px', color: openMenus.logistica ? '#fbbf24' : '#cbd5e1' }}>
            <ListItemIcon sx={{ color: openMenus.logistica ? '#fbbf24' : '#94a3b8', minWidth: 40 }}><LocalShippingOutlined /></ListItemIcon>
            <ListItemText primary="Logística" slotProps={{ primary: { sx: { fontWeight: 600, fontSize: '0.95rem' } } }} />
            {openMenus.logistica ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={openMenus.logistica} timeout="auto" unmountOnExit>
            <List component="div" disablePadding sx={{ pl: 3, mt: 0.5, position: 'relative' }}>
              <Box sx={{ position: 'absolute', left: 12, top: 0, bottom: 0, width: '1px', backgroundColor: '#334155' }} />
              <ListItemButton onClick={() => setCurrentView('logistica-agenda')} selected={isActive('logistica-agenda')} sx={{ borderRadius: '6px', mb: 0.5, color: isActive('logistica-agenda') ? '#fbbf24' : '#94a3b8', '&.Mui-selected': { backgroundColor: 'rgba(245, 158, 11, 0.15)' } }}>
                <ListItemIcon sx={{ color: 'inherit', minWidth: 32 }}><Assignment sx={{ fontSize: 18 }} /></ListItemIcon>
                <ListItemText primary="Asignación de Citas" slotProps={{ primary: { sx: { fontSize: '0.85rem' } } }} />
              </ListItemButton>
            </List>
          </Collapse>
        </ListItem>

        {/* TÉCNICO */}
        <ListItem disablePadding sx={{ display: 'block', mb: 0.5 }}>
          <ListItemButton onClick={() => handleToggle('tecnico')} sx={{ borderRadius: '8px', color: openMenus.tecnico ? '#a78bfa' : '#cbd5e1' }}>
            <ListItemIcon sx={{ color: openMenus.tecnico ? '#a78bfa' : '#94a3b8', minWidth: 40 }}><EngineeringOutlined /></ListItemIcon>
            <ListItemText primary="Módulo Técnico" slotProps={{ primary: { sx: { fontWeight: 600, fontSize: '0.95rem' } } }} />
            {openMenus.tecnico ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={openMenus.tecnico} timeout="auto" unmountOnExit>
            <List component="div" disablePadding sx={{ pl: 3, mt: 0.5, position: 'relative' }}>
              <Box sx={{ position: 'absolute', left: 12, top: 0, bottom: 0, width: '1px', backgroundColor: '#334155' }} />
              <ListItemButton onClick={() => setCurrentView('tecnico-ejecucion')} selected={isActive('tecnico-ejecucion')} sx={{ borderRadius: '6px', mb: 0.5, color: isActive('tecnico-ejecucion') ? '#a78bfa' : '#94a3b8', '&.Mui-selected': { backgroundColor: 'rgba(167, 139, 250, 0.15)' } }}>
                <ListItemIcon sx={{ color: 'inherit', minWidth: 32 }}><Build sx={{ fontSize: 18 }} /></ListItemIcon>
                <ListItemText primary="Ejecución en Campo" slotProps={{ primary: { sx: { fontSize: '0.85rem' } } }} />
              </ListItemButton>
            </List>
          </Collapse>
        </ListItem>

      </List>
    </Drawer>
  );
};

export default Sidebar;