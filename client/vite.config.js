import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte()],
  base: "./",
  server: {
    port: 4000,
    host: "localhost",
    headers: {
      "Access-Control-Allow-Origin": "http://localhost:3000"
    }
  }
});
