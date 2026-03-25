import Card from "../shared/Card";
import Link from "next/link";
// Function to fetch data from your new MySQL API
async function getProducts() {
  // Use absolute URL for server-side fetching in Next.js
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/products`, {
    cache: 'no-store' // Ensures fresh data is fetched on every request
  });
  
  if (!res.ok) {
    throw new Error('Failed to fetch products');
  }
  
  return res.json();
}
export default async function Home() {
  const response = await getProducts();
  const products = response.data;
  return (
    <main className="max-w-7xl mx-auto px-4 py-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <Card key={product.id} product={product}  />
        ))}
      </div>
    </main>
  );
}
