const express = require('express');
const router = express.Router();
const Restaurant = require('../models/restaurant');

// Get all restaurants
router.get('/', async (req, res) => {
  try {
    const restaurants = await Restaurant.find();
    res.json(restaurants);
  } catch (err) {
    res.json({ message: err.message });
  }
});

// Get a single restaurant
router.get('/:id', getRestaurant, (req, res) => {
  res.json(res.restaurant);
});

// Create a restaurant
router.post('/', async (req, res) => {
  const restaurant = new Restaurant({
    name: req.body.name,
    location: req.body.location,
    email: req.body.email
  });
  try {
    const newRestaurant = await restaurant.save();
    res.json(newRestaurant);
  } catch (err) {
    res.json({ message: err.message });
  }
});

module.exports = router;
