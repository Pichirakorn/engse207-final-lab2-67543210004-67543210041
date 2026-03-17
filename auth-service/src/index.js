require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const morgan  = require('morgan');
const { initDB } = require('./db/db');
const authRoutes = require('./routes/auth');

const app  = express();
const PORT = process.env.PORT || 3001;

// ── Middleware ──
app.use(cors());
app.use(express.json());

morgan.token('body-size', (req) => {
  return req.body ? JSON.stringify(req.body).length + 'b' : '0b';
});
app.use(morgan(':method :url :status :response-time ms - body::body-size', {
  stream: {
    write: (msg) => console.log(msg.trim())
  }
}));

// ── Routes ──
app.use('/api/auth', authRoutes);

// health check (สำคัญมาก)
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// 404
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found', path: req.path });
});

// error handler
app.use((err, req, res, _next) => {
  console.error('[ERROR]', err.message);
  res.status(500).json({ error: 'Internal Server Error' });
});

// ── Start server ก่อน ──
app.listen(PORT, '0.0.0.0', () => {
  console.log(`[auth-service] Running on port ${PORT}`);

  // 🔥 init DB แบบ background (ไม่ block)
  initDB()
    .then(() => console.log('[auth-service] DB ready'))
    .catch(err => console.error('[auth-service] DB error:', err.message));
});
