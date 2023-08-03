import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  base: "./",
  plugins: [react()],
  build: {
    lib: {
      entry: "src/view/index.tsx",
      name: "viewer",
      fileName: "viewer",
    },
    outDir: "view",
  },
});
