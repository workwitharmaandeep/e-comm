import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const [rows] = await pool.query('SELECT id, Name, `desc`, price, imgsrc FROM formalproduct');
    
    // Convert the price from a string to a Number before sending it to the frontend
    const formattedProducts = rows.map((product) => ({
      ...product,
      price: Number(product.price)
    }));
    
    return NextResponse.json({ success: true, data: formattedProducts });
  } catch (error) {
    console.error("Database query failed:", error);
    return NextResponse.json({ success: false, error: 'Failed to fetch products' }, { status: 500 });
  }
}