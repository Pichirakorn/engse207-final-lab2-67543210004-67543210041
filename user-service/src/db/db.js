const { Pool } = require("pg");

const pool = new Pool({
  host: process.env.DB_HOST || "user-db",
  user: process.env.DB_USER || "admin",
  password: process.env.DB_PASSWORD || "secret",
  database: process.env.DB_NAME || "userdb",
  port: 5432,
});

module.exports = { pool };