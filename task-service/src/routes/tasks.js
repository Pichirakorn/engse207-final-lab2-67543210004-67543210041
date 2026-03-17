const express = require('express');
const router = express.Router();
const { pool } = require('../db/db');
const authMiddleware = require('../middleware/authMiddleware');

// 🔐 Protect all routes
router.use(authMiddleware);

/* =========================
   GET all tasks
========================= */
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM tasks WHERE user_id = $1 ORDER BY id DESC',
      [req.user.sub]
    );

    res.json(result.rows);
  } catch (err) {
    console.error('GET tasks error:', err);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

/* =========================
   CREATE task
========================= */
router.post('/', async (req, res) => {
  try {
    const { title, description, status = 'TODO', priority = 'medium' } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const result = await pool.query(
      `INSERT INTO tasks (title, description, status, priority, user_id)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [title, description, status, priority, req.user.sub]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('CREATE task error:', err);
    res.status(500).json({ error: 'Failed to create task' });
  }
});

/* =========================
   UPDATE task
========================= */
router.put('/:id', async (req, res) => {
  try {
    const { title, description, status, priority } = req.body;

    const result = await pool.query(
      `UPDATE tasks
       SET title = COALESCE($1, title),
           description = COALESCE($2, description),
           status = COALESCE($3, status),
           priority = COALESCE($4, priority)
       WHERE id = $5 AND user_id = $6
       RETURNING *`,
      [title, description, status, priority, req.params.id, req.user.sub]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found or not yours' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('UPDATE task error:', err);
    res.status(500).json({ error: 'Failed to update task' });
  }
});

/* =========================
   DELETE task
========================= */
router.delete('/:id', async (req, res) => {
  try {
    const result = await pool.query(
      'DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING *',
      [req.params.id, req.user.sub]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found or not yours' });
    }

    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    console.error('DELETE task error:', err);
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

module.exports = router;