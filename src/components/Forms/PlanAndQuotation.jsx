import React, { useState } from 'react';
import { Check } from 'lucide-react';

const PlanAndQuotation = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);

  const plans = [
    {
      id: 1,
      name: '600 Megas',
      price: '$400000',
      downloadSpeed: '600 Mbps',
      uploadSpeed: '384000',
      storage: '300 Mbps de descarga',
      features: [
        '300 Mbps de descarga',
        'Router incluido',
        'Instalación gratis'
      ]
    },
    {
      id: 2,
      name: '500 Megas',
      price: '$500000',
      downloadSpeed: '500 Mbps',
      uploadSpeed: '$6884000',
      storage: '500 Mbps de descarga',
      features: [
        '500 Mbps de descarga',
        'Router incluido',
        'Instalación gratis'
      ],
      highlighted: true
    },
    {
      id: 3,
      name: '1 Giga',
      price: '$900000',
      downloadSpeed: '1 Giga',
      uploadSpeed: '$8884000',
      storage: 'Instalacion gratis',
      features: [
        '1 Giga de descarga',
        'Router x 4',
        'Instalación GRATIS'
      ]
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <h2 className="text-lg font-bold text-gray-800 mb-4">Plan y cotización</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.id}
            onClick={() => setSelectedPlan(plan.id)}
            className={`border-2 rounded-lg p-6 cursor-pointer transition-all ${
              selectedPlan === plan.id
                ? 'border-primary bg-primary bg-opacity-5'
                : 'border-gray-200'
            } ${plan.highlighted ? 'ring-2 ring-primary' : ''}`}
          >
            <div className="relative">
              {plan.highlighted && (
                <div className="absolute -top-4 -right-4 bg-primary text-white px-3 py-1 rounded-full text-xs font-semibold">
                  Recomendado
                </div>
              )}
              
              <h3 className="text-xl font-bold text-gray-800 mb-2">{plan.name}</h3>
              <p className="text-2xl font-bold text-primary mb-4">{plan.price}</p>
              
              <div className="space-y-3 mb-6">
                <p className="text-sm text-gray-600">
                  <strong>Download:</strong> {plan.downloadSpeed}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Upload:</strong> {plan.uploadSpeed}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Storage:</strong> {plan.storage}
                </p>
              </div>

              <div className="space-y-2">
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm text-gray-700">
                    <Check className="w-4 h-4 text-primary" />
                    {feature}
                  </div>
                ))}
              </div>
            </div>

            <button
              className={`w-full mt-6 py-2 rounded-lg font-medium transition-colors ${
                selectedPlan === plan.id
                  ? 'bg-primary text-white hover:bg-indigo-700'
                  : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {selectedPlan === plan.id ? 'Seleccionado' : 'Seleccionar'}
            </button>
          </div>
        ))}
      </div>

      {/* Observations */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold text-gray-800 mb-2">Observaciones / Notas</h3>
        <textarea
          placeholder="Agregar notas adicionales sobre la cotización..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm h-24"
        />
      </div>

      {/* Buttons */}
      <div className="flex gap-3 mt-6">
        <button className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors">
          Atrás
        </button>
        <button className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors ml-auto">
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default PlanAndQuotation;
