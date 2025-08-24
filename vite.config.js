import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export default defineConfig({
    plugins: [
        react(),
        runtimeErrorOverlay(),
        ...(process.env.NODE_ENV !== "production" &&
            process.env.REPL_ID !== undefined
            ? [
                await import("@replit/vite-plugin-cartographer").then(m => m.cartographer()),
            ]
            : []),
    ],
    base: "/AugAirBar/",
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "client/src"),
            "@/components": path.resolve(__dirname, "client/src", "components"),
            "@/pages": path.resolve(__dirname, "client/src", "pages"),
            "@/hooks": path.resolve(__dirname, "client/src", "hooks"),
            "@/lib": path.resolve(__dirname, "client/src", "lib"),
            "@/server": path.resolve(__dirname, "client/src", "server"),
            "@assets": path.resolve(__dirname, "docs/assets"),
        },
    },
    root: path.resolve(__dirname, "client"),
    publicDir: path.resolve(__dirname, "client/public"),
    build: {
        outDir: path.resolve(__dirname, "dist/public"),
        emptyOutDir: true,
    },
    server: {
        fs: {
            strict: true,
            deny: ["**/.*"],
        },
    },
});
