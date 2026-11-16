import { supabase } from '../../lib/supabaseAdmin';

const STATIC_PAGES = [
  { loc: 'https://tradichatter.store/', priority: '1.0', changefreq: 'weekly' },
  { loc: 'https://tradichatter.store/about', priority: '0.7', changefreq: 'monthly' },
  { loc: 'https://tradichatter.store/contact', priority: '0.6', changefreq: 'monthly' },
  { loc: 'https://tradichatter.store/privacy', priority: '0.4', changefreq: 'yearly' },
  { loc: 'https://tradichatter.store/terms', priority: '0.4', changefreq: 'yearly' },
  { loc: 'https://tradichatter.store/blog', priority: '0.9', changefreq: 'weekly' },
];

export default async function handler(req, res) {
  const { data: posts } = await supabase
    .from('blog_posts')
    .select('slug, published_at, updated_at')
    .eq('status', 'published')
    .order('published_at', { ascending: false });

  const blogUrls = (posts || []).map(p => ({
    loc: `https://tradichatter.store/blog/${p.slug}`,
    lastmod: (p.updated_at || p.published_at || '').slice(0, 10),
    priority: '0.8',
    changefreq: 'monthly',
  }));

  const today = new Date().toISOString().slice(0, 10);
  const allUrls = [
    ...STATIC_PAGES.map(p => ({ ...p, lastmod: today })),
    ...blogUrls,
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls.map(u => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  res.setHeader('Content-Type', 'application/xml');
  res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600');
  return res.status(200).send(xml);
}
