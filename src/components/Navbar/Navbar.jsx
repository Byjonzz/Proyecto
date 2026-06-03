import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Badge, Avatar, Box } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';

const Navbar = ({ drawerWidth }) => {
  return (
    <AppBar
      position="fixed"
      sx={{
        width: `calc(100% - ${drawerWidth}px)`,
        ml: `${drawerWidth}px`,
        backgroundColor: '#ffffff',
        color: 'text.primary',
        boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.05)', 
      }}
    >
      <Toolbar>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 'bold' }}>
            ¡Hola, Carlos! 👋
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Bienvenido a SOLIT - Plataforma de Canvaceo
          </Typography>
        </Box>

        <IconButton size="large" color="inherit" sx={{ mr: 2 }}>
          <Badge badgeContent={1} color="error">
            <NotificationsIcon sx={{ color: 'action.active' }} />
          </Badge>
        </IconButton>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, borderLeft: '1px solid #e0e0e0', pl: 2 }}>
          <Avatar sx={{ bgcolor: 'primary.main' }}>C</Avatar>
          <Box sx={{ display: { xs: 'none', md: 'block' } }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', lineHeight: 1.2 }}>
              Carlos Promotor
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Canvaceador
            </Typography>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;