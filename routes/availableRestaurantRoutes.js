const express = require('express');
const router = express.Router();
const Restaurant = require('../models/restaurant');
const Shelter = require('../models/shelter');
const Food = require('../models/food');
const { sendNotification } = require('../services/notification-service');


//All restaurants that have leftovers or near expire
router.get('/restaurants-with-near-food', async(req,res)=>{
    try{
        const restaurants = await Restaurant.find();
        const shelters = await Shelter.find();
        const restaurantsWithNearExpiredFood = [];
        // Check if the food is about to expire in 3 days and send a notification to the restaurant
        const currentDate = new Date();
        
        for (const restaurant of restaurants) {
            const foods = await Food.find({ restaurant: restaurant._id });
      
            if (foods.length > 0) {
                const expirationDate = new Date(food.expirationDate);
                const timeDifference = expirationDate.getTime() - currentDate.getTime();
                const daysUntilExpiration = Math.ceil(timeDifference / (1000 * 3600 * 24));
                if (daysUntilExpiration <= 3) {
                    // const restaurantMessage = `The food item ${food.name} is about to expire in ${daysUntilExpiration} days`;
                    // sendNotification(restaurant.name, restaurant.contactEmail, restaurantMessage);
                    
                    //send mass email to all shelters
                    
                    restaurantsWithNearExpiredFood.push({
                        name: restaurant.name,
                        location: restaurant.location,
                        foods: foods.map((food) => ({
                            name: food.name,
                            location: food.location,
                        })),
                      });
                  }
            }
        }
        res.json(restaurantsWithNearExpiredFood);
    } catch(err){
        console.error(err);
        res.json({message:'Server error'});
    }
});

module.exports = router;