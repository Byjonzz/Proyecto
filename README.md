# ConectaNet Dashboard - Frontend

Un dashboard React completo diseñado como la plataforma ConectaNet para gestión de proyectos, ventas e instalaciones.

## 🎨 Características

✅ **Navbar + Sidebar** - Navegación intuitiva  
✅ **Dashboard** - Métricas, mapas de cobertura, actividad reciente  
✅ **Nuevo prospecto** - Formulario multi-paso para crear prospectos  
✅ **Plan y cotización** - Selector de planes de internet  
✅ **Contrato y firma** - Gestión de contratos y firmas  
✅ **Evidencias** - Galería de fotos y documentos  
✅ **Leads y seguimiento** - Tabla de leads con filtros  
✅ **Agenda de instalaciones** - Calendario semanal  
✅ **Reportes** - Gráficos y estadísticas  
✅ **Detalle de prospecto** - Panel de información detallada  

## 🚀 Instalación

```bash
# Clonar o descargar el proyecto
cd conectanet-dashboard

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

El proyecto se abrirá automáticamente en `http://localhost:3000/`

## 📁 Estructura del Proyecto

```
src/
├── components/
│   ├── Dashboard/          # Componentes principales del dashboard
│   │   ├── MetricsSection.jsx
│   │   ├── CoverageMap.jsx
│   │   ├── RecentActivity.jsx
│   │   ├── Evidence.jsx
│   │   ├── LeadsFollowUp.jsx
│   │   ├── InstallationSchedule.jsx
│   │   ├── ProspectDetails.jsx
│   │   └── Reports.jsx
│   ├── Forms/              # Formularios
│   │   ├── NewProspect.jsx
│   │   ├── PlanAndQuotation.jsx
│   │   └── ContractAndSignature.jsx
│   ├── Navbar/             # Barra de navegación superior
│   └── Sidebar/            # Panel lateral de navegación
├── App.jsx                 # Componente principal
├── main.jsx                # Punto de entrada
└── index.css               # Estilos globales con Tailwind
```

## 🛠️ Tecnologías Utilizadas

- **React 19** - Librería de UI
- **Vite** - Build tool rápido
- **Tailwind CSS** - Framework de estilos
- **Lucide React** - Iconos
- **Recharts** - Gráficos y visualizaciones
- **React Router DOM** - Routing (preparado para expansión)
- **Axios** - Cliente HTTP (preparado para integración con backend)

## 💻 Scripts Disponibles

```bash
npm run dev       # Inicia el servidor de desarrollo
npm run build     # Compila el proyecto para producción
npm run preview   # Previsualizador del build de producción
```

## 🔗 Integración con Backend

El proyecto está listo para integración con un backend. Aquí hay algunos puntos donde conectar:

### 1. **Crear un servicio API**
```javascript
// src/services/api.js
import axios from 'axios';

const API_URL = 'http://your-backend-api.com';

export const getLeads = () => axios.get(`${API_URL}/leads`);
export const createProspect = (data) => axios.post(`${API_URL}/prospects`, data);
// ... más funciones
```

### 2. **Usar hooks para fetching de datos**
```javascript
// src/hooks/useLeads.js
import { useState, useEffect } from 'react';
import { getLeads } from '../services/api';

export const useLeads = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLeads().then(res => setLeads(res.data));
  }, []);

  return { leads, loading };
};
```

### 3. **Actualizar componentes**
```javascript
// En LeadsFollowUp.jsx
import { useLeads } from '../hooks/useLeads';

const LeadsFollowUp = () => {
  const { leads } = useLeads();
  // ... rest del componente
};
```

## 📊 Componentes Principales

### MetricsSection
Muestra 4 tarjetas con métricas principales (Leads nuevos, Visitas, Ventas, Instalaciones)

### CoverageMap
Mapa interactivo con zonas de cobertura y controles de zoom

### LeadsFollowUp
Tabla filtrable de leads con información de contacto y acciones

### InstallationSchedule
Calendario semanal de instalaciones programadas

### Reports
Gráficos de pastel y barras con estadísticas

## 🎨 Personalización

### Cambiar colores primarios
Edita `tailwind.config.js`:
```javascript
theme: {
  extend: {
    colors: {
      primary: '#5B3BDC',    // Tu color
      secondary: '#F97316',
    }
  }
}
```

### Agregar nuevas vistas
1. Crea un nuevo componente en `src/components/`
2. Actualiza el switch en `App.jsx`
3. Agrega al sidebar en `Sidebar.jsx`

## 📝 Notas

- Los datos en los componentes son **datos dummy/de ejemplo**
- Conecta el backend para poblaciones dinámicas
- Todos los componentes están diseñados para ser **reutilizables**
- Los formularios tienen validación básica, agreguemos más según necesites

## 🤝 Soporte

Para preguntas o cambios en el diseño, verifica:
- La imagen original del diseño
- Los componentes individuales en `src/components/`
- La estructura Tailwind en el archivo de configuración

## 📄 Licencia

Este proyecto es parte de la plataforma ConectaNet.

---

**¡El frontend está listo para recibir datos del backend!** 🎉
