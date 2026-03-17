-- ===============================
-- USERS TABLE
-- ===============================
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'member',
  created_at TIMESTAMP DEFAULT NOW(),
  last_login TIMESTAMP
);

-- ===============================
-- LOGS TABLE
-- ===============================
CREATE TABLE IF NOT EXISTS logs (
  id SERIAL PRIMARY KEY,
  level VARCHAR(10) NOT NULL,
  event VARCHAR(100) NOT NULL,
  user_id INTEGER,
  message TEXT,
  meta JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ===============================
-- SEED USERS (SAFE)
-- ===============================
INSERT INTO users (username, email, password_hash, role)
VALUES
  ('alice', 'alice@lab.local', '$2b$10$8bNx1syrjuUiJT0ntNkeLeRYjDrBSrjKCV641itIsi7oTkUV384Gu', 'member'),
  ('bob',   'bob@lab.local',   '$2b$10$5mFq0vpPsboCQw5CIBVdBuTOAJI/FQCcNf3qJXECcoptxPP7D49CK', 'member'),
  ('admin', 'admin@lab.local', '$2b$10$mHpTe4GB9Spd3WRmLUZ/seD7P548szZ9chM5.BheoRF6LLpaQ8myq', 'admin')
ON CONFLICT (email) DO NOTHING;