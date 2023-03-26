const mongoose = require('mongoose');
const moment = require('moment');
const Restaurant = require('./models/Restaurant.js');
const cron = require('node-cron');

mongoose.connect('mongodb://localhost:27017/leftoverlove', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define a function to check for approaching expiration dates and notify the restaurant
const checkExpirationDates = async () => {
  try {
    const restaurants = await Restaurant.find().lean();
    const currentDate = moment().startOf('day');

    restaurants.forEach((restaurant) => {
      const expiredFoods = [];

      restaurant.foods.forEach((food) => {
        const expirationDate = moment(food.expirationDate).startOf('day');
        const daysUntilExpiration = expirationDate.diff(currentDate, 'days');

        if (daysUntilExpiration <= 3) {
          expiredFoods.push({
            name: food.name,
            expirationDate: food.expirationDate,
            daysUntilExpiration,
          });
        }
      });

      if (expiredFoods.length > 0) {
        console.log(
          `Sending notification to restaurant ${restaurant.name} about the following expired foods:`
        );
        console.log(expiredFoods);
        // Here, you could send a notification to the restaurant using a third-party service like Twilio or SendGrid
      }
    });
  } catch (error) {
    console.error(error);
  }
};

// Run the function every day at midnight
cron.schedule('0 0 * * *', () => {
  checkExpirationDates();
});