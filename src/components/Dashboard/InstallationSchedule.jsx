import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const InstallationSchedule = () => {
  const [currentWeek, setCurrentWeek] = useState(0);

  const schedule = [
    {
      day: 'Lun 20',
      date: 'Mar 21',
      events: [
        { time: '08:30', name: 'Luis Hernández', location: 'Jrds del Sur', color: 'bg-green-100 border-green-500' },
        { time: '09:30', name: 'Juan Pérez', location: 'Carbajal La Aurora', color: 'bg-blue-100 border-blue-500' },
        { time: '10:30', name: 'Carla de Vr', location: 'Carbajal La Aurora', color: 'bg-yellow-100 border-yellow-500' },
      ]
    },
    { day: 'Mar 21', events: [] },
    { day: 'Miér 22', events: [] },
    { day: 'Jue 23', events: [] },
    { day: 'Vie 24', events: [] },
    { day: 'Sáb 25', events: [] },
    { day: 'Dom 26', events: [] }
  ];

  const hours = Array.from({ length: 8 }, (_, i) => `0${8 + i}:00`);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold text-gray-800">Agenda de instalaciones</h2>
        <div className="flex items-center gap-2">
          <button onClick={() => setCurrentWeek(Math.max(0, currentWeek - 1))} className="p-2 hover:bg-gray-100 rounded">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-sm font-semibold text-gray-700">20 de mayo - 26 de mayo, 2026</span>
          <button onClick={() => setCurrentWeek(currentWeek + 1)} className="p-2 hover:bg-gray-100 rounded">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Calendar View */}
      <div className="border border-gray-200 rounded-lg overflow-x-auto">
        <div className="inline-block min-w-full">
          {/* Header */}
          <div className="flex bg-gray-50 border-b border-gray-200">
            <div className="w-20 p-3 border-r border-gray-200 text-xs font-semibold text-gray-700">Hora</div>
            {schedule.map((day, index) => (
              <div key={index} className="flex-1 p-3 text-center border-r border-gray-200 last:border-r-0 text-xs font-semibold text-gray-700 bg-gradient-to-b from-primary from-20% to-transparent text-white">
                {day.day}
              </div>
            ))}
          </div>

          {/* Time Grid */}
          {hours.map((hour, hourIndex) => (
            <div key={hourIndex} className="flex border-b border-gray-200 last:border-b-0">
              <div className="w-20 p-3 border-r border-gray-200 text-xs font-semibold text-gray-700 bg-gray-50">
                {hour}
              </div>
              {schedule.map((day, dayIndex) => (
                <div key={dayIndex} className="flex-1 p-2 border-r border-gray-200 last:border-r-0 min-h-16 bg-white">
                  {day.events
                    .filter(event => event.time === hour)
                    .map((event, eventIndex) => (
                      <div
                        key={eventIndex}
                        className={`p-2 rounded text-xs border-l-2 ${event.color} mb-1 cursor-pointer hover:shadow-md transition-shadow`}
                      >
                        <p className="font-semibold text-gray-800">{event.time}</p>
                        <p className="text-gray-700">{event.name}</p>
                        <p className="text-gray-600 text-xs">{event.location}</p>
                      </div>
                    ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Info */}
      <div className="mt-4 text-sm text-gray-600">
        <p><strong>Semana:</strong> 20 de mayo - 26 de mayo, 2026</p>
        <p><strong>Instalaciones programadas:</strong> 3</p>
      </div>
    </div>
  );
};

export default InstallationSchedule;
