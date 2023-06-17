const express = require('express');
const router = express.Router();
const Restaurant = require('../models/Restaurant');
require('dotenv').config();
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
            $lte: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)//check if within 3 days then we add the entire restaurants. 
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
    const restaurantsWithCoords = await convertAddressToCoords(restaurants);// this will return a list of longitutde and latitude
    res.json(restaurantsWithCoords);
  } catch (err) {
    res.json({ message: err.message });
  }
});

// TODO create a function: convertAddressToCoords and geocode address
const axios = require('axios');
const convertAddressToCoords = async (restaurants) => {
  try {
    const apiKey = process.env.API_KEY; // Replace with your own API key

    const convertedRestaurants = await Promise.all(restaurants.map(async (restaurant) => {
      const geocodingEndpoint = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(restaurant.address)}&key=${apiKey}`;

      const response = await axios.get(geocodingEndpoint);

      if (response.data.status === 'OK' && response.data.results.length > 0) {
        const { lat, lng } = response.data.results[0].geometry.location;
        return [lat, lng];
      } else {
        throw new Error('Failed to convert address to coordinates');
      }
    }));

    return convertedRestaurants;
  } catch (err) {
    throw new Error('Failed to convert addresses to coordinates');
  }
};

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
