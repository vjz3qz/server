const express = require('express');
const router = express.Router();
const Restaurant = require('../models/restaurant');
const Food = require('../models/food');

//All restaurants that have leftovers or near expire
router.get('/restaurants-with-food', async(req,res)=>{
    try{
        const restaurants = await Restaurant.find();
        const restaurantsWithFood = [];

        for (const restaurant of restaurants) {
            const foods = await Food.find({ restaurant: restaurant._id });
      
            if (foods.length > 0) {
              restaurantsWithFood.push({
                name: restaurant.name,
                location: restaurant.location,
                foods: foods.map((food) => ({
                    name: food.name,
                    location: food.location,
                })),
              });
            }
        }
        res.json(restaurantsWithFood);
    } catch(err){
        console.error(err);
        res.json({message:'Server error'});
    }
});

module.exports = router;