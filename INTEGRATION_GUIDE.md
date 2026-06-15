# 🔗 Guía de Integración con Backend

Este documento explica cómo conectar el frontend con tu backend.

## 1. Configuración Inicial

### Paso 1: Configurar la URL del API
Edita el archivo `.env`:

```env
REACT_APP_API_URL=http://tu-backend.com/api
REACT_APP_ENV=development
```

### Paso 2: Importar el servicio API
En tu componente:

```javascript
import { leadService, prospectService, reportService } from '../services/api';
```

## 2. Ejemplos de Integración

### Obtener Leads

```javascript
import { useState, useEffect } from 'react';
import { leadService } from '../services/api';

function SegumientoProspecto() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    leadService.getAll()
      .then(response => {
        setLeads(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error:', error);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Cargando...</div>;

  return (
    <table>
      <tbody>
        {leads.map(lead => (
          <tr key={lead.id}>
            <td>{lead.name}</td>
            <td>{lead.status}</td>
            <td>{lead.phone}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

### Crear un Prospecto

```javascript
import { prospectService } from '../services/api';

async function handleCreateProspect(formData) {
  try {
    const response = await prospectService.create({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
    });
    console.log('Prospecto creado:', response.data);
  } catch (error) {
    console.error('Error al crear prospecto:', error);
  }
}
```

### Obtener Reportes

```javascript
import { reportService } from '../services/api';

async function getReports(startDate, endDate) {
  try {
    const metrics = await reportService.getMetrics({ startDate, endDate });
    const salesByPlan = await reportService.getSalesByPlan({ startDate, endDate });
    
    console.log('Métricas:', metrics.data);
    console.log('Ventas por plan:', salesByPlan.data);
  } catch (error) {
    console.error('Error:', error);
  }
}
```

## 3. Usar Hooks Personalizados

Está disponible `useLeads()` en `src/hooks/useData.js`:

```javascript
import { useLeads } from '../hooks/useData';

function MyComponent() {
  const { leads, loading, error } = useLeads();

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {leads.map(lead => <p key={lead.id}>{lead.name}</p>)}
    </div>
  );
}
```

## 4. Endpoints Esperados del Backend

El frontend espera los siguientes endpoints:

### Leads (Leads / Contactos)
```
GET    /api/leads              - Obtener todos los leads
GET    /api/leads/:id          - Obtener un lead específico
POST   /api/leads              - Crear un nuevo lead
PUT    /api/leads/:id          - Actualizar un lead
DELETE /api/leads/:id          - Eliminar un lead
```

### Prospectos (Prospects)
```
GET    /api/prospects          - Obtener todos los prospectos
GET    /api/prospects/:id      - Obtener un prospecto específico
POST   /api/prospects          - Crear un nuevo prospecto
PUT    /api/prospects/:id      - Actualizar un prospecto
DELETE /api/prospects/:id      - Eliminar un prospecto
```

### Cotizaciones (Quotes)
```
GET    /api/quotes             - Obtener todas las cotizaciones
GET    /api/quotes/:id         - Obtener una cotización específica
POST   /api/quotes             - Crear una nueva cotización
PUT    /api/quotes/:id         - Actualizar una cotización
```

### Instalaciones (Installations)
```
GET    /api/installations      - Obtener todas las instalaciones
GET    /api/installations/schedule?startDate=X&endDate=Y - Obtener calendario
POST   /api/installations      - Crear una nueva instalación
PUT    /api/installations/:id  - Actualizar una instalación
```

### Reportes (Reports)
```
GET    /api/reports/metrics?startDate=X&endDate=Y - Obtener métricas
GET    /api/reports/sales-by-plan?startDate=X&endDate=Y - Ventas por plan
GET    /api/reports/lead-status - Estado de los leads
```

### Cobertura (Coverage)
```
GET    /api/coverage/zones     - Obtener zonas de cobertura
GET    /api/coverage/zones/:id/clients - Obtener clientes de una zona
```

### Autenticación (Auth)
```
POST   /api/auth/login         - Login
POST   /api/auth/logout        - Logout
GET    /api/auth/profile       - Obtener perfil del usuario
```

## 5. Formatos de Respuesta Esperados

### Lead/Prospecto
```json
{
  "id": "lead-123",
  "name": "María Fernández",
  "email": "maria@example.com",
  "phone": "9871234567",
  "address": "Calle Principal 123",
  "city": "Ciudad",
  "postalCode": "12345",
  "status": "Interesado",
  "plan": "600 Megas",
  "createdAt": "2026-05-27T10:30:00Z",
  "updatedAt": "2026-05-27T10:30:00Z"
}
```

### Reporte de Métricas
```json
{
  "newLeads": 12,
  "scheduledVisits": 5,
  "closedSales": 3,
  "installationsToday": 4,
  "recentActivities": [...],
  "totalLeads": 24,
  "totalSales": 8,
  "totalRejected": 4
}
```

### Instalación
```json
{
  "id": "inst-123",
  "prospectId": "prospect-123",
  "scheduledDate": "2026-05-28T08:30:00Z",
  "technician": "Luis Hernández",
  "location": "Jardines del Sur",
  "status": "Programada",
  "plan": "600 Megas"
}
```

## 6. Manejo de Errores

El servicio API incluye interceptores para errores. Puedes manejar errores así:

```javascript
try {
  const response = await leadService.getAll();
  // Usar response.data
} catch (error) {
  if (error.response) {
    // Error del servidor (4xx, 5xx)
    console.error('Error:', error.response.status, error.response.data);
  } else if (error.request) {
    // No hay respuesta del servidor
    console.error('Sin respuesta del servidor');
  } else {
    // Error en la solicitud
    console.error('Error:', error.message);
  }
}
```

## 7. Autenticación con Token

Si tu backend usa JWT o tokens, el servicio API los maneja automáticamente:

1. **Guardar el token después del login:**
```javascript
const response = await authService.login(email, password);
localStorage.setItem('token', response.data.token);
```

2. **El token se agrega automáticamente** a cada solicitud en el header:
```javascript
Authorization: Bearer {token}
```

3. **Limpiar el token al logout:**
```javascript
await authService.logout();
localStorage.removeItem('token');
```

## 8. CORS (Si es necesario)

Si recibir errores de CORS, tu backend debe permitir solicitudes desde `http://localhost:3000`:

En tu backend (ejemplo con Express):
```javascript
const cors = require('cors');
app.use(cors({
  origin: ['http://localhost:3000', 'https://tu-dominio.com'],
  credentials: true
}));
```

## 9. Compilar para Producción

Cuando esté listo para producción:

```bash
npm run build
```

Esto crea una carpeta `dist/` optimizada lista para desplegar.

---

## ¿Necesitas ayuda?

Revisa los siguientes archivos:
- `/src/services/api.js` - Definición de endpoints
- `/src/hooks/useData.js` - Hooks personalizados
- `/src/components/Dashboard/SegumientoProspecto.jsx` - Ejemplo de uso

¡Buen desarrollo! 🚀
