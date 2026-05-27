import React from 'react';
import { TrendingUp, Eye, CheckCircle, Zap } from 'lucide-react';

const MetricsCard = ({ icon: Icon, label, value, change, color }) => {
  const colors = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    red: 'bg-red-100 text-red-600',
    orange: 'bg-orange-100 text-orange-600',
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{label}</p>
          <p className="text-3xl font-bold text-gray-800 mt-2">{value}</p>
          <p className="text-xs text-gray-500 mt-2">
            <span className="text-green-600 font-semibold">{change}</span> vs ayer
          </p>
        </div>
        <div className={`p-3 rounded-lg ${colors[color] || colors.blue}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};

const MetricsSection = () => {
  const metrics = [
    { icon: TrendingUp, label: 'Leads nuevos', value: '12', change: '+35% vs ayer', color: 'blue' },
    { icon: Eye, label: 'Visitas programadas', value: '5', change: '+7% vs ayer', color: 'green' },
    { icon: CheckCircle, label: 'Ventas cerradas', value: '3', change: '+56% vs ayer', color: 'red' },
    { icon: Zap, label: 'Instalaciones hoy', value: '4', change: '+200% vs ayer', color: 'orange' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {metrics.map((metric, index) => (
        <MetricsCard key={index} {...metric} />
      ))}
    </div>
  );
};

export default MetricsSection;
