const express = require('express');
const router = express.Router();
const Restaurant = require('../models/Restaurant');

router.get('/', async (req, res) => {
  try {
    const restaurants = await Restaurant.find();
    res.json(restaurants);
  } catch (err) {
    res.json({ message: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (restaurant == null) {
      return res.json({ message: 'Cannot find restaurant' });
    }
    res.json(restaurant);
  } catch (err) {
    res.json({ message: err.message });
  }
});

router.get('/expiring-food', async (req, res) => {
  try {
    const restaurants = await Restaurant.aggregate([
      {
        $lookup: {
          from: 'foods',
          localField: 'foods',
          foreignField: '_id',
          as: 'foodObjects'
        }
      },
      {
        $unwind: '$foodObjects'
      },
      {
        $match: {
          'foodObjects.expirationDate': {
            $lte: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
          }
        }
      },
      {
        $group: {
          _id: '$_id',
          name: { $first: '$name' },
          location: { $first: '$location' },
          email: { $first: '$email' },
          foods: { $push: '$foodObjects' }
        }
      }
    ]);
    res.json(restaurants);
  } catch (err) {
    res.json({ message: err.message });
  }
});

router.post('/', async (req, res) => {
  const restaurant = new Restaurant({
    name: req.body.name,
    location: req.body.location,
    email: req.body.email
  });
  try {
    const newRestaurant = await restaurant.save();
    res.status(201).json(newRestaurant);
  } catch (err) {
    res.json({ message: err.message });
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (restaurant == null) {
      return res.json({ message: 'Cannot find restaurant' });
    }
    if (req.body.name != null) {
      restaurant.name = req.body.name;
    }
    if (req.body.location != null) {
      restaurant.location = req.body.location;
    }
    if (req.body.email != null) {
      restaurant.email = req.body.email;
    }
    const updatedRestaurant = await restaurant.save();
    res.json(updatedRestaurant);
  } catch (err) {
    res.json({ message: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (restaurant == null) {
      return res.json({ message: 'Cannot find restaurant' });
    }
    await restaurant.remove();
    res.json({ message: 'Deleted Restaurant' });
  } catch (err) {
    res.json({ message: err.message });
  }
});

module.exports = router;
