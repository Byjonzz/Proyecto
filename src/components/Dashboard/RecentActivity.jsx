import React from 'react';
import { Clock } from 'lucide-react';

const RecentActivity = () => {
  const activities = [
    {
      id: 1,
      action: 'Sitio instalado',
      name: 'María Fernández',
      location: 'Col. Jardines del Sur',
      time: 'Hace 30 min',
      icon: '📍'
    },
    {
      id: 2,
      action: 'Visita realizada',
      name: 'Juan Pérez',
      location: 'Vimar a futuro',
      time: 'Hace 2 h',
      icon: '👁️'
    },
    {
      id: 3,
      action: 'Contrato firmado',
      name: 'Luis Mtz',
      location: 'Carlos Pellicer',
      time: 'Hace 3 h',
      icon: '✍️'
    },
    {
      id: 4,
      action: 'Evidencia cargada',
      name: 'Instalación ANERF - 000048',
      location: '',
      time: 'Hace 5 h',
      icon: '📎'
    }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Actividad reciente</h2>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex gap-4 pb-4 border-b border-gray-100 last:border-0">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-lg">
                {activity.icon}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-800">{activity.action}</p>
                <p className="text-sm text-gray-600">{activity.name} - {activity.location}</p>
                <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {activity.time}
                </p>
              </div>
            </div>
          ))}
        </div>
        <button className="w-full mt-4 py-2 text-primary font-medium border border-primary rounded-lg hover:bg-primary hover:text-white transition-colors">
          Ver todas las actividades
        </button>
      </div>

      {/* Map Popup Card */}
      <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-primary">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
            Map
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-gray-800">Casa SJM - 05 NMP-1036</h3>
            <p className="text-sm text-gray-600 mt-1">Puntos disponibles: 0</p>
            <p className="text-sm text-gray-600">Total puntos: 16</p>
            <p className="text-sm text-gray-600">Estado: Activo</p>
          </div>
        </div>

        {/* Map Preview */}
        <div className="mt-4 h-48 bg-gray-200 rounded-lg overflow-hidden">
          <img 
            src="https://via.placeholder.com/400x200/cccccc/666666?text=Mapa+Detalle" 
            alt="Map Detail"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
          <div className="bg-green-50 p-2 rounded text-center">
            <p className="text-green-700 font-semibold">✓ Instalado</p>
          </div>
          <div className="bg-blue-50 p-2 rounded text-center">
            <p className="text-blue-700 font-semibold">🌐 Conectado</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecentActivity;
