import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import icon from './plugin';

// https://astro.build/config
export default defineConfig({
  output: "server",
  adapter: node({
    mode: 'standalone'
  }),
  integrations: [
    icon({
      include: {
        mdi: ['*'],
      },
    }),
  ],
});
