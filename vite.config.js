// vite.config.js
// recuerda quitar la config de vercel
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      external: ["react-dom/client"],
    },
  },
});
