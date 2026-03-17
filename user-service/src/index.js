require('dotenv').config();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const userRoutes = require('./routes/users');

const app = express();

app.use(cors({
  origin: 'https://engse207-final-lab2-67543210004-67543210041-production.up.railway.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(morgan('dev'));

 app.get('/', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 3003;

app.listen(PORT, () => {
  console.log(`User Service running on port ${PORT}`);
});
