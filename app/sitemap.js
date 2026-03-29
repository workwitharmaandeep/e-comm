// app/sitemap.js
import { getProductsData } from '@/lib/queries';

export default async function sitemap() {
  const baseUrl = 'https://armaancollection.vercel.app'; 

  // The categories matching your database and routing structure
  const categories = ['Casual', 'Formal', 'Traditional', 'Sports'];

  // 1. Define your standard, static pages
  const staticRoutes = ['', ...categories.map(c => `/${c.toLowerCase()}`)].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: route === '' ? 1.0 : 0.8,
  }));

  // 2. Fetch your live products from the database for ALL categories
  let dynamicProductRoutes = [];
  try {
    // Fetch products for all categories concurrently to save time
    const categoryPromises = categories.map(async (category) => {
      const products = await getProductsData(category);
      
      // Map the returned products into sitemap objects
      return products.map((product) => ({
        url: `${baseUrl}/${category}/${product.id}`, 
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.9,
      }));
    });

    // Wait for all database queries to finish, then flatten into a single array
    const nestedRoutes = await Promise.all(categoryPromises);
    dynamicProductRoutes = nestedRoutes.flat();

  } catch (error) {
    console.error("Failed to fetch products for sitemap:", error);
  }

  // 3. Combine static routes and dynamic product routes
  return [...staticRoutes, ...dynamicProductRoutes];
}