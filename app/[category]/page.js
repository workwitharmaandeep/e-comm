import Card from "../shared/Card";
import { getProductsData } from '@/lib/queries';

export default async function CategoryPage({ params }) {
  const {category} = await params;
  
  const products = await getProductsData(category);
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