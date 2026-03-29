"use client";
import React from 'react'
function Banner(props){
  return (
      <div 
        className={`w-full h-48 md:h-80 bg-cover bg-center transition-all duration-700 ease-in-out ${props.currentStyle.banner}`}
      >
        <div className="w-full h-full bg-black/10"></div>
      </div>
  )
}

export default Banner
