// frontend/src/components/ItemCard.jsx
import React from 'react';

export default function ItemCard({ item, onSwapClick }) {
  const defaultImg = "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&auto=format&fit=crop&q=80";
  const imageSrc = item.image_url 
    ? (item.image_url.startsWith('http') ? item.image_url : `http://localhost:5000${item.image_url}`)
    : defaultImg;

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between">
      <div className="relative aspect-[3/4] bg-gray-100">
        <img 
          src={imageSrc} 
          alt={item.title} 
          className="w-full h-full object-cover"
          onError={(e) => { e.target.src = defaultImg; }}
        />
        <span className="absolute top-2 left-2 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded">
          {item.category || 'Clothing'}
        </span>
        <span className="absolute top-2 right-2 bg-pink-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">
          Size: {item.size}
        </span>
      </div>

      <div className="p-3 flex-1 flex flex-col justify-between">
        <div>
          <span className="text-[10px] font-bold text-pink-600 uppercase tracking-wider">
            {item.brand || 'Generic'}
          </span>
          <h3 className="text-sm font-semibold text-gray-900 line-clamp-1">
            {item.title}
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">Condition: {item.condition || 'Good'}</p>
        </div>

        <div className="mt-3">
          <div className="flex items-baseline justify-between mb-2">
            <span className="text-sm font-bold text-gray-900">${item.estimated_value || item.estimatedValue || 0}.00</span>
            <span className="text-[10px] text-gray-400">Est. Value</span>
          </div>

          <button 
            onClick={() => onSwapClick(item)}
            className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs py-2 rounded-lg transition"
          >
            Request Swap
          </button>
        </div>
      </div>
    </div>
  );
}