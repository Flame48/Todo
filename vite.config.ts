import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { readFileSync, writeFileSync } from "fs";
import tailwindcss from "@tailwindcss/vite";
import { version } from "./package.json";

// https://vite.dev/config/
export default defineConfig({
  base: "/Todo/",
  plugins: [
    react(),
    tailwindcss(),
    {
      name: "inject-sw-version",
      closeBundle() {
        const swPath = "dist/sw.js";
        const sw = readFileSync(swPath, "utf-8");
        writeFileSync(
          // Replace __APP_VERSION__ with app version
          swPath,
          sw.replace("__APP_VERSION__", version),
        );
      },
    },
  ],
});
