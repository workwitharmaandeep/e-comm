// app/cart/page.js
"use client";
import React from 'react';
import { useCart } from '../shared/CartContext';
import Link from 'next/link';

export default function CartPage() {
  // Bring in the cart data and our new remove function
  const { cart, removeFromCart } = useCart();

  // Calculate the total price using the JavaScript reduce() method
  const cartTotal = cart.reduce((total, item) => total + (item.price || 0), 0);

  // If the cart is empty, show a friendly message
  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
        <p className="text-gray-500 mb-8">Looks like you haven't added anything yet.</p>
        <Link href="/" className="bg-[#54677A] text-white px-6 py-3 rounded-md hover:bg-gray-700 transition">
          Continue Shopping
        </Link>
      </div>
    );
  }

  // If there are items, show the cart list
  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side: Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item, index) => (
            <div key={index} className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center space-x-4">
                <img src={item.imgsrc} alt={item.Name} className="w-20 h-20 object-cover rounded bg-gray-100" />
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">{item.Name}</h2>
                  <p className="text-gray-500 text-sm">${item.price ? item.price.toFixed(2) : "0.00"}</p>
                </div>
              </div>
              <button 
                onClick={() => removeFromCart(index)}
                className="text-red-500 hover:text-red-700 text-sm font-medium transition"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        {/* Right Side: Order Summary */}
        <div className="bg-gray-100 p-6 rounded-lg h-fit">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
          
          <div className="flex justify-between border-b border-gray-300 pb-4 mb-4">
            <span className="text-gray-600">Subtotal ({cart.length} items)</span>
            <span className="font-semibold">${cartTotal.toFixed(2)}</span>
          </div>
          
          <div className="flex justify-between mb-6">
            <span className="text-lg font-bold text-gray-900">Total</span>
            <span className="text-lg font-bold text-green-600">${cartTotal.toFixed(2)}</span>
          </div>

          <button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-md transition shadow-md">
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}