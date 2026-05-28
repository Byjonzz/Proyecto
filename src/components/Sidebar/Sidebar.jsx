import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, 
  Toolbar, Box, Typography, Divider 
} from '@mui/material';

// Íconos oficiales de Material UI
import DashboardIcon from '@mui/icons-material/Dashboard';
import MapIcon from '@mui/icons-material/Map';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import AssignmentIcon from '@mui/icons-material/Assignment';
import DrawIcon from '@mui/icons-material/Draw';
import LogoutIcon from '@mui/icons-material/Logout';

const Sidebar = ({ drawerWidth }) => {
  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
    { text: 'Mapa cobertura', icon: <MapIcon />, path: '/mapa-cobertura' },
    { text: 'Prospectos', icon: <GroupAddIcon />, path: '/prospectos' },
    { text: 'Leads y seguimientos', icon: <AssignmentIcon />, path: '/leads' },
    { text: 'Contratos y firmas', icon: <DrawIcon />, path: '/contratos' },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          backgroundColor: 'primary.main', // Azul SOLIT
          color: 'white',
        },
      }}
    >
      <Toolbar sx={{ display: 'flex', flexDirection: 'column', py: 2, height: 100 }}>
        <Typography variant="h5" fontWeight="bold" letterSpacing={2}>
          SOLIT®
        </Typography>
        <Typography variant="caption" sx={{ opacity: 0.7, letterSpacing: 1 }}>
          WIRELESS & FIBRA ÓPTICA
        </Typography>
      </Toolbar>
      <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />
      
      <List sx={{ flexGrow: 1, pt: 2 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            {/* NavLink maneja la ruta, ListItemButton le da el estilo de botón Material */}
            <ListItemButton 
              component={NavLink} 
              to={item.path}
              sx={{
                '&.active': {
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  borderLeft: '4px solid white',
                },
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                }
              }}
            >
              <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} primaryTypographyProps={{ fontSize: '0.9rem' }} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />
      <List>
        <ListItem disablePadding>
          <ListItemButton sx={{ '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.08)' } }}>
            <ListItemIcon sx={{ color: 'white', minWidth: 40 }}><LogoutIcon /></ListItemIcon>
            <ListItemText primary="Cerrar sesión" primaryTypographyProps={{ fontSize: '0.9rem' }} />
          </ListItemButton>
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar;