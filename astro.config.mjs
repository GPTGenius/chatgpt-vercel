import { defineConfig } from 'astro/config';
import solidJs from '@astrojs/solid-js';
import vercel from '@astrojs/vercel/edge';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import checker from 'vite-plugin-checker';

// https://astro.build/config
export default defineConfig({
  integrations: [solidJs(), tailwind(), react()],
  output: 'server',
  adapter: vercel({ analytics: true }),
  vite: {
    plugins: [
      checker({
        typescript: true,
        eslint: {
          // for example, lint .ts and .tsx
          lintCommand: 'eslint --quiet --ext .js,.ts,.tsx,.astro .',
        },
      }),
    ],
  },
});
