import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton
} from '@mui/material';
import {
  Login as LoginIcon,
  Email,
  Lock,
  Visibility,
  VisibilityOff
} from '@mui/icons-material';
import api from '../../services/api';

const Login = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError('Ingresa tu correo y contraseña');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await api.get('/canvaceadores/');
      const canvaceadores = response.data;

      const usuarioEncontrado = canvaceadores.find(c => {
        if (c.email?.toLowerCase() === email.toLowerCase()) {
          return true;
        }
        if (c.usuario_email?.toLowerCase() === email.toLowerCase()) {
          return true;
        }
        return false;
      });

      if (usuarioEncontrado) {
        const datosUsuario = {
          id: usuarioEncontrado.id,
          tipo: 'canvaceador',
          numero_empleado: usuarioEncontrado.numero_empleado,
          nombre: usuarioEncontrado.nombre_completo || usuarioEncontrado.numero_empleado,
          email: email
        };

        localStorage.setItem('usuario_actual', JSON.stringify(datosUsuario));
        onLoginSuccess(datosUsuario);
      } else {
        setError('Correo o contraseña incorrectos');
      }
    } catch (err) {
      setError('Error al conectar con el servidor. Intenta de nuevo.');
      console.error('Error en login:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        // Imagen de fondo optimizada
        backgroundImage: `url('https://i.pinimg.com/736x/e0/4c/4f/e04c4f9207ea8c98ee199c4f43013947.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        // Optimización para imagen nítida
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `url('https://i.pinimg.com/736x/e0/4c/4f/e04c4f9207ea8c98ee199c4f43013947.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(0.4)',
          zIndex: -2
        },
        // Overlay con gradiente usando la paleta de colores
        '&::after': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, rgba(23, 23, 24, 0.7) 0%, rgba(31, 33, 36, 0.7) 50%, rgba(57, 61, 66, 0.6) 100%)',
          zIndex: -1
        },
        p: 2
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: 5,
          maxWidth: 480,
          width: '100%',
          borderRadius: 3,
          position: 'relative',
          zIndex: 1,
          // Fondo con color sólido de la paleta
          background: 'rgba(31, 33, 36, 0.95)',
          border: '1px solid rgba(106, 110, 115, 0.3)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)'
        }}
      >
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Box
            sx={{
              width: 90,
              height: 90,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #6a6e73 0%, #9fa3a9 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 2,
              boxShadow: '0 8px 20px rgba(106, 110, 115, 0.4)',
            }}
          >
            <LoginIcon sx={{ fontSize: 50, color: '#171718' }} />
          </Box>
          <Typography 
            variant="h3" 
            sx={{ 
              fontWeight: 900, 
              color: '#9fa3a9',
              mb: 1,
              letterSpacing: '-0.5px'
            }}
          >
            Solit System
          </Typography>
          <Typography variant="body1" sx={{ color: '#7b7e81', fontWeight: 500, fontSize: '1rem' }}>
            Portal de Canvaceadores
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3, background: 'rgba(239, 68, 68, 0.2)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.3)', fontWeight: 500 }}>
            {error}
          </Alert>
        )}

        {/* Campo de Correo */}
        <TextField
          label="Correo Electrónico"
          type="email"
          fullWidth
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
          sx={{ 
            mb: 2.5,
            '& .MuiOutlinedInput-root': {
              color: '#9fa3a9',
              '& fieldset': {
                borderColor: '#393d42',
              },
              '&:hover fieldset': {
                borderColor: '#6a6e73',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#9fa3a9',
              },
            },
            '& .MuiInputLabel-root': {
              color: '#6a6e73',
              '&.Mui-focused': {
                color: '#9fa3a9',
              },
            },
          }}
          placeholder="ejemplo@correo.com"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Email sx={{ color: '#6a6e73' }} />
              </InputAdornment>
            ),
          }}
        />

        {/* Campo de Contraseña */}
        <TextField
          label="Contraseña"
          type={showPassword ? 'text' : 'password'}
          fullWidth
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
          sx={{ 
            mb: 3,
            '& .MuiOutlinedInput-root': {
              color: '#9fa3a9',
              '& fieldset': {
                borderColor: '#393d42',
              },
              '&:hover fieldset': {
                borderColor: '#6a6e73',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#9fa3a9',
              },
            },
            '& .MuiInputLabel-root': {
              color: '#6a6e73',
              '&.Mui-focused': {
                color: '#9fa3a9',
              },
            },
          }}
          placeholder="••••••••"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Lock sx={{ color: '#6a6e73' }} />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                  sx={{ color: '#6a6e73' }}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Button
          variant="contained"
          fullWidth
          size="large"
          onClick={handleLogin}
          disabled={loading}
          sx={{
            py: 1.8,
            fontWeight: 800,
            fontSize: '1.1rem',
            background: 'linear-gradient(135deg, #9fa3a9 0%, #6a6e73 100%)',
            borderRadius: 2,
            boxShadow: '0 8px 20px rgba(159, 163, 169, 0.3)',
            color: '#171718',
            '&:hover': { 
              background: 'linear-gradient(135deg, #6a6e73 0%, #9fa3a9 100%)',
              boxShadow: '0 12px 28px rgba(159, 163, 169, 0.4)',
              transform: 'translateY(-2px)',
              transition: 'all 0.3s ease'
            },
            '&:disabled': {
              background: '#393d42',
              color: '#6a6e73'
            }
          }}
        >
          {loading ? (
            <CircularProgress size={28} sx={{ color: '#9fa3a9' }} />
          ) : (
            'INICIAR SESIÓN'
          )}
        </Button>

        <Typography
          variant="caption"
          sx={{ 
            display: 'block', 
            textAlign: 'center', 
            mt: 3,
            color: '#757a80',
            fontWeight: 500
          }}
        >
          © 2026 Solit System - Todos los derechos reservados
        </Typography>
      </Paper>
    </Box>
  );
};

export default Login;