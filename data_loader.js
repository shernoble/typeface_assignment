// https://github.com/e42-typeface-ai/iiits-shernoble
// script to load data

const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const csv = require('csv-parser');

const app = express();
const PORT = 5000;

require('dotenv').config();

// Connect to MongoDB
const uri=process.env.MONGODB_URI;
    // console.log(uri);
    mongoose.connect(uri,{ useNewUrlParser: true });
    const connection=mongoose.connection;
    connection.once('open', () => {
        console.log("mongodb connection est successfully!");
    })

// Define the updated Restaurant model
const Restaurant = require('./zomato_server/models/Restaurant');

// Function to load Zomato data from CSV into MongoDB
const loadZomatoData = async () => {
    try {
        const restaurants = [];

        // Read the CSV file
        fs.createReadStream('zomato.csv') 
            .pipe(csv())
            .on('data', (row) => {
                restaurants.push({
                    restaurantId: row['restaurantId'],
                    restaurantName: row['restaurantName'],
                    countryCode: parseInt(row['countryCode'], 10),
                    city: row['city'],
                    address: row['address'],
                    locality: row['locality'],
                    localityVerbose: row['localityVerbose'],
                    longitude: parseFloat(row['longitude']),
                    latitude: parseFloat(row['latitude']),
                    cuisines: row['cuisines'],
                    averageCostForTwo: parseInt(row['averageCostForTwo'], 10),
                    currency: row['currency'],
                    hasTable: row['hasTable'],
                    hasOnlineDelivery: row['hasOnlineDelivery'],
                    isDelivering: row['isDelivering'],
                    switchToOrderMenu: row['switchToOrderMenu'],
                    priceRange: parseInt(row['priceRange'], 10),
                    aggregateRating: parseFloat(row['aggregateRating']),
                    ratingColor: row['ratingColor'],
                    ratingText: row['ratingText'],
                    votes: parseInt(row['votes'], 10),
                });
            })
            .on('end', async () => {
                console.log('CSV file successfully processed');

                // Clear existing data
                await Restaurant.deleteMany({});

                // Insert new data
                await Restaurant.insertMany(restaurants);
                console.log('Zomato data loaded successfully!');
            });
    } catch (error) {
        console.error('Error loading Zomato data:', error);
    }
};

// Load data when the server starts
loadZomatoData();

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
