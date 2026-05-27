import React, { useState } from 'react';
import { LayoutDashboard, Map, FileText, Users, ClipboardList, Calendar, BarChart3, Settings, LogOut, ChevronDown } from 'lucide-react';

const Sidebar = () => {
  const [openMenu, setOpenMenu] = useState(null);

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', active: true },
    { icon: Map, label: 'Mapa de cobertura' },
    { icon: FileText, label: 'Proyectos' },
    { 
      icon: Users, 
      label: 'Leads y seguimiento',
      submenu: [
        { label: 'Leads nuevos' },
        { label: 'En seguimiento' }
      ]
    },
    { icon: ClipboardList, label: 'Planes y cotizaciones' },
    { icon: FileText, label: 'Contratos y firmas' },
    { icon: BarChart3, label: 'Evidencias' },
    { icon: Calendar, label: 'Agenda de instalaciones' },
    { icon: FileText, label: 'Reportes' },
    { icon: BarChart3, label: 'Órdenes activas' },
    { icon: Settings, label: 'Configuración' },
    { icon: LogOut, label: 'Cerrar sesión' },
  ];

  return (
    <aside className="w-64 bg-gradient-to-b from-primary to-indigo-900 text-white h-screen overflow-y-auto">
      {/* Logo */}
      <div className="p-6 border-b border-indigo-700">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
            <span className="text-primary font-bold">CN</span>
          </div>
          <span className="font-bold text-lg">ConectaNet</span>
        </div>
      </div>

      {/* Menu Items */}
      <nav className="p-4 space-y-2">
        {menuItems.map((item, index) => (
          <div key={index}>
            <button
              onClick={() => setOpenMenu(openMenu === index ? null : index)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                item.active
                  ? 'bg-white bg-opacity-20 text-white'
                  : 'text-indigo-100 hover:bg-white hover:bg-opacity-10'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-sm font-medium">{item.label}</span>
              {item.submenu && (
                <ChevronDown className={`w-4 h-4 ml-auto transition-transform ${openMenu === index ? 'rotate-180' : ''}`} />
              )}
            </button>

            {/* Submenu */}
            {item.submenu && openMenu === index && (
              <div className="ml-8 mt-2 space-y-2">
                {item.submenu.map((subitem, subindex) => (
                  <button
                    key={subindex}
                    className="w-full text-left text-sm text-indigo-100 hover:text-white py-2 px-2 rounded transition-colors"
                  >
                    {subitem.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
