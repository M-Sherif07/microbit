import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";

// The home page plus one HTML entry per React lab, at the same paths as the original course (loops-lab/index.html ...).
// Labs not ported yet are copied into public/ by tools/sync-home.mjs and shipped as they are.
// base "./" keeps every link relative, so the built dist/ folder works from any LMS or web folder.
export default defineConfig({
  base: "./",
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        home: resolve(__dirname, "index.html"),
        "loops-lab": resolve(__dirname, "loops-lab/index.html")
      }
    }
  }
});
