const mongoose = require('mongoose');

const RestaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  foods: [
    {
      name: {
        type: String,
        required: true,
      },
      expirationDate: {
        type: Date,
        required: true,
      },
    },
  ],
});

module.exports = mongoose.model('Restaurant', RestaurantSchema);
