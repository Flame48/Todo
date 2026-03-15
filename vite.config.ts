import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { readFileSync, writeFileSync } from "fs";
import tailwindcss from "@tailwindcss/vite";

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
          swPath,
          sw.replace(
            "__APP_VERSION__",
            sw.replace("__APP_VERSION__", Date.now().toString()),
          ),
        );
      },
    },
  ],
});
