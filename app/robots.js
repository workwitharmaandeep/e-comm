
export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/cart', '/checkout', '/account'], 
    },
    sitemap: 'https://armaancollection.vercel.app/sitemap.xml', 
  }
}