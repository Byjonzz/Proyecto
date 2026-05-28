import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline, Box, Toolbar, Container } from '@mui/material';

// Navegación
import Navbar from './components/Navbar/Navbar';
import Sidebar from './components/Sidebar/Sidebar';

// Todos tus Componentes
import MetricsSection from './components/Dashboard/MetricsSection';
import RecentActivity from './components/Dashboard/RecentActivity';
import CoverageMap from './components/Dashboard/CoverageMap';
import NewProspect from './components/Forms/NewProspect';
import LeadsFollowUp from './components/Dashboard/LeadsFollowUp';
import ContractAndSignature from './components/Forms/ContractAndSignature';
import Evidence from './components/Dashboard/Evidence';
import InstallationSchedule from './components/Dashboard/InstallationSchedule';
import Reports from './components/Dashboard/Reports';

// Crear el tema con los colores de SOLIT
const theme = createTheme({
  palette: {
    primary: {
      main: '#1c3580', // Azul SOLIT
    },
    background: {
      default: '#f3f4f6', // Fondo gris claro
    },
  },
  typography: {
    fontFamily: '"Plus Jakarta Sans", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  shape: {
    borderRadius: 12,
  },
});

const drawerWidth = 260;

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      
      <Box sx={{ display: 'flex', height: '100vh' }}>
        <Navbar drawerWidth={drawerWidth} />
        <Sidebar drawerWidth={drawerWidth} />
        
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            height: '100vh',
            overflow: 'auto',
            backgroundColor: 'background.default',
          }}
        >
          {/* Este Toolbar empuja el contenido hacia abajo para que el Navbar no lo tape */}
          <Toolbar /> 
          
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Routes>
              {/* Dashboard: Agrupa las métricas y la actividad reciente */}
              <Route path="/" element={
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <MetricsSection />
                  <RecentActivity />
                </Box>
              } />
              
              {/* Rutas conectadas a sus componentes reales */}
              <Route path="/prospectos" element={<NewProspect />} />
              <Route path="/mapa-cobertura" element={<CoverageMap />} />
              <Route path="/leads" element={<LeadsFollowUp />} />
              <Route path="/contratos" element={<ContractAndSignature />} />
              <Route path="/evidencias" element={<Evidence />} />
              <Route path="/agenda" element={<InstallationSchedule />} />
              <Route path="/reportes" element={<Reports />} />
            </Routes>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;