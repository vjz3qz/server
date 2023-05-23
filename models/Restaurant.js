// restaurants schema
const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  foods: [{//make this a list of foods object...look into how to do that
    type: mongoose.Schema.Types.ObjectId,//linking food and restaurant together
    ref: 'Food'
  }]
});

const Restaurant = mongoose.model('Restaurant', restaurantSchema);

module.exports = Restaurant;
