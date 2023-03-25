const express = require('express');
const router = express.Router();
const Restaurant = require('../models/Restaurant');

router.get("/", async (req, res) => {
  try {
    const restaurants = await Restaurant.find();
    res.json(restaurants);
  } catch (err) {
    res.json({ message: err.message });
  }
});

router.get('/:id', getRestaurant, (req, res) => {
  res.json(res.restaurant);
});

async function getRestaurant(req, res, next) {
    try {
      restaurant = await Restaurant.findById(req.params.id);
      if (restaurant == null) {
        return res.json({ message: 'Cannot find restaurant' });
      }
    } catch (err) {
      return res.json({ message: err.message });
    }
  
    res.restaurant = restaurant;
    next();
  }

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

router.patch('/:id', getRestaurant, async (req, res) => {
    if (req.body.name != null) {
      res.restaurant.name = req.body.name;
    }
    if (req.body.location != null) {
      res.restaurant.location = req.body.location;
    }
    if (req.body.email != null) {
      res.restaurant.email = req.body.email;
    }
    try {
      const updatedRestaurant = await res.restaurant.save();
      res.json(updatedRestaurant);
    } catch (err) {
      res.json({ message: err.message });
    }
  });
  
  router.delete('/:id', getRestaurant, async (req, res) => {
    try {
      await res.restaurant.remove();
      res.json({ message: 'Deleted Restaurant' });
    } catch (err) {
      res.json({ message: err.message });
    }
  });

module.exports = router;
