import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    // Convierte la variable de entorno a número; si no está definida, usa 3000 por defecto.
    port: Number(process.env.VITE_PORT) || 3000,
  },
})
