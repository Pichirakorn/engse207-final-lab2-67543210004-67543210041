const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function initDB() {
  try {
    const filePath = path.join(__dirname, '../init.sql');
    console.log("📂 SQL path:", filePath);

    const sql = fs.readFileSync(filePath, 'utf8');
    await pool.query(sql);

    console.log('✅ [auth-db] Tables initialized');
  } catch (err) {
    console.error('❌ [auth-db] Init error:', err.message);
  }
}

module.exports = { pool, initDB };
