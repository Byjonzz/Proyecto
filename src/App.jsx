import React, { useState } from 'react';
import { Box, CssBaseline, AppBar, Toolbar, IconButton, Typography } from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import Sidebar from './components/Sidebar/Sidebar';

// Minimódulos de Canvaceo
import CoverageMap from './components/Dashboard/CoverageMap';
import NewProspect from './components/Forms/NewProspect';
import CanvaceadorRuta from './components/Dashboard/CanvaceadorRuta';

// Minimódulos de Ventas
import PlanAndQuotation from './components/Forms/PlanAndQuotation';
import LeadsFollowUp from './components/Dashboard/LeadsFollowUp';

// Minimódulos de Logística y Técnico
import InstallationSchedule from './components/Dashboard/InstallationSchedule';
import TecnicoEjecucion from './components/Dashboard/TecnicoEjecucion';

// NUEVO: Minimódulo de Administración Ventas
import Comisiones from './components/Dashboard/Comisiones';
import AsignacionRutas from './components/Dashboard/AsignacionRutas';

const drawerWidth = 260;

function App() {
  const [currentView, setCurrentView] = useState('canvaceo-dashboard');
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const renderContent = () => {
    switch (currentView) {
      // Bloque Canvaceo
      case 'canvaceo-dashboard': return <CoverageMap />;
      case 'canvaceo-registro': return <NewProspect />;
      case 'canvaceo-ruta': return <CanvaceadorRuta />;
      
      // Bloque Ventas
      case 'ventas-contrato-directo': return <PlanAndQuotation />;
      case 'ventas-seguimiento': return <LeadsFollowUp />;
      
      // Bloque Logística
      case 'logistica-agenda': return <InstallationSchedule />;
      
      // Bloque Técnico
      case 'tecnico-ejecucion': return <TecnicoEjecucion />;

      // NUEVO: Bloque Administración Ventas
      case 'admin-comisiones': return <Comisiones />;
      case 'admin-asignacion-rutas': return <AsignacionRutas />;
      case 'admin-rutas': return <AsignacionRutas />; // <--- NUEVA RUTA AGREGADA

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
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
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
        {renderContent()}
      </Box>
    </Box>
  );
}

export default App;