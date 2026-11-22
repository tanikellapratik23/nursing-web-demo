import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwind from "@tailwindcss/vite";
export default defineConfig({
  base: "/nursing-web-demo/",
  server: { watch: { usePolling: true, interval: 300 } },
  plugins: [react(), tailwind()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (
            id.includes("node_modules") &&
            /recharts|d3-|victory-vendor/.test(id)
          )
            return "charts";
        },
      },
    },
  },
});
