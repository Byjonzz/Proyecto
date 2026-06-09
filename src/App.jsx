import React, { useState, useEffect } from 'react';
import { Box, CssBaseline, AppBar, Toolbar, IconButton, Typography, Avatar, Menu, MenuItem, Divider, ListItemIcon, Chip } from '@mui/material';
import { Menu as MenuIcon, Logout, Person } from '@mui/icons-material';
import Sidebar from './components/Sidebar/Sidebar';
import Login from './components/Login/Login';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import { obtenerPrimeraRuta, obtenerNombreRol, obtenerColorRol } from './config/roles';


import PlansManagement from './components/Admin/PlansManagement';
import CoverageMap from './components/Dashboard/CoverageMap';
import NewProspect from './components/Forms/NewProspect';
import CanvaceadorRuta from './components/Dashboard/CanvaceadorRuta';
import PlanAndQuotation from './components/Ventas/PlanAndQuotation';
import LeadsFollowUp from './components/Ventas/LeadsFollowUp';
import InstallationSchedule from './components/Dashboard/InstallationSchedule';
import TecnicoEjecucion from './components/Dashboard/TecnicoEjecucion';
import Comisiones from './components/Dashboard/Comisiones';
import AsignacionRutas from './components/Dashboard/AsignacionRutas';
import SimSales from './components/Ventas/SimSales';


const drawerWidth = 260;
const API_BASE_URL = 'http://10.144.86.55:1423/api';



const loginUsuario = async (email, password) => {
  try {
    console.log('🔍 Intentando login con GET a /api/usuarios/');
    
    const response = await fetch(`${API_BASE_URL}/usuarios/`);
    
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }
    
    let usuarios = await response.json();
    
    if (!Array.isArray(usuarios)) {
      usuarios = usuarios.results || usuarios.data || [];
    }
    
    console.log('📋 Usuarios recibidos:', usuarios.length);
    
    const emailLimpio = email.toLowerCase().trim();
    const passwordLimpia = password.trim();
    
    const usuarioEncontrado = usuarios.find(u => {
      const emailUsuario = (u.email || '').toLowerCase().trim();
      const passwordUsuario = (u.password || '').trim();
      return emailUsuario === emailLimpio && passwordUsuario === passwordLimpia;
    });
    
    if (!usuarioEncontrado) {
      throw new Error('Credenciales inválidas');
    }
    
    console.log('✅ Usuario encontrado:', usuarioEncontrado);
    
    const rol = usuarioEncontrado.rol?.toLowerCase().trim();
    let perfilData = null;
    
    try {
      if (rol === 'canvaceador') {
        const canvResponse = await fetch(`${API_BASE_URL}/canvaceadores/`);
        let canvaceadores = await canvResponse.json();
        if (!Array.isArray(canvaceadores)) canvaceadores = canvaceadores.results || [];
        perfilData = canvaceadores.find(c => c.usuario_id === usuarioEncontrado.id);
      } else if (rol === 'tecnico') {
        const tecResponse = await fetch(`${API_BASE_URL}/tecnicos/`);
        let tecnicos = await tecResponse.json();
        if (!Array.isArray(tecnicos)) tecnicos = tecnicos.results || [];
        perfilData = tecnicos.find(t => t.usuario_id === usuarioEncontrado.id);
      } else if (rol === 'supervisor') {
        const supResponse = await fetch(`${API_BASE_URL}/supervisores/`);
        let supervisores = await supResponse.json();
        if (!Array.isArray(supervisores)) supervisores = supervisores.results || [];
        perfilData = supervisores.find(s => s.usuario_id === usuarioEncontrado.id);
      }
    } catch (err) {
      console.warn('⚠️ Error obteniendo perfil:', err.message);
    }
    
    const resultado = {
      success: true,
      usuario: {
        id: usuarioEncontrado.id,
        nombre: `${usuarioEncontrado.nombre} ${usuarioEncontrado.apellido}`,
        email: usuarioEncontrado.email,
        rol: rol,
        perfil_id: perfilData?.id || usuarioEncontrado.id,
        numero_empleado: perfilData?.numero_empleado || null
      }
    };
    
    console.log('✅ Retornando resultado:', resultado);
    return resultado;
    
  } catch (error) {
    console.error('❌ Error en login:', error);
    throw error;
  }
};


function App() {
  const [usuarioActual, setUsuarioActual] = useState(null);
  const [currentView, setCurrentView] = useState('canvaceo-dashboard');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem('usuario_actual');
    if (usuarioGuardado) {
      const usuario = JSON.parse(usuarioGuardado);
      setUsuarioActual(usuario);
      const primeraRuta = obtenerPrimeraRuta(usuario.rol);
      setCurrentView(primeraRuta);
    }
  }, []);

  const handleLoginSuccess = (datosUsuario) => {
    console.log('🎉 Login exitoso, guardando usuario:', datosUsuario);
    localStorage.setItem('usuario_actual', JSON.stringify(datosUsuario));
    setUsuarioActual(datosUsuario);
    const primeraRuta = obtenerPrimeraRuta(datosUsuario.rol);
    setCurrentView(primeraRuta);
  };

  const handleLogout = () => {
    localStorage.removeItem('usuario_actual');
    setUsuarioActual(null);
    setAnchorEl(null);
    setCurrentView('canvaceo-dashboard');
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNavigate = (ruta) => {
    setCurrentView(ruta);
  };

  if (!usuarioActual) {
    return <Login onLoginSuccess={handleLoginSuccess} loginFunction={loginUsuario} />;
  }

  const renderContent = () => {
    switch (currentView) {
      case 'canvaceo-dashboard': return <CoverageMap />;
      case 'canvaceo-registro': return <NewProspect usuarioActual={usuarioActual} />;
      case 'canvaceo-ruta': return <CanvaceadorRuta />;
      case 'ventas-contrato-directo': return <PlanAndQuotation />;
      case 'ventas-seguimiento': return <LeadsFollowUp />;
      case 'ventas-de-chips': return <SimSales />;
      case 'logistica-agenda': return <InstallationSchedule />;
      case 'tecnico-ejecucion': return <TecnicoEjecucion usuarioActual={usuarioActual} />;
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
        usuario={usuarioActual}
      />
      
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          p: { xs: 2, md: 4 }, 
          mt: { xs: 7, md: 0 }, 
          width: { md: `calc(100% - ${drawerWidth}px)` },
          overflowY: 'auto',
          minHeight: '100vh'
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'flex-end', 
          mb: 3,
          alignItems: 'center',
          gap: 2
        }}>
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {usuarioActual.nombre}
            </Typography>
            <Chip
              label={obtenerNombreRol(usuarioActual.rol)}
              size="small"
              sx={{
                bgcolor: obtenerColorRol(usuarioActual.rol),
                color: 'white',
                fontWeight: 700,
                fontSize: '0.7rem',
                height: 20,
                mt: 0.5
              }}
            />
          </Box>
          
          <Avatar 
            id="user-menu-avatar"
            sx={{ 
              bgcolor: obtenerColorRol(usuarioActual.rol), 
              cursor: 'pointer',
              width: 44,
              height: 44,
              fontWeight: 700,
              fontSize: '1.2rem'
            }}
            onClick={(event) => setAnchorEl(event.currentTarget)}
          >
            {usuarioActual.nombre?.charAt(0) || 'U'}
          </Avatar>
          
          {anchorEl && (
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              slotProps={{
                paper: {
                  elevation: 3,
                  sx: {
                    minWidth: 220,
                    mt: 1,
                    overflow: 'visible',
                    borderRadius: 2,
                    '&:before': {
                      content: '""',
                      display: 'block',
                      position: 'absolute',
                      top: 0,
                      right: 14,
                      width: 10,
                      height: 10,
                      bgcolor: 'background.paper',
                      transform: 'translateY(-50%) rotate(45deg)',
                      zIndex: 0,
                    },
                  },
                },
              }}
            >
              <MenuItem disabled sx={{ opacity: 1 }}>
                <ListItemIcon>
                  <Person fontSize="small" color="action" />
                </ListItemIcon>
                <Typography variant="body2" noWrap sx={{ maxWidth: 180, color: 'text.secondary' }}>
                  {usuarioActual.email}
                </Typography>
              </MenuItem>
              {usuarioActual.numero_empleado && (
                <MenuItem disabled sx={{ opacity: 1, pt: 0 }}>
                  <ListItemIcon>
                    <Person fontSize="small" color="action" />
                  </ListItemIcon>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    Empleado: {usuarioActual.numero_empleado}
                  </Typography>
                </MenuItem>
              )}
              <Divider />
              <MenuItem 
                onClick={handleLogout}
                sx={{ 
                  color: 'error.main',
                  '&:hover': { 
                    bgcolor: 'error.light',
                    color: 'white'
                  }
                }}
              >
                <ListItemIcon>
                  <Logout fontSize="small" color="error" />
                </ListItemIcon>
                Cerrar Sesión
              </MenuItem>
            </Menu>
          )}
        </Box>

        <ProtectedRoute
          usuario={usuarioActual}
          rutaActual={currentView}
          onNavigate={handleNavigate}
        >
          {renderContent()}
        </ProtectedRoute>
      </Box>
    </Box>
  );
}

export default App;