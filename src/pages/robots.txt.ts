import type { APIRoute } from 'astro';

// Generated from `site` in astro.config.mjs so the Sitemap line always
// matches the live domain — no manual edit needed when the domain changes.
export const GET: APIRoute = ({ site }) => {
  const sitemap = new URL('sitemap-index.xml', site).href;
  const body = `User-agent: *
Allow: /

Sitemap: ${sitemap}
`;
  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
