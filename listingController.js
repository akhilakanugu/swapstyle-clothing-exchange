const pool = require('../config/db');
const { calculateSwapValue } = require('../utils/valueCalculator');

exports.createListing = async (req, res) => {
  try {
    const { title, brand, category, size, condition, images, lat, lng } = req.body;
    const userId = req.user.id;

    const estimatedValue = calculateSwapValue(category, brand, condition);

    const query = `
      INSERT INTO listings (user_id, title, brand, category, size, condition, images, estimated_value, location)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, ST_SetSRID(ST_MakePoint($9, $10), 4326))
      RETURNING *, ST_Y(location::geometry) AS latitude, ST_X(location::geometry) AS longitude;
    `;

    const values = [userId, title, brand, category, size, condition, images || [], estimatedValue, parseFloat(lng), parseFloat(lat)];
    const { rows } = await pool.query(query, values);

    res.status(201).json({ success: true, listing: rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getNearbyListings = async (req, res) => {
  try {
    const { lat, lng, radiusKm = 15, category, size } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({ error: 'Coordinates lat and lng are required.' });
    }

    const radiusMeters = parseFloat(radiusKm) * 1000;
    const params = [parseFloat(lng), parseFloat(lat), radiusMeters];
    
    let filters = `WHERE is_active = TRUE AND ST_DWithin(location, ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography, $3)`;

    if (category) {
      params.push(category);
      filters += ` AND category = $${params.length}`;
    }

    if (size) {
      params.push(size);
      filters += ` AND size = $${params.length}`;
    }

    const query = `
      SELECT 
        l.id, l.user_id, l.title, l.brand, l.category, l.size, l.condition, l.images, l.estimated_value,
        ST_Y(l.location::geometry) AS latitude, 
        ST_X(l.location::geometry) AS longitude,
        ROUND(ST_DistanceSphere(l.location, ST_SetSRID(ST_MakePoint($1, $2), 4326))::numeric / 1000, 2) AS distance_km
      FROM listings l
      ${filters}
      ORDER BY distance_km ASC;
    `;

    const { rows } = await pool.query(query, params);
    res.json({ success: true, count: rows.length, listings: rows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};