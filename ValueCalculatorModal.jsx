// frontend/src/components/ValueCalculatorModal.jsx
import React, { useState } from 'react';

export default function ValueCalculatorModal({ isOpen, onClose }) {
  const [brand, setBrand] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [condition, setCondition] = useState('Good');
  const [result, setResult] = useState(null);

  if (!isOpen) return null;

  const handleCalculate = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost:5000/api/calculator/estimate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ brand, originalPrice, condition })
    });
    const data = await res.json();
    setResult(data);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-black">✕</button>
        <h2 className="text-lg font-bold text-gray-900 mb-4">Swap Value Calculator</h2>

        <form onSubmit={handleCalculate} className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-gray-600">Brand Name</label>
            <input type="text" value={brand} onChange={e => setBrand(e.target.value)} required placeholder="e.g. Zara, Levi's, FabIndia" className="w-full border p-2 rounded-lg text-sm" />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-600">Original Bought Price ($)</label>
            <input type="number" value={originalPrice} onChange={e => setOriginalPrice(e.target.value)} required placeholder="50" className="w-full border p-2 rounded-lg text-sm" />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-600">Item Condition</label>
            <select value={condition} onChange={e => setCondition(e.target.value)} className="w-full border p-2 rounded-lg text-sm">
              <option>New with tags</option>
              <option>Like New</option>
              <option>Good</option>
              <option>Fair</option>
            </select>
          </div>

          <button type="submit" className="w-full bg-pink-600 text-white py-2 rounded-lg text-sm font-bold mt-2">
            Calculate Estimated Swap Value
          </button>
        </form>

        {result && (
          <div className="mt-4 p-3 bg-pink-50 border border-pink-200 rounded-xl text-center">
            <p className="text-xs text-pink-700 font-semibold">Suggested Swap Value</p>
            <p className="text-2xl font-black text-pink-600">${result.estimatedValue}.00</p>
            <p className="text-[11px] text-gray-500 mt-1">Fair Swap Range: ${result.fairMatchRange.min} - ${result.fairMatchRange.max}</p>
          </div>
        )}
      </div>
    </div>
  );
}