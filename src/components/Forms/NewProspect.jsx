import React, { useState } from 'react';
import { Plus, Edit2, Trash2, ChevronRight } from 'lucide-react';

const NewProspect = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    postalCode: '',
    reference: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const steps = ['Información general', 'Ubicación', 'Referencias'];

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <h2 className="text-lg font-bold text-gray-800 mb-4">Nuevo prospecto</h2>
      
      {/* Steps */}
      <div className="flex gap-4 mb-8">
        {steps.map((stepLabel, index) => (
          <div key={index} className="flex items-center gap-2 flex-1">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm ${
              step > index ? 'bg-primary text-white' : 
              step === index + 1 ? 'bg-primary text-white' : 
              'bg-gray-200 text-gray-600'
            }`}>
              {index + 1}
            </div>
            <span className={`text-sm font-medium ${step > index || step === index + 1 ? 'text-primary' : 'text-gray-500'}`}>
              {stepLabel}
            </span>
            {index < steps.length - 1 && <ChevronRight className="w-4 h-4 text-gray-400 flex-1" />}
          </div>
        ))}
      </div>

      {/* Form Step 1 */}
      {step === 1 && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="name"
              placeholder="Nombre completo"
              value={formData.name}
              onChange={handleChange}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              type="tel"
              name="phone"
              placeholder="Teléfono"
              value={formData.phone}
              onChange={handleChange}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <input
            type="email"
            name="email"
            placeholder="Correo electrónico"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      )}

      {/* Form Step 2 */}
      {step === 2 && (
        <div className="space-y-4">
          <input
            type="text"
            name="address"
            placeholder="Dirección"
            value={formData.address}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="city"
              placeholder="Ciudad"
              value={formData.city}
              onChange={handleChange}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              type="text"
              name="postalCode"
              placeholder="Código postal"
              value={formData.postalCode}
              onChange={handleChange}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
      )}

      {/* Form Step 3 */}
      {step === 3 && (
        <div className="space-y-4">
          <input
            type="text"
            name="reference"
            placeholder="Referencia (opcional)"
            value={formData.reference}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800">
              <strong>Resumen:</strong><br/>
              Nombre: {formData.name || 'No ingresado'}<br/>
              Teléfono: {formData.phone || 'No ingresado'}<br/>
              Email: {formData.email || 'No ingresado'}<br/>
              Dirección: {formData.address || 'No ingresada'}
            </p>
          </div>
        </div>
      )}

      {/* Buttons */}
      <div className="flex gap-3 mt-6">
        <button
          onClick={() => setStep(Math.max(1, step - 1))}
          className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          disabled={step === 1}
        >
          Cancelar
        </button>
        {step < steps.length ? (
          <button
            onClick={() => setStep(step + 1)}
            className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors ml-auto"
          >
            Siguiente
          </button>
        ) : (
          <button
            onClick={() => { setStep(1); alert('Prospecto guardado'); }}
            className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors ml-auto"
          >
            Guardar prospecto
          </button>
        )}
      </div>
    </div>
  );
};

export default NewProspect;
