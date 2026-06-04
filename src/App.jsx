import React, { useState, useEffect } from 'react';
import { Box, CssBaseline, AppBar, Toolbar, IconButton, Typography, Avatar, Menu, MenuItem, Divider, ListItemIcon } from '@mui/material';
import { Menu as MenuIcon, Logout, Person } from '@mui/icons-material';
import Sidebar from './components/Sidebar/Sidebar';
import Login from './components/Login/Login';

// Importar módulos
import PlansManagement from './components/Admin/PlansManagement';
import CoverageMap from './components/Dashboard/CoverageMap';
import NewProspect from './components/Forms/NewProspect';
import CanvaceadorRuta from './components/Dashboard/CanvaceadorRuta';
import PlanAndQuotation from './components/Forms/PlanAndQuotation';
import LeadsFollowUp from './components/Dashboard/LeadsFollowUp';
import InstallationSchedule from './components/Dashboard/InstallationSchedule';
import TecnicoEjecucion from './components/Dashboard/TecnicoEjecucion';
import Comisiones from './components/Dashboard/Comisiones';
import AsignacionRutas from './components/Dashboard/AsignacionRutas';

const drawerWidth = 260;

function App() {
  const [usuarioActual, setUsuarioActual] = useState(null);
  const [currentView, setCurrentView] = useState('canvaceo-dashboard');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  // Verificar si hay usuario al cargar
  useEffect(() => {
    const usuarioGuardado = localStorage.getItem('usuario_actual');
    if (usuarioGuardado) {
      setUsuarioActual(JSON.parse(usuarioGuardado));
    }
  }, []);

  const handleLoginSuccess = (datosUsuario) => {
    setUsuarioActual(datosUsuario);
  };

  const handleLogout = () => {
    localStorage.removeItem('usuario_actual');
    setUsuarioActual(null);
    setCurrentView('canvaceo-dashboard');
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Si no hay usuario, mostrar login
  if (!usuarioActual) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  const renderContent = () => {
    switch (currentView) {
      case 'canvaceo-dashboard': return <CoverageMap />;
      case 'canvaceo-registro': return <NewProspect usuarioActual={usuarioActual} />;
      case 'canvaceo-ruta': return <CanvaceadorRuta />;
      case 'ventas-contrato-directo': return <PlanAndQuotation />;
      case 'ventas-seguimiento': return <LeadsFollowUp />;
      case 'logistica-agenda': return <InstallationSchedule />;
      case 'tecnico-ejecucion': return <TecnicoEjecucion />;
      case 'admin-comisiones': return <Comisiones />;
      case 'admin-asignacion-rutas': return <AsignacionRutas />;
      case 'admin-rutas': return <AsignacionRutas />;
      case 'admin-planes': return <PlansManagement />;
      default: return <CoverageMap />;
    }
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <CssBaseline />
      
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          display: { md: 'none' },
          backgroundColor: '#0f172a'
        }}
      >
        <Toolbar>
          <IconButton color="inherit" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2, display: { md: 'none' } }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 700 }}>
            Solit System
          </Typography>
        </Toolbar>
      </AppBar>
      
      <Sidebar 
        currentView={currentView} 
        setCurrentView={setCurrentView} 
        mobileOpen={mobileOpen}
        handleDrawerToggle={handleDrawerToggle}
      />
      
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          p: { xs: 2, md: 4 }, 
          mt: { xs: 7, md: 0 }, 
          width: { md: `calc(100% - ${drawerWidth}px)` },
          overflowY: 'auto' 
        }}
      >
        {/* Header con info del usuario */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'flex-end', 
          mb: 2,
          alignItems: 'center',
          gap: 2
        }}>
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {usuarioActual.nombre}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'capitalize' }}>
              {usuarioActual.tipo} • {usuarioActual.numero_empleado}
            </Typography>
          </Box>
          <Avatar 
            sx={{ 
              bgcolor: '#667eea', 
              cursor: 'pointer',
              width: 40,
              height: 40
            }}
            onClick={handleMenuOpen}
          >
            {usuarioActual.nombre?.charAt(0) || 'U'}
          </Avatar>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem disabled>
              <ListItemIcon><Person fontSize="small" /></ListItemIcon>
              {usuarioActual.nombre}
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>
              <ListItemIcon><Logout fontSize="small" /></ListItemIcon>
              Cerrar Sesión
            </MenuItem>
          </Menu>
        </Box>

        {renderContent()}
      </Box>
    </Box>
  );
}

export default App;