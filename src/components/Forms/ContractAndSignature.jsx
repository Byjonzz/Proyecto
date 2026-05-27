import React, { useState } from 'react';
import { Upload, CheckCircle } from 'lucide-react';

const ContractAndSignature = () => {
  const [signature, setSignature] = useState(null);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <h2 className="text-lg font-bold text-gray-800 mb-4">Contrato y firma</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Contract Document */}
        <div>
          <h3 className="font-semibold text-gray-800 mb-3">Tiempo estimado de instalación</h3>
          <p className="text-sm text-gray-600 mb-4">
            Actualmente en la zona de instalación para una de 3.5 Tera tabilitas. En los meses anteriormente se confirma en futuro.
          </p>
          
          <h3 className="font-semibold text-gray-800 mb-3">Firmas del cliente</h3>
          <div className="space-y-3">
            <div className="bg-gray-50 p-4 rounded-lg border-2 border-dashed border-gray-300">
              <div className="flex items-center justify-center h-32">
                {signature ? (
                  <div className="text-center">
                    <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <p className="text-sm font-semibold text-green-600">Firma capturada</p>
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">Firma del cliente / Fachada</p>
                )}
              </div>
            </div>

            <button
              onClick={() => setSignature(true)}
              className="w-full px-4 py-2 border border-primary text-primary rounded-lg font-medium hover:bg-primary hover:text-white transition-colors"
            >
              Capturar firma
            </button>
          </div>

          <h3 className="font-semibold text-gray-800 mt-6 mb-3">Fotos del domicilio / Fachada</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-100 rounded-lg overflow-hidden aspect-square">
              <img 
                src="https://via.placeholder.com/150/cccccc/666666?text=Foto+1" 
                alt="Photo 1"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="bg-gray-100 rounded-lg overflow-hidden aspect-square">
              <img 
                src="https://via.placeholder.com/150/cccccc/666666?text=Foto+2" 
                alt="Photo 2"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Client Info */}
        <div>
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-4">
            <h3 className="font-semibold text-gray-800 mb-3">Datos del cliente</h3>
            <div className="space-y-2 text-sm">
              <p className="text-gray-700"><strong>Nombre:</strong> Fernando López</p>
              <p className="text-gray-700"><strong>Teléfono:</strong> 9871234567</p>
              <p className="text-gray-700"><strong>Email:</strong> fernando@example.com</p>
              <p className="text-gray-700"><strong>Dirección:</strong> Calle Principal 123</p>
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <p className="font-semibold text-green-800">Recibir del INE</p>
            </div>
            <p className="text-sm text-green-700">Proceso completado</p>
          </div>

          <div className="mt-6">
            <h3 className="font-semibold text-gray-800 mb-3">Fotos del domicilio / Fachada</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-100 rounded-lg overflow-hidden aspect-square">
                <img 
                  src="https://via.placeholder.com/150/cccccc/666666?text=Casa+1" 
                  alt="House 1"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="bg-gray-100 rounded-lg overflow-hidden aspect-square">
                <img 
                  src="https://via.placeholder.com/150/cccccc/666666?text=Casa+2" 
                  alt="House 2"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-3 mt-6">
        <button className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors">
          Atrás
        </button>
        <button className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors ml-auto">
          Finalizar
        </button>
      </div>
    </div>
  );
};

export default ContractAndSignature;
