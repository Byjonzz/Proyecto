# ⚡ QUICKSTART - ConectaNet Dashboard

## En 2 Minutos ⏱️

### 1️⃣ **El servidor YA está corriendo**
```
http://localhost:3000/
```
Abre esta URL en tu navegador y ¡verás el dashboard!

---

### 2️⃣ **Si necesitas reiniciar el servidor**

#### En Windows:
```batch
cd c:\Users\bravo\OneDrive\Escritorio\solit\conectanet-dashboard
npm run dev
```

O simplemente:
```batch
start.bat
```

#### En Mac/Linux:
```bash
cd c:\Users\bravo\OneDrive\Escritorio\solit\conectanet-dashboard
npm run dev
```

O:
```bash
./start.sh
```

---

### 3️⃣ **Lo que ves en el dashboard**

| Sección | Descripción |
|---------|------------|
| 📊 **Métricas** | Leads nuevos, visitas, ventas, instalaciones |
| 🗺️ **Mapa** | Cobertura de zonas interactiva |
| 📋 **Tablas** | Leads con filtros y acciones |
| 📅 **Calendario** | AgendaInstalaciones semanal |
| 📈 **Gráficos** | Estadísticas y reportes |
| 📝 **Formularios** | Multi-paso para prospectos |

---

### 4️⃣ **Estructura rápida**

```
src/
├── components/      ← Todos los componentes visuales
├── services/        ← API para conectar backend
├── hooks/           ← Hooks para obtener datos
└── App.jsx          ← Componente principal
```

---

### 5️⃣ **Para conectar tu backend**

**Paso 1:** Edita `.env`
```env
REACT_APP_API_URL=http://tu-backend.com/api
```

**Paso 2:** Usa los servicios en tus componentes
```javascript
import { leadService } from '../services/api';

// Obtener leads
const leads = await leadService.getAll();
```

**Paso 3:** Revisa `INTEGRATION_GUIDE.md` para más ejemplos

---

### 6️⃣ **Scripts útiles**

```bash
npm run dev      # Inicia servidor (YA está corriendo)
npm run build    # Compila para producción
npm run preview  # Previsualizador del build
```

---

### 7️⃣ **Archivos importantes**

| Archivo | Para qué |
|---------|----------|
| `README.md` | Documentación general |
| `INTEGRATION_GUIDE.md` | Conectar backend |
| `RESUMEN_FINAL.md` | Resumen completo |
| `.env` | Configurar API URL |
| `tailwind.config.js` | Personalizar colores |

---

### 8️⃣ **Datos que ves**

**ℹ️ Importante:** Los datos que ves ahora son **placeholders/ejemplos**

Cuando conectes tu backend, se reemplazarán con datos reales.

---

### 9️⃣ **¿Algo no funciona?**

```bash
# Limpia cache e reinstala
rm -rf node_modules package-lock.json
npm install
npm run dev
```

---

### 🔟 **Siguiente paso**

👉 Abre `INTEGRATION_GUIDE.md` para conectar tu backend

---

## 📱 URL del Dashboard

```
http://localhost:3000/
```

✅ **¡Listo para usar!** 🚀

---

*ConectaNet Dashboard - Frontend completado*
*React + Tailwind + Vite*
