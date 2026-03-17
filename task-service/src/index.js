require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const morgan  = require('morgan');
const { initDB } = require('./db/db');
const taskRoutes = require('./routes/tasks');

const app  = express();
const PORT = process.env.PORT || 3002;

app.use(cors({
  origin: 'https://engse207-final-lab2-67543210004-67543210041-production.up.railway.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.options('*', cors());
app.use(express.json());
app.use(morgan('combined', {
  stream: { write: (msg) => console.log(msg.trim()) }
}));

// ✅ PUBLIC HEALTH ROUTE
app.get('/api/tasks/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'task-service',
    time: new Date()
  });
});

 app.get('/', (req, res) => {
  res.json({ status: 'ok' });
});

// protected routes
app.use('/api/tasks', taskRoutes);

app.use((req, res) => res.status(404).json({ error: 'Route not found' }));

async function start() {
  let retries = 10;
  while (retries > 0) {
    try { await initDB(); break; }
    catch { retries--; await new Promise(r => setTimeout(r, 3000)); }
  }
  app.listen(PORT, () => console.log(`[task-service] Running on port ${PORT}`));
}

start();
