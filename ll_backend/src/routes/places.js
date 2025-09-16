const express = require('express');
const router = express.Router();
const pool = require('../../config/db');
const authMiddleware = require('../middleware/authMiddleware');

// Get all places
router.get('/', authMiddleware, async (req, res) => {
  try {
    const allPlaces = await pool.query('SELECT * FROM places');
    res.json(allPlaces.rows);
  } catch (err) {
    console.error(err.message);
  }
});

module.exports = router;