const express = require('express');
const router = express.Router();
const Food = require("../models/Food");

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
router.post("/", async (req, res) => {
    const food = new Food({
      name: req.body.name,
      
    });
    try {
      const newFood = await food.save();
      res.json(newFood);
    } catch (err) {
      res.json({ message: err.message });
    }
  });

