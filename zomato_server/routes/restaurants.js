// backend/routes/restaurants.js
const express = require('express');
const axios = require('axios');
const path = require('path');
const fs = require('fs');
const FormData = require('form-data');
const multer=require('multer');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const Restaurant = require('../models/Restaurant');
const DishCuisine=require("../models/DishCuisine");

const router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Destination folder for the uploaded files
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname)); // Preserving original extension
    }
});

const upload = multer({ 
    storage: storage,
    fileFilter: function (req, file, cb) {
        // Allow only JPG and JPEG file types
        const filetypes = /jpeg|jpg/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);
        
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb('Error: Only .jpg or .jpeg images allowed!');
        }
    }
});// Temporary storage for uploaded files



// router.get('')

// GET List of Restaurants with Pagination
router.get('/', async (req, res) => {
    try {
        // console.log("search item:"+req.query.search);

        
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 15;
        const search=req.query.search || "";
        const skip = (page - 1) * limit;

        const restaurants = await Restaurant.find({restaurantName:{$regex:search, $options:"i"}})
            .skip(skip)
            .limit(limit);

        const total = await Restaurant.countDocuments();

        res.json({
            total,
            page,
            pageSize: limit,
            totalPages: Math.ceil(total / limit),
            restaurants,
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/search',async(req,res) => {
    try{
        const item=req.body.searchTerm;
        console.log("term:"+item);
        // res.render("guest-login");
        Restaurant.find({$text:{$search:item}})
            .then(function(results){
                if(results.length!=0)
                return res.json({success:true,results:results});
                else return res.json({success:false,message:'no results'});
            })
            .catch(function(error){
                console.log(error);
                return res.json({success:false,message:error.message || "error occured"});
            })
    }
    catch(err){
        console.log(err);
        return res.json({success:false,message:err.message || "error occured"});
    }
})



// router.post('/searchLocation', async (req, res) => {
//     try {
//         const { latitude, longitude, radius } = req.query;
//         const earthRadius = 6371; // Radius of Earth in km

//         const restaurants = await Restaurant.find({
//             latitude: {
//                 $gte: latitude - radius / earthRadius,
//                 $lte: latitude + radius / earthRadius
//             },
//             longitude: {
//                 $gte: longitude - radius / (earthRadius * Math.cos(latitude * Math.PI / 180)),
//                 $lte: longitude + radius / (earthRadius * Math.cos(latitude * Math.PI / 180))
//             }
//         });

//         res.json(restaurants);
//     } catch (error) {
//         res.status(500).send(error.message);
//     }
// });

async function classifyAndStoreDishes(dishes, cuisines) {
    try {
      // Classify dishes
        const classifiedDishes = dishes.map(dish => {
            const randomCuisine = cuisines[Math.floor(Math.random() * cuisines.length)];
            return { dish, cuisine: randomCuisine };
        });
    
        // Store in MongoDB
        await DishCuisine.insertMany(classifiedDishes);
        console.log('Dishes classified and stored successfully');
        } catch (error) {
        console.error('Error storing dishes:', error);
        }
    }


//used to randomize the dishes into cuisines
router.get('/dishes', async (req, res) => {
    const apiUrl = 'https://api.logmeal.com/v2/dataset/dishes/v1.0?language=eng';
    const apiUserToken = process.env.LOGMEAL_KEY;

    try {
        const response = await axios.get(apiUrl, {
            headers: {
                'Authorization': `Bearer ${apiUserToken}`
            }
        });

        // Extract just the 'name' field from each object in the response
        // const dishNames = response.data.map(dish => dish.name);
        const comboNames = response.data.combo.map(dish => dish.name);
        const drinkNames = response.data.drinks.map(drink => drink.name);
        const foodNames = response.data.food.map(food => food.name);
        const sauceNames = response.data.sauces.map(sauce => sauce.name);
        const ingredientNames = response.data.ingredients.map(food => food.name);


        // Combining all names into one array
        const dishes = [...comboNames, ...drinkNames, ...foodNames, ...sauceNames, ...ingredientNames];
        // map these dishes to cuisines
        // console.log(allDishNames.length);

        const cuisines = [
            "Italian", "Mexican", "Chinese", "Japanese", "Thai", "Korean",
            "French", "Spanish", "Indian", "American", "Arabian", "Cafe","Filipino",
            "Pizza","Bakery","Mediterranean","Seafood","Brazilian",
            "Desserts","Ice Cream", "Other International"
        ];
        // console.log(allDishNames);
        classifyAndStoreDishes(dishes, cuisines);
        res.json("passed dw");
        // Send the array of names as the response
        // res.json(response);
    } catch (error) {
        console.error('Error fetching dishes:', error.message);
        res.status(500).json({ error: 'Failed to fetch dishes' });
    }
});

router.post('/location', async (req, res) => {
    try {
        console.log("helo");
        
        const latitude = parseFloat(req.body.latitude);
        const longitude = parseFloat(req.body.longitude);
        const radius = parseFloat(req.body.range);
        console.log(latitude+" "+longitude);
        
        const earthRadius = 6371; // Radius of Earth in km

         // Convert degrees to radians
        const latInRad = latitude * (Math.PI / 180);

        // Latitude range
        const latRange = radius / earthRadius * (180 / Math.PI);
        const minLatitude = latitude - latRange;
        const maxLatitude = latitude + latRange;

        // Longitude range (accounting for the latitude)
        const longRange = radius / (earthRadius * Math.cos(latInRad)) * (180 / Math.PI);
        const minLongitude = longitude - longRange;
        const maxLongitude = longitude + longRange;
        console.log(minLatitude+" "+maxLatitude);
        console.log(minLongitude+" "+maxLongitude);
        


        const restaurants = await Restaurant.find({
            latitude: {
                $gt: minLatitude,
                $lt: maxLatitude
            },
            longitude: {
                $gt: minLongitude,
                $lt: maxLongitude
            }
        });
        console.log(restaurants.length);
        
        res.json(restaurants);
    } catch (error) {
        console.log(error);
        
        res.status(500).send(error.message);
    }
});

router.post('/image-recognition', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded or wrong file type!' });
    }

    const imgPath = req.file.path; ; 
    const apiUserToken = process.env.LOGMEAL_KEY;

    const formData = new FormData();
    formData.append('image', fs.createReadStream(imgPath));

    const headers = {
        'Authorization': `Bearer ${apiUserToken}`,
        ...formData.getHeaders() 
    };

    const apiUrl = 'https://api.logmeal.es/v2/image/recognition/complete';

    axios.post(apiUrl, formData, { headers })
        .then(response => {
            const prediction = response.data.recognition_results[0].name;
            console.log(prediction);
            
            // res.send("issok");
            DishCuisine.findOne({ dish: prediction })
                .then(result => {
                    if (!result) {
                        return res.status(404).json({ error: 'Cuisine not found for the predicted dish.' });
                    }

                    Restaurant.find({
                        cuisines: { $regex: result.cuisine, $options: 'i' } 
                    })
                    .then(restaurants => {
                        res.json({dish:prediction, cuisine: result.cuisine, restaurants });
                    })
                    .catch(error => {
                        return res.status(500).send({ message: error.message || "Error occurred while finding restaurants." });
                    });

                })
                .catch(error => {
                    return res.status(500).send({ message: error.message || "Error occurred while finding cuisine." });
                });

            fs.unlink(imgPath, err => {
                if (err) console.error('Error deleting file:', err.message);
            });
        })
        .catch(error => {
            console.error('Error:', error.message);
            res.status(500).json({ error: 'Image recognition failed' });
        });
});

// // POST route for image recognition
// router.post('/image-recognition', upload.single('image'), (req, res) => {
//     // const imgPath = req.file.path; // Path to the uploaded image
//     const imgPath="uploads/techno.jpeg";
//     const apiUserToken = process.env.LOGMEAL_KEY;
//     const formData = new FormData();
//     formData.append('image', fs.createReadStream(imgPath));
//     const headers = {
//         'Authorization': `Bearer ${apiUserToken}`,
//         ...formData.getHeaders() 
//     };
//     console.log("we good");
    
//     const apiUrl = 'https://api.logmeal.es/v2/image/recognition/complete';

    
//     console.log('FormData:', formData);
//     console.log('Headers:', headers);
//     // res.send("issok");

//     axios.post(apiUrl, formData, { headers:headers })
//     .then(response => {
//         console.log('API Response:', response.data);
//         res.json(response.data); // Send the API response back to the client

//         // Optionally, delete the uploaded file after processing
//         // fs.unlink(imgPath, err => {
//         //     if (err) console.error('Error deleting file:', err.message);
//         // });
//     })
//     .catch(error => {
//         console.error('Error:', error.message);
//         res.status(500).json({ error: 'Image recognition failed' });
//     });
// } );
    // axios.post(apiUrl, formData, { headers: { ...headers, ...formData.getHeaders() } })
        // .then(response => {
        //     // const foodTypes = response.data.food_types;
        //     // let maxProb = 0;
        //     console.log(response.data);
        //     res.json("passed yrrrr");
            
        //     // let maxName = '';

        //     // foodTypes.forEach(food => {
        //     //     if (food.probs > maxProb) {
        //     //         maxProb = food.probs;
        //     //         maxName = food.name;
        //     //     }
        //     // });

        //     // // Send the result back to the client
        //     // res.json({ recognizedFood: maxName });

        //     // // Optionally, delete the uploaded file after processing
        //     // fs.unlink(imgPath, err => {
        //     //     if (err) console.error('Error deleting file:', err.message);
        //     // });
        // })
//         .catch(error => {
//             console.error('Error:', error.message);
//             res.status(500).json({ error: 'Image recognition failed' });
//         });
// });
// GET Restaurant by ID
router.get('/:id', async (req, res) => {
    try {
        const restaurant = await Restaurant.findById(req.params.id);
        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }
        res.json(restaurant);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
