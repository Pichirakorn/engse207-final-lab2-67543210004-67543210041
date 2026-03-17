require('dotenv').config();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const userRoutes = require('./routes/users');

const app = express();

app.use(cors());
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
