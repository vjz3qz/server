const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FoodSchema = new Schema({
  name: { type: String, required: true },
  expirationDate: { type: Date, required: true },
  restaurant: { type: Schema.Types.ObjectId, ref: 'Restaurant' },
});

module.exports = mongoose.model('Food', FoodSchema);
