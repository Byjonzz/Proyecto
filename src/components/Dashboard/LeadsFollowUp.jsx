import React, { useState } from 'react';
import { Phone, MessageCircle, Clock, MapPin, DollarSign, Plus } from 'lucide-react';

const LeadsFollowUp = () => {
  const [filterStatus, setFilterStatus] = useState('all');

  const leads = [
    {
      id: 1,
      name: 'María Fernández',
      status: 'Interesado',
      statusColor: 'bg-green-100 text-green-700',
      amount: '600 Megas',
      time: 'Hace 2 horas',
      location: 'Col. Jardines del Sur',
      contact: '9871234567'
    },
    {
      id: 2,
      name: 'Juan Pérez',
      status: 'Volver a llamar',
      statusColor: 'bg-orange-100 text-orange-700',
      amount: 'Llamada perdida',
      time: 'Hace 3 horas',
      location: 'Vimar a futuro',
      contact: '9875551234'
    },
    {
      id: 3,
      name: 'Ana Gómez',
      status: 'Interesado',
      statusColor: 'bg-green-100 text-green-700',
      amount: '1 Giga',
      time: 'Ayer 5:15 PM',
      location: 'Mundo Normal',
      contact: '9879876543'
    },
    {
      id: 4,
      name: 'Luis Martínez',
      status: 'Rechazado',
      statusColor: 'bg-red-100 text-red-700',
      amount: 'No especificó',
      time: 'Hace 1 día',
      location: 'Mitacar del Sur',
      contact: '9872223333'
    },
    {
      id: 5,
      name: 'Carmen Rodríguez',
      status: 'Interesado',
      statusColor: 'bg-green-100 text-green-700',
      amount: '500 Megas',
      time: 'Ayer 1:30 PM',
      location: 'La Aurora',
      contact: '9871110000'
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-gray-800">Leads y seguimiento</h2>
        <button className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors">
          <Plus className="w-4 h-4" />
          Nuevo lead
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {['Todos', 'Interesado', 'Volver a llamar', 'Rechazado'].map((status, index) => (
          <button
            key={index}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
              filterStatus === status.toLowerCase() || (filterStatus === 'all' && status === 'Todos')
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => setFilterStatus(status.toLowerCase() === 'todos' ? 'all' : status.toLowerCase())}
          >
            {status} ({status === 'Todos' ? leads.length : leads.filter(l => l.status.toLowerCase() === status.toLowerCase()).length})
          </button>
        ))}
      </div>

      {/* Leads Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Nombre</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Estado</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Plan</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Ubicación</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Contacto</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Última actividad</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr key={lead.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="py-4 px-4">
                  <p className="font-medium text-gray-800">{lead.name}</p>
                </td>
                <td className="py-4 px-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${lead.statusColor}`}>
                    {lead.status}
                  </span>
                </td>
                <td className="py-4 px-4 text-sm text-gray-600">{lead.amount}</td>
                <td className="py-4 px-4 text-sm text-gray-600 flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  {lead.location}
                </td>
                <td className="py-4 px-4 text-sm text-gray-600">{lead.contact}</td>
                <td className="py-4 px-4 text-sm text-gray-600 flex items-center gap-1">
                  <Clock className="w-4 h-4 text-gray-400" />
                  {lead.time}
                </td>
                <td className="py-4 px-4">
                  <div className="flex gap-2">
                    <button className="p-2 hover:bg-blue-100 rounded transition-colors">
                      <Phone className="w-4 h-4 text-blue-600" />
                    </button>
                    <button className="p-2 hover:bg-green-100 rounded transition-colors">
                      <MessageCircle className="w-4 h-4 text-green-600" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Bottom Button */}
      <button className="w-full mt-4 py-3 border border-primary text-primary rounded-lg font-medium hover:bg-primary hover:text-white transition-colors">
        Ver todos los leads
      </button>
    </div>
  );
};

export default LeadsFollowUp;
