const pool = require('../config/db');

exports.sendSwapRequest = async (req, res) => {
  try {
    const requesterId = req.user.id;
    const { requestedItemId, offeredItemId } = req.body;

    const query = `
      INSERT INTO swap_requests (requester_id, requested_item_id, offered_item_id)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;

    const { rows } = await pool.query(query, [requesterId, requestedItemId, offeredItemId]);
    res.status(201).json({ success: true, swapRequest: rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateSwapStatus = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { status } = req.body;

    const query = `
      UPDATE swap_requests 
      SET status = $1 
      WHERE id = $2 
      RETURNING *;
    `;

    const { rows } = await pool.query(query, [status, requestId]);
    res.json({ success: true, swapRequest: rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};