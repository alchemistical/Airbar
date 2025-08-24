import { KnipConfig } from "knip";

const config: KnipConfig = {
  entry: ["src/main.tsx", "src/server/index.ts", "test/**/*.test.{ts,tsx}"],
  project: ["src/**/*.{ts,tsx}", "test/**/*.{ts,tsx}"],
  ignore: ["node_modules/**", "dist/**", "build/**", "**/*.d.ts"],
  ignoreDependencies: [
    // Keep these even if not directly imported
    "@replit/vite-plugin-cartographer",
    "@replit/vite-plugin-runtime-error-modal",
    "esbuild",
    "husky",
    "drizzle-kit",
  ],
};

export default config;
