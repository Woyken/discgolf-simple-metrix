import { defineConfig } from '@solidjs/start/config';

// biome-ignore lint/style/noDefaultExport: API
export default defineConfig({
  server: {
    preset: 'vercel',
  },
});
