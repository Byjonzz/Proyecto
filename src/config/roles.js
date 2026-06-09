// Configuración de roles y sus permisos de acceso a vistas

export const ROLES = {
  CANVACEADOR: 'canvaceador',
  TECNICO: 'tecnico',
  LOGISTICA: 'logistica',
  ADMIN_VENTAS: 'admin_ventas',
  ADMIN: 'admin'
};

// Definición de qué vistas puede acceder cada rol
export const RUTAS_POR_ROL = {
  // CANVACEADOR - Solo puede ver sus módulos
  [ROLES.CANVACEADOR]: [
    'canvaceo-dashboard',
    'canvaceo-registro',
    'canvaceo-ruta',
    'ventas-contrato-directo',
    'ventas-seguimiento'
  ],
  
  // TÉCNICO - Solo puede ver sus módulos
  [ROLES.TECNICO]: [
    'tecnico-ejecucion',
    'tecnico-mis-instalaciones',
    'ventas-contrato-directo',
    'ventas-seguimiento'
  ],
  
  // LOGÍSTICA - Agenda y seguimiento
  [ROLES.LOGISTICA]: [
    'logistica-agenda',
    'logistica-seguimiento',
    'ventas-seguimiento'
  ],
  
  // ADMIN_VENTAS - Todo lo de ventas y canvaceo + comisiones y asignación de rutas
  [ROLES.ADMIN_VENTAS]: [
    'canvaceo-dashboard',
    'canvaceo-registro',
    'canvaceo-ruta',
    'ventas-contrato-directo',
    'ventas-seguimiento',
    'admin-comisiones',
    'admin-asignacion-rutas'
  ],
  
  // ADMIN - Acceso total a todo incluyendo planes y usuarios
  [ROLES.ADMIN]: [
    'canvaceo-dashboard',
    'canvaceo-registro',
    'canvaceo-ruta',
    'ventas-contrato-directo',
    'ventas-seguimiento',
    'logistica-agenda',
    'tecnico-ejecucion',
    'admin-comisiones',
    'admin-asignacion-rutas',
    'admin-planes',
    'admin-usuarios'
  ]
};

// Función para verificar si un rol puede acceder a una ruta
export const puedeAccederARuta = (rolUsuario, ruta) => {
  if (!rolUsuario || !ruta) return false;
  
  // Normalizar el rol (quitar acentos y convertir a minúsculas)
  const rolNormalizado = rolUsuario.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
  
  // Buscar las rutas permitidas para ese rol
  const rutasPermitidas = RUTAS_POR_ROL[rolNormalizado] || [];
  
  return rutasPermitidas.includes(ruta);
};

// Función para obtener la primera ruta permitida (para redireccionar después del login)
export const obtenerPrimeraRuta = (rolUsuario) => {
  const rolNormalizado = rolUsuario.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
  const rutasPermitidas = RUTAS_POR_ROL[rolNormalizado] || [];
  return rutasPermitidas[0] || 'canvaceo-dashboard';
};

// Función para obtener el nombre legible del rol
export const obtenerNombreRol = (rol) => {
  const nombres = {
    [ROLES.CANVACEADOR]: 'Canvaceador',
    [ROLES.TECNICO]: 'Técnico',
    [ROLES.LOGISTICA]: 'Logística',
    [ROLES.ADMIN_VENTAS]: 'Admin Ventas',
    [ROLES.ADMIN]: 'Administrador'
  };
  return nombres[rol] || rol;
};

// Función para obtener el color del rol
export const obtenerColorRol = (rol) => {
  const colores = {
    [ROLES.CANVACEADOR]: '#3b82f6',    // Azul
    [ROLES.TECNICO]: '#10b981',        // Verde
    [ROLES.LOGISTICA]: '#f59e0b',      // Naranja
    [ROLES.ADMIN_VENTAS]: '#8b5cf6',   // Púrpura
    [ROLES.ADMIN]: '#ef4444'           // Rojo
  };
  return colores[rol] || '#6b7280';
};