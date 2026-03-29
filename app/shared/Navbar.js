"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from './CartContext';
import Banner from './Banner';

export default function Navbar() {
  const pathname = usePathname(); 
  
  const pathSegments = pathname.split('/').filter(Boolean);
  
  const activeCategory = pathSegments.length > 0 ? pathSegments[0] : 'Casual';

  const isProductDetailPage = pathSegments.length === 2;

  const categoryStyles = {
    Casual: { bg: 'bg-[#AAB8AB]', banner: 'bg-[url(/banner/Casual.png)]' },
    Formal: { bg: 'bg-[#54677A]', banner: 'bg-[url(/banner/Formal.png)]' },
    Traditional: { bg: 'bg-[#C5957D]', banner: 'bg-[url(/banner/Traditional.png)]' },
    Sports: { bg: 'bg-[#7D5E5E]', banner: 'bg-[url(/banner/Sports.png)]' },
  };

  const currentStyle = categoryStyles[activeCategory] || categoryStyles.Casual;
  
  const { cart } = useCart();

  return (
    <header className="w-full shadow-md">
      <nav 
        className={`sticky top-0 z-50 flex flex-wrap items-center justify-between px-4 sm:px-8 py-3 transition-colors duration-500 text-white ${currentStyle.bg}`}
      >
        <div className="flex items-center space-x-3">
          <div className="bg-white/20 p-2 rounded-full">
            <img src="/banner/casual.png" alt="Armaan Logo" className="w-8 h-8 object-contain" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-wider uppercase">Armaan</h1>
            <p className="text-[10px] uppercase tracking-widest opacity-80">Genz's Wear</p>
          </div>
        </div>

        <div className="w-full md:w-auto mt-4 md:mt-0 order-3 md:order-2 flex justify-center">
          <ul className="flex space-x-1 sm:space-x-2 bg-black/10 p-1 rounded-full overflow-x-auto">
            {Object.keys(categoryStyles).map((category) => (
              <li key={category}>
                <Link href={`/${category === 'Casual' ? '' : category}`}>
                  <button
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                      activeCategory === category 
                        ? 'bg-white text-gray-900 shadow-sm' 
                        : 'hover:bg-white/20'
                    }`}
                  >
                    {category}
                  </button>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center space-x-4 order-2 md:order-3">
          <Link href="/login">
            <button className="text-sm font-semibold hover:text-gray-200 transition-colors">
              Login
            </button>
          </Link>
          <Link href="/cart" className="bg-white text-gray-900 px-4 py-2 rounded-full text-sm font-bold shadow-sm hover:bg-gray-100 transition-colors flex items-center space-x-2">
            <span>Cart</span>
            <span className="bg-gray-900 text-white text-xs px-2 py-0.5 rounded-full">{cart?.length || 0}</span>
          </Link>
        </div>
        
      </nav>
      
      {!isProductDetailPage && <Banner currentStyle={currentStyle}/>}
    </header>
  );
}