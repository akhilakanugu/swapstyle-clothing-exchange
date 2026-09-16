const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Serve uploaded image files publicly
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- MULTER CONFIGURATION FOR IMAGE UPLOADS ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// --- DATABASE CONNECTION ---
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'clothing_swap',
  password: process.env.DB_PASSWORD || '2421',
  port: process.env.DB_PORT || 5432,
});

const db = {
  query: (text, params) => pool.query(text, params),
};

// --- INITIALIZE TABLES ---
const initDb = async () => {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS listings (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(150) NOT NULL,
        brand VARCHAR(100),
        size VARCHAR(20),
        category VARCHAR(50) DEFAULT 'Uncategorized',
        estimated_value NUMERIC(10, 2),
        image_url VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS swap_requests (
        id SERIAL PRIMARY KEY,
        requester_id INT REFERENCES users(id) ON DELETE CASCADE,
        owner_id INT REFERENCES users(id) ON DELETE CASCADE,
        requested_item_id INT REFERENCES listings(id) ON DELETE CASCADE,
        offered_item_id INT REFERENCES listings(id) ON DELETE CASCADE,
        status VARCHAR(20) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS chat_messages (
        id SERIAL PRIMARY KEY,
        swap_request_id INT REFERENCES swap_requests(id) ON DELETE CASCADE,
        sender_id INT REFERENCES users(id) ON DELETE CASCADE,
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Database tables initialized successfully!');
  } catch (err) {
    console.error('Database connection error:', err.message);
  }
};

initDb();

// --- API ROUTES ---

// 1. Get Listings with Search, Category, and Size Filter
app.get('/api/listings/nearby', async (req, res) => {
  const { search, category, size } = req.query;
  try {
    let queryText = 'SELECT * FROM listings WHERE 1=1';
    const params = [];

    if (search && search.trim() !== '') {
      params.push(`%${search.trim()}%`);
      queryText += ` AND (LOWER(title) LIKE LOWER($${params.length}) OR LOWER(brand) LIKE LOWER($${params.length}) OR LOWER(category) LIKE LOWER($${params.length}))`;
    }

    if (category && category !== 'All' && category !== 'All Categories') {
      params.push(category.trim());
      queryText += ` AND LOWER(category) = LOWER($${params.length})`;
    }

    if (size && size !== 'All' && size !== 'All Sizes') {
      params.push(size.trim());
      queryText += ` AND LOWER(size) = LOWER($${params.length})`;
    }

    queryText += ' ORDER BY id DESC';

    const result = await db.query(queryText, params);

    const formattedListings = result.rows.map(item => ({
      ...item,
      image_url: item.image_url || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop&q=80'
    }));

    res.json({ listings: formattedListings });
  } catch (err) {
    console.error('Error fetching listings:', err);
    res.status(500).json({ error: 'Failed to fetch listings' });
  }
});

// 2. Post New Item
app.post('/api/listings', upload.single('image'), async (req, res) => {
  const { userId, title, brand, size, category, estimated_value } = req.body;
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    const result = await db.query(
      'INSERT INTO listings (user_id, title, brand, size, category, estimated_value, image_url) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [userId || null, title, brand, size, category || 'Uncategorized', estimated_value, imageUrl]
    );
    res.status(201).json({ message: 'Item created', item: result.rows[0] });
  } catch (err) {
    console.error('Add listing error:', err);
    res.status(500).json({ error: 'Failed to add listing' });
  }
});

// 3. User Registration
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await db.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email',
      [name, email, hashedPassword]
    );
    res.json({ user: result.rows[0], token: 'fake-jwt-token' });
  } catch (err) {
    res.status(400).json({ error: 'User registration failed or email already exists' });
  }
});

// 4. User Login
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    res.json({ user: { id: user.id, name: user.name, email: user.email }, token: 'fake-jwt-token' });
  } catch (err) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// 5. Swap Value Calculator Algorithm
app.post('/api/calculator/estimate', (req, res) => {
  const { brand, condition, category, originalPrice } = req.body;
  
  let baseValue = parseFloat(originalPrice) || 30;

  const conditionMultipliers = {
    'New with tags': 0.85,
    'Like New': 0.70,
    'Good': 0.50,
    'Fair': 0.30
  };

  const luxuryBrands = ['gucci', 'zara', 'levi\'s', 'fabindia', 'biba', 'nike'];
  const isLuxury = luxuryBrands.some(b => (brand || '').toLowerCase().includes(b));
  const brandMultiplier = isLuxury ? 1.2 : 1.0;

  const estimatedValue = baseValue * (conditionMultipliers[condition] || 0.5) * brandMultiplier;

  res.json({
    estimatedValue: Math.round(estimatedValue),
    fairMatchRange: {
      min: Math.round(estimatedValue * 0.8),
      max: Math.round(estimatedValue * 1.2)
    }
  });
});

// 6. Send Swap Request
app.post('/api/swaps/request', async (req, res) => {
  const { requesterId, ownerId, requestedItemId, offeredItemId } = req.body;
  try {
    const query = `
      INSERT INTO swap_requests (requester_id, owner_id, requested_item_id, offered_item_id)
      VALUES ($1, $2, $3, $4) RETURNING *;
    `;
    const result = await db.query(query, [requesterId, ownerId, requestedItemId, offeredItemId]);
    res.json({ success: true, request: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 7. Update Swap Status (Accept/Reject)
app.patch('/api/swaps/:id', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const result = await db.query(
      'UPDATE swap_requests SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );
    res.json({ message: `Swap request ${status}`, swap: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update swap request' });
  }
});

// 8. Get User Profile Data
app.get('/api/users/:id/profile', async (req, res) => {
  const { id } = req.params;
  try {
    const listings = await db.query('SELECT * FROM listings WHERE user_id = $1 ORDER BY created_at DESC', [id]);
    
    const incomingSwaps = await db.query(`
      SELECT s.id, s.status, s.created_at, l.title as item_title, u.name as requester_name, u.email as requester_email
      FROM swap_requests s
      JOIN listings l ON s.requested_item_id = l.id
      JOIN users u ON s.requester_id = u.id
      WHERE s.owner_id = $1
      ORDER BY s.created_at DESC
    `, [id]);

    const outgoingSwaps = await db.query(`
      SELECT s.id, s.status, s.created_at, l.title as item_title, l.brand, l.size
      FROM swap_requests s
      JOIN listings l ON s.requested_item_id = l.id
      WHERE s.requester_id = $1
      ORDER BY s.created_at DESC
    `, [id]);

    res.json({
      myListings: listings.rows,
      incomingSwaps: incomingSwaps.rows,
      outgoingSwaps: outgoingSwaps.rows
    });
  } catch (err) {
    console.error('Fetch profile error:', err);
    res.status(500).json({ error: 'Failed to fetch user profile data' });
  }
});

// 9. Fetch Chat Messages for Swap Request
app.get('/api/swaps/:requestId/messages', async (req, res) => {
  const { requestId } = req.params;
  try {
    const query = `
      SELECT m.id, m.swap_request_id, m.sender_id, m.message, m.created_at, u.name as sender_name
      FROM chat_messages m
      JOIN users u ON m.sender_id = u.id
      WHERE m.swap_request_id = $1
      ORDER BY m.created_at ASC
    `;
    const { rows } = await db.query(query, [requestId]);
    res.json({ messages: rows });
  } catch (err) {
    console.error('Fetch messages error:', err);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// 10. Send Chat Message
app.post('/api/swaps/:requestId/messages', async (req, res) => {
  const { requestId } = req.params;
  const { senderId, message } = req.body;

  if (!message || !message.trim()) {
    return res.status(400).json({ error: 'Message cannot be empty' });
  }

  try {
    const query = `
      INSERT INTO chat_messages (swap_request_id, sender_id, message)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    const { rows } = await db.query(query, [requestId, senderId, message]);
    res.json({ success: true, message: rows[0] });
  } catch (err) {
    console.error('Send message error:', err);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// --- SERVER LISTEN ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});