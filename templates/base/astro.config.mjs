import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  output: 'static',
  integrations: [tailwind()],
  build: {
    assets: 'assets',
  },
  compressHTML: true,
  image: {
    service: { entrypoint: 'astro/assets/services/sharp' },
  },
});
