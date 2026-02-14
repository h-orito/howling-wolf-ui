export default defineEventHandler(async (event) => {
  const siteUrl = 'https://howling-wolf.com'

  const staticPages = [
    { url: '/', priority: 1.0, changefreq: 'daily' },
    { url: '/rule', priority: 0.9, changefreq: 'monthly' },
    { url: '/faq', priority: 0.8, changefreq: 'monthly' },
    { url: '/about', priority: 0.7, changefreq: 'monthly' },
    { url: '/village-list', priority: 0.9, changefreq: 'hourly' },
    { url: '/charachip-list', priority: 0.6, changefreq: 'weekly' },
    { url: '/create-village', priority: 0.7, changefreq: 'weekly' }
  ]

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticPages
  .map(
    (page) => `  <url>
    <loc>${siteUrl}${page.url}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
  </url>`
  )
  .join('\n')}
</urlset>`

  setHeader(event, 'content-type', 'text/xml')
  return sitemap
})
