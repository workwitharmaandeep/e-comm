import pool from '@/lib/db';

const ALLOWED_CATEGORIES = ['Casual', 'Formal', 'Traditional','Sports']; 

export async function getProductsData(category) {
  const activeCategory = category || 'Casual';

  if (!ALLOWED_CATEGORIES.includes(activeCategory)) {
    throw new Error('Invalid category');
  }

  const c_id = activeCategory=="Sports" ? 1931:activeCategory=="Formal" ?6301: activeCategory=="Traditional" ? 2031 :3301;
  
  const [rows] = await pool.query(`SELECT id,name,description,base_price,dp FROM products where category_id=${c_id}`);
  return rows.map((product) => ({
    ...product,
    price: Number(product.base_price)
  }));
}