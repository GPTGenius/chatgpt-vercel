import { defineConfig } from 'astro/config';
import solidJs from '@astrojs/solid-js';
import vercel from '@astrojs/vercel/edge';
import tailwind from '@astrojs/tailwind';

import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  integrations: [solidJs(), tailwind(), react()],
  output: 'server',
  adapter: vercel({ analytics: true }),
});
