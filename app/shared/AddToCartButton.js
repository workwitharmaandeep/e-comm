"use client";
import React from 'react';
import { useCart } from './CartContext';

export default function AddToCartButton({ product }) {
  const { addToCart } = useCart();

  return (
    <button
      onClick={() => addToCart(product)}
      className="w-full bg-[#AAB8AB] hover:bg-[#54677A] text-white font-bold py-4 rounded-md transition-colors duration-300 shadow-md text-lg"
    >
      Add to Cart
    </button>
  );
}