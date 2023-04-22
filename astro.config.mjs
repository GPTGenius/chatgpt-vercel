import { defineConfig } from 'astro/config';
import solidJs from '@astrojs/solid-js';
import vercel from '@astrojs/vercel/edge';
import node from '@astrojs/node';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import checker from 'vite-plugin-checker';

// https://astro.build/config
export default defineConfig({
  integrations: [solidJs(), tailwind(), react()],
  output: 'server',
  adapter: process.env.VERCEL
    ? vercel({ analytics: true })
    : node({ mode: 'standalone' }),
  vite: {
    plugins: [
      checker({
        typescript: true,
        eslint: {
          lintCommand: 'eslint --quiet --ext .js,.ts,.tsx,.astro .',
        },
      }),
    ],
  },
});
