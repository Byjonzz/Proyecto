import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  
  server: {
    port: 3000,
    open: true
  },
  
  build: {
    rolldownOptions: {
      experimental: {
        lazyBarrel: false
      }
    }
  },
  
  optimizeDeps: {
    include: ['@mui/material', '@mui/system']
  }
})