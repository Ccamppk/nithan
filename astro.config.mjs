// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  // ⬇️ Single source of truth for the domain. After you connect
  // nithaan.com in Vercel, change ONLY this line to 'https://nithaan.com'
  // — canonical, hreflang, Open Graph, sitemap and robots.txt all follow.
  site: 'https://nithaan.com',
  integrations: [sitemap()],
});
