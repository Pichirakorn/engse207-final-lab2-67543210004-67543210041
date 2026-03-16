const express = require('express');
const { pool } = require('../db/db');
const { authenticate } = require('../middleware/authMiddleware');

const router = express.Router();


// GET /api/users/me
router.get('/me', authenticate, async (req, res) => {

  const userId = req.user.sub;

  let result = await pool.query(
    'SELECT * FROM user_profiles WHERE user_id = $1',
    [userId]
  );

  // If profile doesn't exist → create it
  if (result.rows.length === 0) {

    result = await pool.query(
      `INSERT INTO user_profiles (user_id, username, email, role)
       VALUES ($1,$2,$3,$4)
       RETURNING *`,
      [req.user.sub, req.user.username, req.user.email, req.user.role]
    );

  }

  res.json(result.rows[0]);

});


// PUT /api/users/me
router.put('/me', authenticate, async (req, res) => {

  const userId = req.user.sub;
  const { display_name, bio, avatar_url } = req.body;

  const result = await pool.query(
    `UPDATE user_profiles
     SET display_name=$1, bio=$2, avatar_url=$3, updated_at=NOW()
     WHERE user_id=$4
     RETURNING *`,
    [display_name, bio, avatar_url, userId]
  );

  res.json(result.rows[0]);

});


// GET /api/users (admin only)
router.get('/', authenticate, async (req, res) => {

  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin only' });
  }

  const result = await pool.query(
    'SELECT * FROM user_profiles'
  );

  res.json(result.rows);

});


// GET /api/users/health
router.get('/health', (_, res) => {

  res.json({
    status: 'ok',
    service: 'user-service',
    time: new Date()
  });

});

module.exports = router;