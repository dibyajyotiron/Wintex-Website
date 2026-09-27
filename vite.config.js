import { existsSync, readFileSync } from "node:fs";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  preview: {
    headers: existsSync("dist/_headers") ? {
      "Content-Security-Policy": readFileSync("dist/_headers", "utf8").split("Content-Security-Policy: ")[1]?.trim(),
    } : {},
  },
  build: { assetsDir: "assets/bundles" },
  plugins: [react(), tailwindcss(), {
    name: "preview-static-routes",
    configurePreviewServer(server) {
      server.middlewares.use((request, response, next) => {
        const url = new URL(request.url, "http://localhost");
        const route = url.pathname.replace(/\/$/, "");
        if (/^\/(enquiry|products\/[a-z0-9-]+)$/.test(route) && existsSync(`dist${route}/index.html`)) {
          request.url = `${route}/index.html${url.search}`;
        }
        next();
      });
    },
  }],
  resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
});
