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

// Add a new place
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, address_line1, latitude, longitude } = req.body;
    const newPlace = await pool.query(
      'INSERT INTO places (name, address_line1, latitude, longitude) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, address_line1, latitude, longitude]
    );
    res.json(newPlace.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

module.exports = router;