import React, { useState, useEffect } from 'react';

const API_BASE = 'http://localhost:5000/api';

export default function App() {
  // --- STATE MANAGEMENT ---
  const [activeTab, setActiveTab] = useState('browse');
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);

  // Auth States
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  // Browse & Search States
  const [listings, setListings] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [size, setSize] = useState('All');

  // Add Item States
  const [itemTitle, setItemTitle] = useState('');
  const [itemBrand, setItemBrand] = useState('');
  const [itemSize, setItemSize] = useState('M');
  const [itemCategory, setItemCategory] = useState('Tops');
  const [itemValue, setItemValue] = useState('');
  const [itemImage, setItemImage] = useState(null);

  // Profile Data States
  const [myListings, setMyListings] = useState([]);
  const [incomingSwaps, setIncomingSwaps] = useState([]);
  const [outgoingSwaps, setOutgoingSwaps] = useState([]);

  // Active Chat States
  const [activeChatSwapId, setActiveChatSwapId] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessageText, setNewMessageText] = useState('');

  // Swap Calculator States
  const [calcBrand, setCalcBrand] = useState('');
  const [calcCondition, setCalcCondition] = useState('Like New');
  const [calcPrice, setCalcPrice] = useState('');
  const [calcResult, setCalcResult] = useState(null);

  // --- FALLBACK MOCK DATA FOR ALL CATEGORIES ---
  const mockListings = [
    { id: 101, title: 'Cotton Graphic Tee', brand: 'Zara', size: 'M', category: 'Tops', estimated_value: '499', image_url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&auto=format&fit=crop' },
    { id: 102, title: 'Casual Striped Shirt', brand: 'H&M', size: 'L', category: 'Tops', estimated_value: '699', image_url: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500&auto=format&fit=crop' },
    { id: 103, title: 'White Oxford Shirt', brand: 'Uniqlo', size: 'S', category: 'Tops', estimated_value: '899', image_url: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=500&auto=format&fit=crop' },
    { id: 104, title: 'Floral Summer Dress', brand: 'Forever 21', size: 'S', category: 'Dresses', estimated_value: '1200', image_url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500&auto=format&fit=crop' },
    { id: 105, title: 'Evening Party Gown', brand: 'MANGO', size: 'M', category: 'Dresses', estimated_value: '2500', image_url: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=500&auto=format&fit=crop' },
    { id: 106, title: 'Classic Denim Jacket', brand: "Levi's", size: 'L', category: 'Jackets', estimated_value: '1800', image_url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&auto=format&fit=crop' },
    { id: 107, title: 'Warm Hoodie Jacket', brand: 'Nike', size: 'XL', category: 'Jackets', estimated_value: '1500', image_url: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=500&auto=format&fit=crop' },
    { id: 108, title: 'White Running Sneakers', brand: 'Adidas', size: 'M', category: 'Shoes', estimated_value: '2200', image_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop' },
    { id: 109, title: 'Brown Leather Boots', brand: 'Woodland', size: 'L', category: 'Shoes', estimated_value: '2800', image_url: 'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=500&auto=format&fit=crop' },
    { id: 110, title: 'Slim Fit Blue Jeans', brand: "Pepe Jeans", size: 'M', category: 'Bottoms', estimated_value: '1100', image_url: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500&auto=format&fit=crop' },
    { id: 111, title: 'Beige Chino Trousers', brand: 'Dockers', size: 'L', category: 'Bottoms', estimated_value: '1300', image_url: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=500&auto=format&fit=crop' }
  ];

  // Visual Category Cards
  const allCategoryCards = [
    { name: 'Tops & Tees', category: 'Tops', image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&auto=format&fit=crop' },
    { name: 'Dresses', category: 'Dresses', image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500&auto=format&fit=crop' },
    { name: 'Jackets & Coats', category: 'Jackets', image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&auto=format&fit=crop' },
    { name: 'Footwear & Shoes', category: 'Shoes', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop' },
    { name: 'Jeans & Bottoms', category: 'Bottoms', image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500&auto=format&fit=crop' }
  ];

  // --- FETCH LISTINGS ---
  const fetchListings = async () => {
    try {
      const query = new URLSearchParams({ search, category, size }).toString();
      const res = await fetch(`${API_BASE}/listings/nearby?${query}`);
      const data = await res.json();
      if (data.listings && data.listings.length > 0) {
        setListings(data.listings);
      } else {
        setListings([]);
      }
    } catch (err) {
      console.error('Error fetching backend listings, using local data:', err);
      setListings([]);
    }
  };

  useEffect(() => {
    fetchListings();
  }, [search, category, size]);

  // Combine backend listings with filtered fallback mock listings
  const filteredMockListings = mockListings.filter((item) => {
    const matchesCategory = category === 'All' || item.category === category;
    const matchesSize = size === 'All' || item.size === size;
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase()) ||
                          item.brand.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSize && matchesSearch;
  });

  const displayItems = listings.length > 0 ? listings : filteredMockListings;

  // --- FETCH PROFILE DATA ---
  const fetchProfileData = async () => {
    if (!user) return;
    try {
      const res = await fetch(`${API_BASE}/users/${user.id}/profile`);
      const data = await res.json();
      setMyListings(data.myListings || []);
      setIncomingSwaps(data.incomingSwaps || []);
      setOutgoingSwaps(data.outgoingSwaps || []);
    } catch (err) {
      console.error('Error fetching profile:', err);
    }
  };

  useEffect(() => {
    if (user) fetchProfileData();
  }, [user, activeTab]);

  // --- AUTH HANDLERS ---
  const handleAuth = async (e) => {
    e.preventDefault();
    const endpoint = isRegistering ? '/auth/register' : '/auth/login';
    const payload = isRegistering
      ? { name: authName, email: authEmail, password: authPassword }
      : { email: authEmail, password: authPassword };

    try {
      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
        alert(isRegistering ? 'Registration successful!' : 'Logged in successfully!');
      } else {
        alert(data.error || 'Authentication failed');
      }
    } catch (err) {
      alert('Authentication request error');
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  // --- POST NEW ITEM HANDLER ---
  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!user) return alert('Please login first to post an item.');

    const formData = new FormData();
    formData.append('userId', user.id);
    formData.append('title', itemTitle);
    formData.append('brand', itemBrand);
    formData.append('size', itemSize);
    formData.append('category', itemCategory);
    formData.append('estimated_value', itemValue);
    if (itemImage) formData.append('image', itemImage);

    try {
      const res = await fetch(`${API_BASE}/listings`, {
        method: 'POST',
        body: formData
      });
      if (res.ok) {
        alert('Item posted successfully!');
        setItemTitle('');
        setItemBrand('');
        setItemValue('');
        setItemImage(null);
        setActiveTab('browse');
        fetchListings();
      } else {
        alert('Failed to post item.');
      }
    } catch (err) {
      console.error('Add item error:', err);
    }
  };

  // --- SWAP REQUEST HANDLER ---
  const handleRequestSwap = async (item) => {
    if (!user) return alert('Please login to request a swap.');
    if (item.user_id && item.user_id === user.id) return alert('You cannot swap with your own item!');

    try {
      const res = await fetch(`${API_BASE}/swaps/request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requesterId: user.id,
          ownerId: item.user_id || 1,
          requestedItemId: item.id,
          offeredItemId: null
        })
      });
      if (res.ok) {
        alert('Swap request sent to the owner!');
      } else {
        alert('Swap request initiated for ' + item.title);
      }
    } catch (err) {
      alert('Swap request initiated for ' + item.title);
    }
  };

  // --- UPDATE SWAP STATUS ---
  const handleUpdateSwapStatus = async (swapId, status) => {
    try {
      const res = await fetch(`${API_BASE}/swaps/${swapId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        fetchProfileData();
      }
    } catch (err) {
      console.error('Update status error:', err);
    }
  };

  // --- CHAT HANDLERS ---
  const fetchChatMessages = async (swapId) => {
    try {
      const res = await fetch(`${API_BASE}/swaps/${swapId}/messages`);
      const data = await res.json();
      setChatMessages(data.messages || []);
      setActiveChatSwapId(swapId);
    } catch (err) {
      console.error('Fetch messages error:', err);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessageText.trim() || !activeChatSwapId || !user) return;

    try {
      const res = await fetch(`${API_BASE}/swaps/${activeChatSwapId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderId: user.id,
          message: newMessageText
        })
      });
      if (res.ok) {
        setNewMessageText('');
        fetchChatMessages(activeChatSwapId);
      }
    } catch (err) {
      console.error('Send message error:', err);
    }
  };

  // --- CALCULATOR HANDLER ---
  const handleCalculateValue = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/calculator/estimate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brand: calcBrand,
          condition: calcCondition,
          originalPrice: calcPrice
        })
      });
      const data = await res.json();
      setCalcResult(data);
    } catch (err) {
      // Fallback calculator calculation
      const base = parseFloat(calcPrice) || 1000;
      const val = Math.round(base * 0.6);
      setCalcResult({
        estimatedValue: val,
        fairMatchRange: { min: Math.round(val * 0.85), max: Math.round(val * 1.15) }
      });
    }
  };

  return (
    <div style={{ fontFamily: 'sans-serif', backgroundColor: '#f9fafb', minHeight: '100vh', margin: 0 }}>
      {/* HEADER / NAVIGATION BAR */}
      <header style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e5e7eb', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ margin: 0, fontSize: '22px', color: '#db2777', fontWeight: 'bold', cursor: 'pointer' }} onClick={() => setActiveTab('browse')}>
          👕 SwapStyle
        </h1>
        <nav style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <button onClick={() => setActiveTab('browse')} style={{ border: 'none', background: 'none', cursor: 'pointer', color: activeTab === 'browse' ? '#db2777' : '#4b5563', fontWeight: activeTab === 'browse' ? 'bold' : 'normal' }}>
            Browse Items
          </button>
          <button onClick={() => setActiveTab('post')} style={{ border: 'none', background: 'none', cursor: 'pointer', color: activeTab === 'post' ? '#db2777' : '#4b5563', fontWeight: activeTab === 'post' ? 'bold' : 'normal' }}>
            Post Item
          </button>
          <button onClick={() => setActiveTab('calculator')} style={{ border: 'none', background: 'none', cursor: 'pointer', color: activeTab === 'calculator' ? '#db2777' : '#4b5563', fontWeight: activeTab === 'calculator' ? 'bold' : 'normal' }}>
            Value Estimator
          </button>
          {user ? (
            <>
              <button onClick={() => setActiveTab('profile')} style={{ border: 'none', background: 'none', cursor: 'pointer', color: activeTab === 'profile' ? '#db2777' : '#4b5563', fontWeight: activeTab === 'profile' ? 'bold' : 'normal' }}>
                My Profile ({user.name})
              </button>
              <button onClick={handleLogout} style={{ border: 'none', background: '#ef4444', color: '#fff', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer' }}>
                Logout
              </button>
            </>
          ) : (
            <button onClick={() => setActiveTab('auth')} style={{ border: 'none', background: '#db2777', color: '#fff', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer' }}>
              Login / Register
            </button>
          )}
        </nav>
      </header>

      {/* MAIN CONTAINER */}
      <main style={{ maxWidth: '1100px', margin: '30px auto', padding: '0 20px' }}>

        {/* 1. BROWSE ITEMS TAB */}
        {activeTab === 'browse' && (
          <div>
            {/* CATEGORY SELECTOR CARDS */}
            <div style={{ marginBottom: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h2 style={{ fontSize: '20px', color: '#111827', margin: 0 }}>
                  Categories ({category === 'All' ? 'Showing All' : category})
                </h2>
                {category !== 'All' && (
                  <button onClick={() => setCategory('All')} style={{ background: '#db2777', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' }}>
                    Show All Items
                  </button>
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '16px' }}>
                {/* Reset Card */}
                <div
                  onClick={() => setCategory('All')}
                  style={{
                    height: '110px',
                    borderRadius: '12px',
                    backgroundColor: category === 'All' ? '#db2777' : '#374151',
                    color: '#fff',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    fontWeight: 'bold',
                    fontSize: '18px',
                    cursor: 'pointer',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                  }}
                >
                  All Items
                </div>

                {/* Individual Category Cards */}
                {allCategoryCards.map((cat, idx) => (
                  <div
                    key={idx}
                    onClick={() => setCategory(cat.category)}
                    style={{
                      height: '110px',
                      borderRadius: '12px',
                      backgroundImage: `linear-gradient(rgba(0,0,0,0.35), rgba(0,0,0,0.35)), url(${cat.image})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      color: '#fff',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      fontWeight: 'bold',
                      fontSize: '16px',
                      cursor: 'pointer',
                      border: category === cat.category ? '3px solid #db2777' : 'none',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                    }}
                  >
                    <span>{cat.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* SEARCH AND FILTERS BAR */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
              <input
                type="text"
                placeholder="Search items or brands..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db' }}
              />
              <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db' }}>
                <option value="All">All Categories</option>
                <option value="Tops">Tops</option>
                <option value="Bottoms">Bottoms</option>
                <option value="Dresses">Dresses</option>
                <option value="Jackets">Jackets</option>
                <option value="Shoes">Shoes</option>
              </select>
              <select value={size} onChange={(e) => setSize(e.target.value)} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db' }}>
                <option value="All">All Sizes</option>
                <option value="XS">XS</option>
                <option value="S">S</option>
                <option value="M">M</option>
                <option value="L">L</option>
                <option value="XL">XL</option>
              </select>
            </div>

            {/* LISTINGS IMAGE GRID */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px' }}>
              {displayItems.map((item) => (
                <div key={item.id} style={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                  <img
                    src={item.image_url.startsWith('http') ? item.image_url : `http://localhost:5000${item.image_url}`}
                    alt={item.title}
                    style={{ width: '100%', height: '220px', objectFit: 'cover' }}
                  />
                  <div style={{ padding: '16px' }}>
                    <h3 style={{ margin: '0 0 6px 0', fontSize: '18px', color: '#111827' }}>{item.title}</h3>
                    <p style={{ margin: '0 0 4px 0', color: '#6b7280', fontSize: '14px' }}>Brand: {item.brand || 'Generic'}</p>
                    <p style={{ margin: '0 0 4px 0', color: '#6b7280', fontSize: '14px' }}>Size: {item.size} | Category: {item.category}</p>
                    <p style={{ margin: '0 0 12px 0', color: '#059669', fontWeight: 'bold' }}>Est. Value: ₹{item.estimated_value}</p>
                    <button
                      onClick={() => handleRequestSwap(item)}
                      style={{ width: '100%', backgroundColor: '#db2777', color: '#fff', border: 'none', padding: '10px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
                    >
                      Request Swap
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 2. POST ITEM TAB */}
        {activeTab === 'post' && (
          <div style={{ maxWidth: '500px', margin: '0 auto', backgroundColor: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
            <h2 style={{ marginTop: 0, color: '#111827' }}>Post New Clothing Item</h2>
            <form onSubmit={handleAddItem} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <input type="text" placeholder="Title (e.g., Denim Jacket)" value={itemTitle} onChange={(e) => setItemTitle(e.target.value)} required style={{ padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }} />
              <input type="text" placeholder="Brand (e.g., Zara, Levi's)" value={itemBrand} onChange={(e) => setItemBrand(e.target.value)} required style={{ padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }} />
              <div style={{ display: 'flex', gap: '10px' }}>
                <select value={itemSize} onChange={(e) => setItemSize(e.target.value)} style={{ flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }}>
                  <option value="XS">XS</option>
                  <option value="S">S</option>
                  <option value="M">M</option>
                  <option value="L">L</option>
                  <option value="XL">XL</option>
                </select>
                <select value={itemCategory} onChange={(e) => setItemCategory(e.target.value)} style={{ flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }}>
                  <option value="Tops">Tops</option>
                  <option value="Bottoms">Bottoms</option>
                  <option value="Dresses">Dresses</option>
                  <option value="Jackets">Jackets</option>
                  <option value="Shoes">Shoes</option>
                </select>
              </div>
              <input type="number" placeholder="Estimated Value (in ₹)" value={itemValue} onChange={(e) => setItemValue(e.target.value)} required style={{ padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }} />
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', color: '#374151' }}>Upload Image:</label>
                <input type="file" accept="image/*" onChange={(e) => setItemImage(e.target.files[0])} style={{ width: '100%' }} />
              </div>
              <button type="submit" style={{ backgroundColor: '#db2777', color: '#fff', padding: '12px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                Upload Listing
              </button>
            </form>
          </div>
        )}

        {/* 3. VALUE ESTIMATOR CALCULATOR TAB */}
        {activeTab === 'calculator' && (
          <div style={{ maxWidth: '500px', margin: '0 auto', backgroundColor: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
            <h2 style={{ marginTop: 0, color: '#111827' }}>Fair Swap Value Estimator</h2>
            <form onSubmit={handleCalculateValue} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <input type="text" placeholder="Brand Name" value={calcBrand} onChange={(e) => setCalcBrand(e.target.value)} required style={{ padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }} />
              <select value={calcCondition} onChange={(e) => setCalcCondition(e.target.value)} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }}>
                <option value="New with tags">New with tags</option>
                <option value="Like New">Like New</option>
                <option value="Good">Good</option>
                <option value="Fair">Fair</option>
              </select>
              <input type="number" placeholder="Original Purchased Price (in ₹)" value={calcPrice} onChange={(e) => setCalcPrice(e.target.value)} required style={{ padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }} />
              <button type="submit" style={{ backgroundColor: '#db2777', color: '#fff', padding: '12px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                Calculate Estimated Swap Value
              </button>
            </form>

            {calcResult && (
              <div style={{ marginTop: '20px', padding: '16px', backgroundColor: '#f3f4f6', borderRadius: '8px' }}>
                <h3 style={{ margin: '0 0 8px 0', color: '#059669' }}>Estimated Value: ₹{calcResult.estimatedValue}</h3>
                <p style={{ margin: 0, color: '#4b5563' }}>Fair Swap Match Range: ₹{calcResult.fairMatchRange.min} - ₹{calcResult.fairMatchRange.max}</p>
              </div>
            )}
          </div>
        )}

        {/* 4. USER AUTHENTICATION TAB */}
        {activeTab === 'auth' && (
          <div style={{ maxWidth: '400px', margin: '0 auto', backgroundColor: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
            <h2 style={{ marginTop: 0, color: '#111827' }}>{isRegistering ? 'Create Account' : 'Login'}</h2>
            <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {isRegistering && (
                <input type="text" placeholder="Full Name" value={authName} onChange={(e) => setAuthName(e.target.value)} required style={{ padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }} />
              )}
              <input type="email" placeholder="Email Address" value={authEmail} onChange={(e) => setAuthEmail(e.target.value)} required style={{ padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }} />
              <input type="password" placeholder="Password" value={authPassword} onChange={(e) => setAuthPassword(e.target.value)} required style={{ padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }} />
              <button type="submit" style={{ backgroundColor: '#db2777', color: '#fff', padding: '12px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                {isRegistering ? 'Register' : 'Login'}
              </button>
            </form>
            <p style={{ marginTop: '16px', textAlign: 'center', color: '#6b7280', fontSize: '14px' }}>
              {isRegistering ? 'Already have an account?' : "Don't have an account?"}{' '}
              <span onClick={() => setIsRegistering(!isRegistering)} style={{ color: '#db2777', cursor: 'pointer', fontWeight: 'bold' }}>
                {isRegistering ? 'Login here' : 'Register here'}
              </span>
            </p>
          </div>
        )}

        {/* 5. PROFILE & CHAT TAB */}
        {activeTab === 'profile' && user && (
          <div>
            <h2 style={{ marginTop: 0 }}>Dashboard - {user.name}</h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '30px' }}>
              {/* INCOMING SWAP REQUESTS */}
              <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                <h3>Incoming Swap Requests</h3>
                {incomingSwaps.length === 0 ? <p style={{ color: '#6b7280' }}>No incoming requests.</p> : (
                  incomingSwaps.map(swap => (
                    <div key={swap.id} style={{ borderBottom: '1px solid #eee', paddingBottom: '12px', marginBottom: '12px' }}>
                      <p style={{ margin: '0 0 6px 0' }}><strong>{swap.requester_name}</strong> wants your item: <em>{swap.item_title}</em></p>
                      <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#6b7280' }}>Status: {swap.status}</p>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => handleUpdateSwapStatus(swap.id, 'accepted')} style={{ backgroundColor: '#10b981', color: '#fff', border: 'none', padding: '4px 10px', borderRadius: '4px', cursor: 'pointer' }}>Accept</button>
                        <button onClick={() => handleUpdateSwapStatus(swap.id, 'rejected')} style={{ backgroundColor: '#ef4444', color: '#fff', border: 'none', padding: '4px 10px', borderRadius: '4px', cursor: 'pointer' }}>Reject</button>
                        <button onClick={() => fetchChatMessages(swap.id)} style={{ backgroundColor: '#3b82f6', color: '#fff', border: 'none', padding: '4px 10px', borderRadius: '4px', cursor: 'pointer' }}>Chat</button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* OUTGOING SWAP REQUESTS */}
              <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                <h3>Outgoing Swap Requests</h3>
                {outgoingSwaps.length === 0 ? <p style={{ color: '#6b7280' }}>No outgoing requests.</p> : (
                  outgoingSwaps.map(swap => (
                    <div key={swap.id} style={{ borderBottom: '1px solid #eee', paddingBottom: '12px', marginBottom: '12px' }}>
                      <p style={{ margin: '0 0 6px 0' }}>Requested: <em>{swap.item_title}</em> ({swap.brand})</p>
                      <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#6b7280' }}>Status: {swap.status}</p>
                      <button onClick={() => fetchChatMessages(swap.id)} style={{ backgroundColor: '#3b82f6', color: '#fff', border: 'none', padding: '4px 10px', borderRadius: '4px', cursor: 'pointer' }}>Open Chat</button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* CHAT MESSAGES PANEL */}
            {activeChatSwapId && (
              <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb', marginBottom: '30px' }}>
                <h3>Swap Chat (Request #{activeChatSwapId})</h3>
                <div style={{ height: '200px', overflowY: 'auto', border: '1px solid #e5e7eb', padding: '12px', borderRadius: '8px', marginBottom: '12px' }}>
                  {chatMessages.length === 0 ? <p style={{ color: '#9ca3af' }}>No messages yet. Start the conversation!</p> : (
                    chatMessages.map(msg => (
                      <div key={msg.id} style={{ marginBottom: '8px', textAlign: msg.sender_id === user.id ? 'right' : 'left' }}>
                        <span style={{ fontSize: '11px', color: '#6b7280', display: 'block' }}>{msg.sender_name}</span>
                        <div style={{ display: 'inline-block', backgroundColor: msg.sender_id === user.id ? '#db2777' : '#e5e7eb', color: msg.sender_id === user.id ? '#fff' : '#111827', padding: '6px 12px', borderRadius: '12px', fontSize: '14px' }}>
                          {msg.message}
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '8px' }}>
                  <input type="text" placeholder="Type a message..." value={newMessageText} onChange={(e) => setNewMessageText(e.target.value)} style={{ flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }} />
                  <button type="submit" style={{ backgroundColor: '#db2777', color: '#fff', padding: '10px 16px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Send</button>
                </form>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}