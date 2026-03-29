import pool from '@/lib/db';

const ALLOWED_CATEGORIES = ['Casual', 'Formal', 'Traditional','Sports']; 

export async function getProductsData(category) {
  const activeCategory = category || 'Casual';

  if (!ALLOWED_CATEGORIES.includes(activeCategory)) {
    throw new Error('Invalid category');
  }

  const tableName = `${activeCategory}product`;
  
  const [rows] = await pool.query(`SELECT id, Name, \`desc\`, price, imgsrc FROM ${tableName}`);
  //  const [rows] = await pool.query(`SELECT id, Name, \`desc\`, price, imgsrc FROM products where category= ${tableName}`);

  return rows.map((product) => ({
    ...product,
    price: Number(product.price)
  }));
}