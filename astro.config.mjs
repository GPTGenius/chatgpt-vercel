import { defineConfig } from 'astro/config';
import solidJs from "@astrojs/solid-js";
import vercel from "@astrojs/vercel/serverless";

// https://astro.build/config
export default defineConfig({
  integrations: [solidJs()],
  output: "server",
  adapter: vercel()
});