import React from 'react';
import { 
  Card, CardContent, CardHeader, CardActions, Typography, 
  TextField, Button, Grid, Box, Chip, Divider 
} from '@mui/material';
import EditNoteIcon from '@mui/icons-material/EditNote';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

const NewProspect = () => {
  return (
    <Card elevation={0} sx={{ border: '1px solid #e0e0e0' }}>
      
      {/* Cabecera del formulario */}
      <CardHeader 
        title={<Typography variant="h6" fontWeight="bold">Registro en Campo</Typography>}
        subheader="Captura los datos del cliente durante el recorrido."
        action={
          <Chip 
            icon={<EditNoteIcon />} 
            label="Estado: Prospecto (Falta contrato)" 
            color="warning" 
            variant="outlined" 
            sx={{ mt: 1, fontWeight: 'bold' }}
          />
        }
        sx={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e0e0e0' }}
      />

      <CardContent sx={{ p: 4 }}>
        <Grid container spacing={4}>
          
          {/* Columna Izquierda */}
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" fontWeight="bold" color="primary" gutterBottom>
              Datos Personales
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <TextField 
                label="Nombre Completo" 
                variant="outlined" 
                fullWidth 
                placeholder="Ej. Juan Pérez"
              />
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField 
                    label="Teléfono" 
                    variant="outlined" 
                    fullWidth 
                    type="tel"
                    placeholder="10 dígitos"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField 
                    label="Correo (Opcional)" 
                    variant="outlined" 
                    fullWidth 
                    type="email"
                    placeholder="correo@ejemplo.com"
                  />
                </Grid>
              </Grid>
            </Box>
          </Grid>

          {/* Columna Derecha */}
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" fontWeight="bold" color="primary" gutterBottom>
              Ubicación y Cobertura
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <TextField 
                label="Dirección Exacta" 
                variant="outlined" 
                fullWidth 
                placeholder="Calle, Número, Colonia"
              />
              <TextField 
                label="Referencias del domicilio" 
                variant="outlined" 
                fullWidth 
                multiline
                rows={3}
                placeholder="Ej. Casa color verde, portón negro..."
              />
            </Box>
          </Grid>

        </Grid>
      </CardContent>

      <Divider />
      
      {/* Botones de acción */}
      <CardActions sx={{ justifyContent: 'flex-end', p: 3, backgroundColor: '#f9fafb' }}>
        <Button 
          variant="text" 
          color="inherit" 
          startIcon={<CancelIcon />}
          sx={{ mr: 1 }}
        >
          Cancelar
        </Button>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<SaveIcon />}
          disableElevation
        >
          Guardar Prospecto
        </Button>
      </CardActions>
    </Card>
  );
};

export default NewProspect;