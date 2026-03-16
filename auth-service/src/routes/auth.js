const express  = require('express');
const bcrypt   = require('bcryptjs');
const fetch = require('node-fetch');
const { pool } = require('../db/db');
const { generateToken, verifyToken } = require('../middleware/jwtUtils');

const router = express.Router();

// bcrypt hash ที่ valid จริง ใช้สำหรับ timing-safe compare
// ใช้กรณี "ไม่พบ user"
const DUMMY_BCRYPT_HASH =
  '$2b$10$CwTycUXWue0Thq9StjUM0uJ8y0R6VQwWi4KFOeFHrgb3R04QLbL7a';

// ─────────────────────────────────────────────
// POST /api/auth/register
// สมัครสมาชิกใหม่
// ─────────────────────────────────────────────
router.post('/register', async (req, res) => {

  const { username, email, password } = req.body;
  const ip = req.headers['x-real-ip'] || req.ip;

  if (!username || !email || !password) {
    return res.status(400).json({
      error: 'username, email, password required'
    });
  }

  try {

    const normalizedEmail = String(email).trim().toLowerCase();

    // ตรวจสอบ email ซ้ำ
    const existing = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [normalizedEmail]
    );

    if (existing.rows.length > 0) {
      return res.status(409).json({
        error: 'Email already registered'
      });
    }

    // hash password
    const passwordHash = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users (username, email, password_hash, role)
       VALUES ($1,$2,$3,'member')
       RETURNING id, username, email, role`,
      [username, normalizedEmail, passwordHash]
    );

    const user = result.rows[0];

    res.status(201).json({
      message: 'Register success',
      user
    });

  } catch (err) {

    console.error('[AUTH] Register error:', err.message);

    res.status(500).json({
      error: 'Server error'
    });
  }
});

// ─────────────────────────────────────────────
// POST /api/auth/login
// ใช้ Seed Users เท่านั้น
// ─────────────────────────────────────────────
router.post('/login', async (req, res) => {

  const { email, password } = req.body;
  const ip = req.headers['x-real-ip'] || req.ip;

  if (!email || !password) {
    return res.status(400).json({
      error: 'กรุณากรอก email และ password'
    });
  }

  const normalizedEmail = String(email).trim().toLowerCase();

  try {

    const result = await pool.query(
      'SELECT id, username, email, password_hash, role FROM users WHERE email = $1',
      [normalizedEmail]
    );

    const user = result.rows[0] || null;

    // Timing attack prevention
    const passwordHash = user ? user.password_hash : DUMMY_BCRYPT_HASH;

    const isValid = await bcrypt.compare(password, passwordHash);

    if (!user || !isValid) {

      return res.status(401).json({
        error: 'Email หรือ Password ไม่ถูกต้อง'
      });
    }

    // อัปเดต last_login
    await pool.query(
      'UPDATE users SET last_login = NOW() WHERE id = $1',
      [user.id]
    );

    const token = generateToken({
      sub: user.id,
      email: user.email,
      role: user.role,
      username: user.username
    });

    res.json({
      message: 'Login สำเร็จ',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });

  } catch (err) {

    console.error('[AUTH] Login error:', err.message);

    res.status(500).json({ error: 'Server error' });
  }
});


// ─────────────────────────────────────────────
// GET /api/auth/verify
// ─────────────────────────────────────────────
router.get('/verify', (req, res) => {

  const token = (req.headers['authorization'] || '').split(' ')[1];

  if (!token) {
    return res.status(401).json({
      valid: false,
      error: 'No token'
    });
  }

  try {

    const decoded = verifyToken(token);

    res.json({
      valid: true,
      user: decoded
    });

  } catch (err) {

    res.status(401).json({
      valid: false,
      error: err.message
    });
  }
});


// ─────────────────────────────────────────────
// GET /api/auth/me
// ต้องมี JWT
// ─────────────────────────────────────────────
router.get('/me', async (req, res) => {

  const token = (req.headers['authorization'] || '').split(' ')[1];

  if (!token) {
    return res.status(401).json({
      error: 'Unauthorized'
    });
  }

  try {

    const decoded = verifyToken(token);

    const result = await pool.query(
      'SELECT id, username, email, role, created_at, last_login FROM users WHERE id = $1',
      [decoded.sub]
    );

    if (!result.rows[0]) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    res.json({
      user: result.rows[0]
    });

  } catch (err) {

    res.status(401).json({
      error: 'Invalid token'
    });
  }
});


// ─────────────────────────────────────────────
// GET /api/auth/health
// ─────────────────────────────────────────────
router.get('/health', (_, res) => {

  res.json({
    status: 'ok',
    service: 'auth-service',
    time: new Date()
  });
});


module.exports = router;