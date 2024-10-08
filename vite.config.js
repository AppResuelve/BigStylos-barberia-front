// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dotenv from "dotenv";

// Cargar las variables de entorno desde el archivo .env
dotenv.config();

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      external: ["react-dom/client"],
    },
  },
});
