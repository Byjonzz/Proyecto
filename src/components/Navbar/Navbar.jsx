import React from 'react';
import { Bell, MapPin, User, ChevronDown } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-3 flex justify-between items-center">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold text-gray-800">¡Hola, Carlos! 👋</h1>
        <p className="text-gray-600 text-sm">Bienvenido a ConectaNet - Plataforma de Caravanas, Ventas e Instalaciones</p>
      </div>
      
      <div className="flex items-center gap-6">
        <Bell className="w-5 h-5 text-gray-600 cursor-pointer hover:text-primary" />
        <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white font-bold text-xs cursor-pointer">
          1
        </div>
        <div className="flex items-center gap-2 cursor-pointer">
          <img 
            src="https://via.placeholder.com/40" 
            alt="User" 
            className="w-10 h-10 rounded-full"
          />
          <div>
            <p className="text-sm font-medium text-gray-800">Carlos Promotor</p>
            <p className="text-xs text-gray-500">Camarógrafo</p>
          </div>
          <ChevronDown className="w-4 h-4 text-gray-600" />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
