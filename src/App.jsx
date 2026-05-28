import React, { useState } from 'react';
import { Box, CssBaseline } from '@mui/material';
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
import TecnicoEjecucion from './components/Dashboard/TecnicoEjecucion'; // <--- ¡AQUÍ ESTÁ LA IMPORTACIÓN FALTANTE!

function App() {
  const [currentView, setCurrentView] = useState('canvaceo-dashboard');

  const renderContent = () => {
    switch (currentView) {
      // Bloque Canvaceo
      case 'canvaceo-dashboard':
        return <CoverageMap />;
      case 'canvaceo-registro':
        return <NewProspect />;
      case 'canvaceo-ruta':
        return <CanvaceadorRuta />;
      
      // Bloque Ventas
      case 'ventas-contrato-directo':
        return <PlanAndQuotation />;
      case 'ventas-seguimiento':
        return <LeadsFollowUp />;
      
      // Bloque Logística
      case 'logistica-agenda':
        return <InstallationSchedule />;
        
      // Bloque Técnico
      case 'tecnico-ejecucion':
        return <TecnicoEjecucion />;

      default:
        return <CoverageMap />;
    }
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <CssBaseline />
      
      {/* Sidebar fijo de Material UI */}
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
      
      {/* Contenedor de Vistas */}
      <Box component="main" sx={{ flexGrow: 1, p: 4, width: '100%', overflowY: 'auto' }}>
        {renderContent()}
      </Box>
    </Box>
  );
}

export default App;