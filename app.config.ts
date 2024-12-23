import { defineConfig } from '@solidjs/start/config';
import { VitePWA } from 'vite-plugin-pwa';

// biome-ignore lint/style/noDefaultExport: API
export default defineConfig({
  vite: {
    plugins: [
      VitePWA({
        registerType: 'prompt',
        workbox: {
          globPatterns: ['**!(node_modules)/*.{js,wasm,css,html}'],
        },
        includeAssets: ['**/*'],
        manifest: {
          // biome-ignore lint/style/useNamingConvention: API
          theme_color: '#f69435',
          // biome-ignore lint/style/useNamingConvention: API
          background_color: '#f69435',
          display: 'standalone',
          scope: '/',
          // biome-ignore lint/style/useNamingConvention: API
          start_url: '/',
          // biome-ignore lint/style/useNamingConvention: API
          short_name: 'Vite PWA',
          description: 'Vite PWA Demo',
          name: 'Vite PWA',
          icons: [
            {
              src: '/icon-192x192.png',
              sizes: '192x192',
              type: 'image/png',
            },
            {
              src: '/icon-256x256.png',
              sizes: '256x256',
              type: 'image/png',
            },
            {
              src: '/icon-384x384.png',
              sizes: '384x384',
              type: 'image/png',
            },
            {
              src: '/icon-512x512.png',
              sizes: '512x512',
              type: 'image/png',
            },
          ],
        },
        // biome-ignore lint/suspicious/noExplicitAny: vite version missmatch
      }) as any,
    ],
  },
  server: {
    preset: 'vercel',
  },
});
