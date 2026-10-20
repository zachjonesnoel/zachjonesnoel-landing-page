import type { APIRoute } from 'astro';

// Plain endpoint instead of @astrojs/sitemap: the installed 3.7.x release needs Astro 5.
const paths = ['/', '/talks/', '/writing/', '/shows/'];

export const GET: APIRoute = ({ site }) => {
  const base = site!.origin;
  const urls = paths.map(p => `  <url><loc>${base}${p}</loc></url>`).join('\n');
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
    { headers: { 'Content-Type': 'application/xml; charset=utf-8' } },
  );
};
