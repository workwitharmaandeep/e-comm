// app/sitemap.js
import pool from '../lib/db'; // Adjust this path to wherever your TiDB connection file is

export default async function sitemap() {
  const baseUrl = 'https://armaancollection.vercel.app'; // Change to your live URL

  // 1. Define your standard, static pages
  const staticRoutes = ['', '/products', '/about', '/contact'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: route === '' ? 1.0 : 0.8,
  }));

  // 2. Fetch your live products from the database
  let dynamicProductRoutes = [];
  try {
    // Adjust 'products' and 'id' to match your actual database table/columns
    const [products] = await pool.query('SELECT id FROM products');
    
    dynamicProductRoutes = products.map((product) => ({
      // Assuming your product pages look like /products/123
      url: `${baseUrl}/products/${product.id}`, 
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    }));
  } catch (error) {
    console.error("Failed to fetch products for sitemap:", error);
  }

  // 3. Combine and return them
  return [...staticRoutes, ...dynamicProductRoutes];
}