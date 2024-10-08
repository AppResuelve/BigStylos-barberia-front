// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dotenv from "dotenv";

// Cargar las variables de entorno desde el archivo .env
dotenv.config();

const VITE_BACKEND_URL = process.env.VITE_BACKEND_URL;

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      external: ["react-dom/client"],
    },
  },
  server: {
    proxy: {
      // Proxy todas las solicitudes al backend directamente
      "/": {
        target: VITE_BACKEND_URL,
        changeOrigin: true, // Si necesitas evitar problemas de CORS
      },
    },
  },
});
