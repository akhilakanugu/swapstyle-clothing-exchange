// components/Navbar.jsx
import React, { useState } from 'react';

export default function Navbar({ userName = "Akhila kanugu", onPostItemClick }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <div className="flex items-center gap-2 cursor-pointer">
          <div className="bg-emerald-600 text-white p-2 rounded-xl">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
          </div>
          <span className="font-bold text-xl text-gray-900 tracking-tight">Clothing<span className="text-emerald-600">Swap</span></span>
        </div>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
          <a href="#browse" className="text-emerald-600 font-semibold">Browse Listings</a>
          <a href="#how-it-works" className="hover:text-emerald-600 transition">How it Works</a>
          <a href="#community" className="hover:text-emerald-600 transition">Community</a>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          <button 
            onClick={onPostItemClick}
            className="hidden sm:flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-4 py-2 rounded-full transition shadow-sm hover:shadow"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Post Item
          </button>

          {/* User Profile Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 border border-gray-200 p-1.5 pl-3 rounded-full hover:bg-gray-50 transition"
            >
              <span className="text-xs font-semibold text-gray-700 max-w-[100px] truncate">{userName}</span>
              <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center">
                {userName.charAt(0)}
              </div>
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-lg py-2 text-sm text-gray-700 z-50">
                <a href="#profile" className="block px-4 py-2 hover:bg-emerald-50 hover:text-emerald-600">My Profile</a>
                <a href="#swaps" className="block px-4 py-2 hover:bg-emerald-50 hover:text-emerald-600">My Swap Requests</a>
                <hr className="my-1 border-gray-100" />
                <button className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50">Logout</button>
              </div>
            )}
          </div>
        </div>

      </div>
    </header>
  );
}