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

const drawerWidth = 260;

function App() {
  const [currentView, setCurrentView] = useState('canvaceo-dashboard');
  const [mobileOpen, setMobileOpen] = useState(false); // Estado para menú en celular

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const renderContent = () => {
    switch (currentView) {
      case 'canvaceo-dashboard': return <CoverageMap />;
      case 'canvaceo-registro': return <NewProspect />;
      case 'canvaceo-ruta': return <CanvaceadorRuta />;
      case 'ventas-contrato-directo': return <PlanAndQuotation />;
      case 'ventas-seguimiento': return <LeadsFollowUp />;
      case 'logistica-agenda': return <InstallationSchedule />;
      case 'tecnico-ejecucion': return <TecnicoEjecucion />;
      default: return <CoverageMap />;
    }
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <CssBaseline />
      
      {/* BARRA SUPERIOR (SOLO VISIBLE EN MÓVILES) */}
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          display: { md: 'none' }, // Se oculta en computadoras
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
      
      {/* SIDEBAR RESPONSIVO */}
      <Sidebar 
        currentView={currentView} 
        setCurrentView={setCurrentView} 
        mobileOpen={mobileOpen}
        handleDrawerToggle={handleDrawerToggle}
      />
      
      {/* CONTENEDOR PRINCIPAL */}
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          p: { xs: 2, md: 4 }, // Menos padding en celular
          mt: { xs: 7, md: 0 }, // Margen superior en celular para que la AppBar no tape el contenido
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