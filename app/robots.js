// app/robots.js

export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Block search engines from indexing private routes
      disallow: ['/admin', '/cart', '/checkout', '/account'], 
    },
    // Tell Google exactly where to find your sitemap
    sitemap: 'https://armaancollection.vercel.app/sitemap.xml', 
  }
}