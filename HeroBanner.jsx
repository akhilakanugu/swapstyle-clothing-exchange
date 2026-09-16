// components/HeroBanner.jsx
import React from 'react';

export default function HeroBanner({ onPostClick }) {
  return (
    <section className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 text-white py-16 px-6 rounded-3xl my-6 max-w-7xl mx-auto shadow-xl relative overflow-hidden">
      
      {/* Background Decorative Circles */}
      <div className="absolute -right-10 -bottom-10 w-64 h-64 rounded-full bg-emerald-600/20 blur-3xl pointer-events-none"></div>
      <div className="absolute top-0 right-1/3 w-48 h-48 rounded-full bg-teal-400/10 blur-2xl pointer-events-none"></div>

      <div className="max-w-2xl relative z-10">
        <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
          Sustainable Fashion Marketplace
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mt-4 mb-3 leading-tight">
          Swap Your Style. <br /><span className="text-emerald-400">Reduce Textile Waste.</span>
        </h1>
        <p className="text-emerald-100/90 text-base sm:text-lg mb-8 leading-relaxed">
          Exchange pre-loved clothing directly with people in your local neighborhood. Calculate values, trade items, and build a circular wardrobe.
        </p>

        <div className="flex flex-wrap gap-4">
          <button 
            onClick={onPostClick}
            className="bg-emerald-400 hover:bg-emerald-300 text-emerald-950 font-bold px-6 py-3 rounded-xl transition shadow-lg hover:shadow-emerald-400/20"
          >
            Post an Item to Swap
          </button>
          <a 
            href="#browse" 
            className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold px-6 py-3 rounded-xl transition"
          >
            Explore Nearby Items
          </a>
        </div>
      </div>
    </section>
  );
}