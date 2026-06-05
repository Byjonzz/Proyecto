import React from 'react';
import { Box, Typography, Paper, Button } from '@mui/material';
import { Lock, Home } from '@mui/icons-material';
import { puedeAccederARuta, obtenerPrimeraRuta, obtenerNombreRol } from '../../config/roles';

const ProtectedRoute = ({ usuario, rutaActual, children, onNavigate }) => {
  // Verificar si el usuario puede acceder a esta ruta
  const tieneAcceso = puedeAccederARuta(usuario?.rol, rutaActual);
  
  if (!tieneAcceso) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '60vh',
          p: 3
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 5,
            maxWidth: 500,
            textAlign: 'center',
            borderRadius: 3,
            background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
            border: '2px solid #fecaca'
          }}
        >
          <Lock sx={{ fontSize: 80, color: '#dc2626', mb: 2 }} />
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#991b1b', mb: 2 }}>
            Acceso Denegado
          </Typography>
          <Typography variant="body1" sx={{ color: '#7f1d1d', mb: 3 }}>
            No tienes permisos para acceder a esta sección.
          </Typography>
          <Typography variant="body2" sx={{ color: '#991b1b', mb: 3 }}>
            Tu rol actual es: <strong>{obtenerNombreRol(usuario?.rol)}</strong>
          </Typography>
          <Button
            variant="contained"
            startIcon={<Home />}
            onClick={() => onNavigate(obtenerPrimeraRuta(usuario?.rol))}
            sx={{
              background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
              fontWeight: 700,
              px: 4,
              py: 1.5,
              '&:hover': {
                background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)'
              }
            }}
          >
            Ir a mi inicio
          </Button>
        </Paper>
      </Box>
    );
  }
  
  return children;
};

export default ProtectedRoute;