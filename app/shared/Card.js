// app/shared/Card.js
"use client"; // Important: This must be a client component now because it has a click event
import React from 'react';
import { useState } from 'react';
//import { useCart } from './CartContext';
import Link from 'next/link';
import { usePathname} from 'next/navigation';
// Import the hook
const Card = ({ product }) => {
  const path=usePathname();
      const activeCategory = path === '/' ? 'Casual' : path.replace('/', '');

//  const { addToCart } = useCart();
  if (!product) return null;
  return (
    <div  className="border border-gray-200 rounded-lg shadow-md overflow-hidden bg-white flex flex-col hover:shadow-xl transition-shadow duration-300" >
          <Link href={`${activeCategory}/${product.id}`}>
      <div className="h-64 overflow-hidden bg-gray-100 flex items-center justify-center">
        <img src={product.imgsrc} alt={product.Name} className="w-full h-full object-cover" />
      </div>
      </Link>
      <div className="p-4 flex flex-col grow">
        <h2 className="text-xl font-semibold text-gray-800">{product.Name}</h2>
        <p className="text-gray-500 text-sm mt-2 grow">{product.desc}</p>
        
        <div className="mt-4 flex items-center justify-between">
          <span className="text-lg font-bold text-green-600">
            ₹{product?.price ? product.price.toFixed(2) : "0.00"}
          </span>
          {/* Wire up the onClick event here! */}
              <Link href={`${activeCategory}/${product.id}`}>

          <button 
          //  onClick={() => addToCart(product)}
            className="bg-[#b8aab7] hover:bg-[#AAB8AB] text-white px-4 py-2 rounded-md transition duration-300"
          >
            See full details
          </button>
          </Link>
        </div>
      </div>
    </div>  );
};

export default Card;