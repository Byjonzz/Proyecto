/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1c3580', // El azul oscuro del logo SOLIT
          hover: '#152860',
        },
        // Grises para replicar los fondos de tu wireframe
        background: '#e5e7eb', // Fondo general (gray-200)
        surface: '#d1d5db',    // Fondo de las tarjetas (gray-300)
        
        // Colores de estado para el mapa de cobertura
        excelente: '#22c55e',
        bueno: '#eab308',
        'sin-cobertura': '#ef4444',
      }
    },
  },
  plugins: [],
}