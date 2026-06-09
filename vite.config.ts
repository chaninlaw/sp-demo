import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "path";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    server: {
      port: parseInt(env.VITE_PORT, 10) || 5173,
      allowedHosts: ["sp-demo.projectplaceholders.com"],
    },
    preview: {
      port: parseInt(env.VITE_PORT, 10) || 5173,
      allowedHosts: ["sp-demo.projectplaceholders.com"],
    },
    plugins: [
      tanstackRouter({ target: "react", autoCodeSplitting: true }),
      react(),
      tailwindcss(),
    ],
    resolve: {
      alias: {
        "@/app": resolve(__dirname, "src/app"),
        "@/pages": resolve(__dirname, "src/pages"),
        "@/widgets": resolve(__dirname, "src/widgets"),
        "@/features": resolve(__dirname, "src/features"),
        "@/entities": resolve(__dirname, "src/entities"),
        "@/shared": resolve(__dirname, "src/shared"),
      },
    },
  };
});
