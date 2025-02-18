import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true,
    fs: {
      strict: true
    }
  },
  base: "/",
  build: {
    outDir: "dist",
    assetsDir: "assets",
    sourcemap: true,
    modulePreload: {
      polyfill: true
    },
    rollupOptions: {
      output: {
        format: 'es',
        manualChunks: {
          vendor: ["react", "react-dom", "axios"],
        },
      },
    },
  },
  optimizeDeps: {
    include: ["react", "react-dom", "axios"],
  },
});
