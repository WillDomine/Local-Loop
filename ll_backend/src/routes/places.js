const express = require('express');
const router = express.Router();
const pool = require('../../config/db');
const authMiddleware = require('../middleware/authMiddleware');
const NodeGeocoder = require('node-geocoder');


const options = {
  provider: 'openstreetmap'
};

async function convertAddressToLatLng(address) {
  const geocoder = NodeGeocoder(options);
  return geocoder.geocode(address);
}

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
router.post('/add', authMiddleware, async (req, res) => {
  try {
    const { name, address_line1, city, state} = req.body;
    if (!name || !address_line1 || !city || !state) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    const geocodeResult = await convertAddressToLatLng(address_line1 + ', ' + city + ', ' + state);
    const newPlace = await pool.query(
      'INSERT INTO places (name, address_line1, city, state, latitude, longitude) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [name, address_line1, city, state, geocodeResult[0].latitude, geocodeResult[0].longitude]
    );
    res.json(newPlace.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

router.get('/geocode', async (req, res) => {
  try {
    const { address } = req.query;
    if (!address) {
      return res.status(400).json({ error: 'Address query parameter is required' });
    }
    const geocodeResult = await convertAddressToLatLng(address);
    if (geocodeResult.length === 0) {
      return res.status(404).json({ error: 'Address not found' });
    }
    res.json(geocodeResult[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;