import React from 'react';
import Link from 'next/link';
import { getProductsData } from '@/lib/queries';
import AddToCartButton from '@/app/shared/AddToCartButton';
export default async function ProductDetailPage({ params }) {
  const { category, id } = await params;
  const products = await getProductsData(category);
  const product = products.find((p) => p.id.toString() === id.toString());

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Product Not Found</h1>
        <p className="text-gray-500 mb-8">We couldn't find the item you're looking for.</p>
        <Link href={`/${category}`} className="bg-[#54677A] text-white px-6 py-3 rounded-md hover:bg-gray-700 transition">
          Return to {category}
        </Link>
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-6">
        <Link 
          href={`/${category === 'Casual' ? '' : category}`} 
          className="text-sm font-medium text-gray-500 hover:text-gray-900 transition flex items-center gap-2"
        >
          <span> Back to {category}</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-white p-6 md:p-10 rounded-2xl shadow-sm border border-gray-100">
        
        <div className="h-96 md:h-125 bg-gray-50 rounded-xl overflow-hidden flex items-center justify-center border border-gray-100">
          <img
            src={product.imgsrc}
            alt={product.Name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex flex-col justify-center">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2 uppercase tracking-wide">
            {product.Name}
          </h1>
          
          <p className="text-3xl font-bold text-green-600 mb-8">
            ₹{product?.price ? product.price.toFixed(2) : "0.00"}
          </p>

          <div className="mb-10">
            <h3 className="text-lg font-bold text-gray-900 mb-3 border-b pb-2">Description</h3>
            <p className="text-gray-600 leading-relaxed">
              {product.desc || "No description available for this product."}
            </p>
          </div>

          <AddToCartButton product={product} />
        </div>
        
      </div>
    </main>
  );
}