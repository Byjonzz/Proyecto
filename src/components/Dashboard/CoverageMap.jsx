import React from 'react';
import { MapPin, ZoomIn, ZoomOut, Layers, MapPinned } from 'lucide-react';

const CoverageMap = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
      <h2 className="text-lg font-bold text-gray-800 mb-4">Mapa de cobertura</h2>
      
      <div className="flex gap-4">
        {/* Map Section */}
        <div className="flex-1">
          <div className="bg-gray-300 rounded-lg h-96 relative overflow-hidden">
            {/* Placeholder for map */}
            <img 
              src="https://via.placeholder.com/800x400/cccccc/666666?text=Mapa+de+Cobertura" 
              alt="Coverage Map"
              className="w-full h-full object-cover"
            />
            
            {/* Map Controls */}
            <div className="absolute right-4 top-4 flex flex-col gap-2">
              <button className="bg-white p-2 rounded-lg shadow-md hover:bg-gray-50">
                <ZoomIn className="w-5 h-5 text-gray-600" />
              </button>
              <button className="bg-white p-2 rounded-lg shadow-md hover:bg-gray-50">
                <ZoomOut className="w-5 h-5 text-gray-600" />
              </button>
              <button className="bg-white p-2 rounded-lg shadow-md hover:bg-gray-50">
                <Layers className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Map Legend */}
            <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-md p-4 text-sm">
              <div className="font-semibold text-gray-800 mb-3">Cobertura disponible</div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700">Zona cubierta - 700 m</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-gray-700">Buena (750-350m)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-700">Limitada (350-150m)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-gray-700">Sin cobertura</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-64">
          <div className="space-y-4">
            {/* Search */}
            <input
              type="text"
              placeholder="Buscar dirección o colonia"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />

            {/* Legend */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 text-sm mb-3">Capas del mapa</h3>
              <div className="space-y-2 text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-4 h-4" />
                  <span className="text-gray-700">Cobertura disponible</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-4 h-4" />
                  <span className="text-gray-700">Zona no (IWIFI)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-4 h-4" />
                  <span className="text-gray-700">Clientes</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4" />
                  <span className="text-gray-700">Colonias</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4" />
                  <span className="text-gray-700">Área de expansión</span>
                </label>
              </div>
            </div>

            {/* Filter Button */}
            <button className="w-full bg-primary text-white py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors">
              Filtrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoverageMap;
