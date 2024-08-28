const mongoose = require('mongoose');

const RestaurantSchema = new mongoose.Schema({
    restaurantId: { type: String, required: true, unique: true },
    restaurantName: { type: String, required: true },
    countryCode: { type: Number, required: true },
    city: { type: String, required: true },
    address: { type: String, required: true },
    locality: { type: String, required: true },
    localityVerbose: { type: String, required: true },
    longitude: { type: Number, required: true },
    latitude: { type: Number, required: true },
    cuisines: { type: String, required: true },
    averageCostForTwo: { type: Number, required: true },
    currency: { type: String, required: true },
    hasTable: { type: String, required: true },  
    hasOnlineDelivery: { type: String, required: true },  
    isDelivering: { type: String, required: true },  
    switchToOrderMenu: { type: String, required: true },  
    priceRange: { type: Number, required: true },
    aggregateRating: { type: Number, required: true },
    ratingColor: { type: String, required: true },
    ratingText: { type: String, required: true },
    votes: { type: Number, required: true },
});

RestaurantSchema.index({restaurantName:'text',locality:'text',localityVerbose:'text'});

module.exports = mongoose.model('Restaurant', RestaurantSchema);
