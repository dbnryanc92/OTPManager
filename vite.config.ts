import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vuetify from "@vuetify/vite-plugin";
import { VitePWA } from "vite-plugin-pwa";
import * as fs from "fs";

import * as path from "path";

const VitePWAConfig = {
  registerType: "autoUpdate" as "prompt" | "autoUpdate",
  filename: "service-worker.js",
  includeAssets: [
    "/assets/*",
    "/img/favicon.png",
    "/img/favicon.ico",
    "/img/robots.txt",
    "/img/apple-touch-icon.png",
  ],
  manifest: {
    name: "OTP管理大師",
    short_name: "OTP管理大師",
    description: "OTP管理大師，本地備份還原安全方便",
    theme_color: "#FCB43A",
    icons: [
      {
        src: "/img/pwa-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/img/pwa-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/img/pwa-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  },
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    // https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vite-plugin
    vuetify({
      autoImport: true,
    }),
    VitePWA(VitePWAConfig),
  ],
  define: { "process.env": {} },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  server: {
    open: false,
    port: 443,
    https: {
      key: fs.readFileSync("./certs/server.key"),
      cert: fs.readFileSync("./certs/server.crt"),
    },
  },
  /* remove the need to specify .vue files https://vitejs.dev/config/#resolve-extensions
  resolve: {
    extensions: [
      '.js',
      '.json',
      '.jsx',
      '.mjs',
      '.ts',
      '.tsx',
      '.vue',
    ]
  },
  */
});
