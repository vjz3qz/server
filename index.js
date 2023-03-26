const express = require('express');
const mongoose = require('mongoose');
const Restaurant = require('./models/Restaurant');
const restaurantRoutes = require('./routes/restaurantRoutes');
const cors = require('cors');


const app = express();
app.use(cors());
// Connect to database
mongoose.connect('mongodb://localhost:27017/LeftoverLoveDB', { useNewUrlParser: true })
  .then(() => {
    console.log('Connected to database');
  })
  .catch((err) => {
    console.error(err);
  });

app.use(express.json());
app.use('/api/restaurants', restaurantRoutes);

app.get("/api", (req, res) => {
    res.send("hello");
});

app.listen(1234);

async function getRestaurants() {
  const restaurants = await Restaurant.find({});
  return restaurants;
}



getRestaurants()
  .then((names) => {
      names.forEach(element=>{
          console.log(element.name);
      });
  });