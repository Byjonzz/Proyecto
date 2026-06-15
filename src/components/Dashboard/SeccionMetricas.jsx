import React from 'react';
import { Grid, Card, CardContent, Typography, Box, Avatar } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import BoltIcon from '@mui/icons-material/Bolt';

const MetricCard = ({ title, value, change, icon: Icon, colorBg, colorText }) => {
  return (
    <Card elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 3 }}>
      <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="caption" fontWeight="bold" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
              {title}
            </Typography>
            <Typography variant="h4" fontWeight="bold" sx={{ mt: 0.5, trackingTight: -1 }}>
              {value}
            </Typography>
          </Box>
          <Avatar sx={{ bgcolor: colorBg, color: colorText, width: 48, height: 48, borderRadius: 2 }}>
            <Icon />
          </Avatar>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2, pt: 1.5, borderTop: '1px solid #f3f4f6' }}>
          <Typography variant="caption" fontWeight="bold" sx={{ bgcolor: colorBg, color: colorText, px: 1, py: 0.2, borderRadius: 1 }}>
            {change}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            vs ayer
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

const SeccionMetricas = () => {
  const metrics = [
    { title: 'Leads nuevos', value: '12', change: '+35%', icon: TrendingUpIcon, colorBg: '#eff6ff', colorText: '#2563eb' },
    { title: 'Visitas agendadas', value: '5', change: '+7%', icon: VisibilityIcon, colorBg: '#ecfdf5', colorText: '#059669' },
    { title: 'Ventas cerradas', value: '3', change: '+56%', icon: CheckCircleIcon, colorBg: '#fef2f2', colorText: '#dc2626' },
    { title: 'Instalaciones hoy', value: '4', change: '+200%', icon: BoltIcon, colorBg: '#fff7ed', colorText: '#ea580c' },
  ];

  return (
    <Grid container spacing={3}>
      {metrics.map((metric, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <MetricCard {...metric} />
        </Grid>
      ))}
    </Grid>
  );
};

export default SeccionMetricas;