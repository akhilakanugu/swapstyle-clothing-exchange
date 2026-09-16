// components/FilterSection.jsx
import React from 'react';

const CATEGORIES = ["All", "Tops", "Bottoms", "Jackets", "Dresses", "Shoes", "Accessories"];
const SIZES = ["All Sizes", "XS", "S", "M", "L", "XL"];

export default function FilterSection({ 
  selectedCategory, 
  setSelectedCategory, 
  selectedSize, 
  setSelectedSize,
  searchQuery,
  setSearchQuery 
}) {
  return (
    <div className="max-w-7xl mx-auto px-4 mb-8">
      {/* Search Bar + Size Dropdown Row */}
      <div className="bg-white p-3 rounded-2xl shadow-md border border-gray-100 flex flex-col md:flex-row gap-3 mb-6">
        
        {/* Search Input */}
        <div className="flex-1 flex items-center bg-gray-50 rounded-xl px-4 py-2 border border-transparent focus-within:border-emerald-500 focus-within:bg-white transition">
          <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input 
            type="text" 
            placeholder="Search jackets, Levi's, sneakers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-sm text-gray-800 placeholder-gray-400 focus:outline-none"
          />
        </div>

        {/* Size Filter Dropdown */}
        <div className="w-full md:w-48 bg-gray-50 rounded-xl px-3 py-2 border border-transparent focus-within:border-emerald-500 focus-within:bg-white transition">
          <select 
            value={selectedSize} 
            onChange={(e) => setSelectedSize(e.target.value)}
            className="w-full bg-transparent text-sm font-medium text-gray-700 focus:outline-none cursor-pointer"
          >
            {SIZES.map(size => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              selectedCategory === category 
                ? 'bg-emerald-600 text-white shadow-sm scale-105' 
                : 'bg-white text-gray-600 border border-gray-200 hover:border-emerald-300 hover:text-emerald-600'
            }`}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
}