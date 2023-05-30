import { defineConfig } from "vite";

import { VitePWA } from "vite-plugin-pwa";
import manifest from "./manifest.json";

export default defineConfig({
  base: "/task-aggregator/",
  plugins: [
    VitePWA({
      manifest,
      includeManifestIcons: false,
      includeAssets: ["any.png"],
      workbox: { sourcemap: true },
      registerType: "autoUpdate",
    }),
  ],
  build: {
    target: "esnext",
    modulePreload: { polyfill: false },
    sourcemap: true,
  },
});
