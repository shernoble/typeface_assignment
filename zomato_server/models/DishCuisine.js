const mongoose = require('mongoose');

const dishCuisineSchema = new mongoose.Schema({
  dish: { type: String, required: true },
  cuisine: { type: String, required: true }
});

const DishCuisine = mongoose.model('DishCuisine', dishCuisineSchema);

module.exports = DishCuisine;