import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    port: 2333,
    hmr: true,
  },
  build: {
    outDir: "../../view",
  },
  base: "./",
});
