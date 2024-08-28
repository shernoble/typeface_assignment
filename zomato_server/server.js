const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const restaurantsRouter = require('./routes/restaurants');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors({origin:"http://localhost:3001"}));
app.use(express.json()); // Parses incoming JSON requests

require('dotenv').config();

// Connect to MongoDB
// mongoose.connect('mongodb://localhost:27017/zomatoDB', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// })
//     .then(() => console.log('MongoDB connected'))
//     .catch((err) => console.log(err));

    const uri=process.env.MONGODB_URI;
    // console.log(uri);
    mongoose.connect(uri,{ useNewUrlParser: true });
    const connection=mongoose.connection;
    connection.once('open', () => {
        console.log("mongodb connection est successfully!");
    })

// Routes
app.use('/api/restaurants', restaurantsRouter);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

