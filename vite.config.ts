import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => {
  // Cargar las variables de entorno para el modo actual (development, production, etc.)
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    server: {
      // Usa la variable VITE_PORT o 3000 por defecto
      port: Number(env.VITE_PORT) || 3000,
    },
    define: {
      // Esto permite que se reemplacen en el código todas las referencias a import.meta.env
      'process.env': env
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src')
      }
    }
  };
});
