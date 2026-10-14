
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
<<<<<<< HEAD
  plugins: [react()],

  server: {
    host: "0.0.0.0",
    port: 5173,

    proxy: {
      "/api": {
        target: "http://127.0.0.1:5000",
        changeOrigin: true,
      },
    },
  },
});
=======
    plugins: [react()],

    server: {
        host: "0.0.0.0",
        port: 5173,
        proxy: {
            "/api": {
                target: "http://172.17.0.4:5000",
                changeOrigin: true
            }
        }
    },

    preview: {
        host: "0.0.0.0",
        port: 5173,
        allowedHosts: ["mern-frontend-235349.onrender.com"]
    }
});
>>>>>>> e30a1d0 (Update frontend UI)
