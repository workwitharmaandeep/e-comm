"use client";
import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();
export function CartProvider({ children }) {
  const [cart, setCart] = useState([]); // The cart starts as an empty array

  const addToCart = (product) => {
    setCart((prevCart) => [...prevCart, product]);
    alert(`${product.Name} was added to your cart!`); // A quick feedback popup
  };
  const removeFromCart = (indexToRemove) => {
    setCart((prevCart) => prevCart.filter((_, index) => index !== indexToRemove));
  };

  return (
    <CartContext.Provider value={{ cart, addToCart,removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}