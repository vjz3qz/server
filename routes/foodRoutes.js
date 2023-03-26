const express = require('express');
const router = express.Router();
const Food = require("../models/Food");
const Restaurant = require("../models/Restaurant");

//used to get all foods from all restaurants
router.get("/", async (req, res) => {
    try {
        const foods = await Food.find();
        res.json(foods);
    } catch (err) {
        res.json({ message: err.message });
    }
});

//returns a singular food item
router.get("/:id", getFood, (req, res) => {
    res.json(res.food);
});

//helper function to save food to res.food
async function getFood(req, res, next) {
    try {
        food = await Food.findById(req.params.id);
        if (food == null) {
            return res.json({ message: "Cannot find food"});
        } else {
            res.food = food;
            next();
        }
    } catch (err) {
        return res.json({ message: err.message });
    }
}

//creating a new food item
router.post('/', async (req, res) => {
    try {
      const restaurantId = req.body.restaurant;
      console.log(req.body);
      const restaurant = await Restaurant.findById(restaurantId);
      if (restaurant === null) {
        return res.json({ message: 'Restaurant not found' });
      }
  
      // Create a new food item document
      const food = new Food({
        name: req.body.name,
        unit: req.body.unit,
        quantity: req.body.quantity,
        expirationDate: req.body.expirationDate,
        restaurant: restaurantId
      });
  
      // Save the new food item to the database
      const savedFood = await food.save();
  
      // Add the ID of the new food item to the restaurant's food list
      restaurant.foods.push(savedFood._id);
  
      // Save the updated restaurant document to the database
      const savedRestaurant = await restaurant.save();
  
      // Return the newly created food item and the updated restaurant
      console.log({ food: savedFood, restaurant: savedRestaurant });
      res.json({ food: savedFood, restaurant: savedRestaurant });
    } catch (error) {
      console.error(error);
      res.status(400).json({ message: 'Server error' });
    }
  });


// Update a food item
router.patch('/:id', getFoodById, async (req, res) => {
    if (req.body.name != null) {
      res.food.name = req.body.name;
    }
    if (req.body.unit != null) {
      res.food.unit = req.body.unit;
    }
    if (req.body.quantity != null) {
      res.food.quantity = req.body.quantity;
    }
    if (req.body.expirationDate != null) {
      res.food.expirationDate = req.body.expirationDate;
    }
    if (req.body.restaurant != null) {
      res.food.restaurant = req.body.restaurant;
    }
  
    try {
      const updatedFood = await res.food.save();
      res.json(updatedFood);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });
  
  // Delete a food item
  router.delete('/:id', getFoodById, async (req, res) => {
    try {
      await res.food.remove();
      res.json({ message: 'Food item deleted' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  
  // Middleware function to get a specific food item by ID
  async function getFoodById(req, res, next) {
    let food;
    try {
      food = await Food.findById(req.params.id).populate('restaurant', 'name');
      if (food == null) {
        return res.status(404).json({ message: 'Cannot find food item' });
      }
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  
    res.food = food;
    next();
  }

  module.exports = router;