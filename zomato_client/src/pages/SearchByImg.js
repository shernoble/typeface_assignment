import React, { useState } from 'react';
import axios from 'axios';
import { NavLink } from 'react-router-dom';

export function ImageSearch(){
    const [selectedFile, setSelectedFile] = useState(null);
    const [restaurants, setRestaurants] = useState([]);
    const [error, setError] = useState('');
    const [message,setMessage]=useState('');

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleSearch = async () => {
        if (!selectedFile) {
            setError('Please upload an image first.');
            return;
        }

        const formData = new FormData();
        formData.append('image', selectedFile);

        try {
            const response = await axios.post('http://localhost:5000/api/restaurants/image-recognition', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            // console.log(response.data);
            
            // const recognizedFood = response.data.recognizedFood;

            // // Fetch restaurants offering the recognized cuisine
            // const restaurantResponse = await axios.get(`http://localhost:5000/api/restaurants?cuisine=${recognizedFood}`);
            setRestaurants(response.data.restaurants);
            setMessage(response.data.cuisine);
        } catch (error) {
            console.error('Error:', error);
            setError('Something went wrong. Please try again.');
        }
    };

    return (
        <div className="container mt-5">
            <h1 className="mb-4">Search Restaurants by Food Image</h1>
            <div className="mb-3">
                <input type="file" className="form-control" onChange={handleFileChange} />
            </div>
            <button className="btn btn-outline-dark" onClick={handleSearch}>Search</button>
            {message && <p className='mt-3'>Restaurants serving {message}</p>}
            {error && <p className="text-danger mt-3">{error}</p>}
            <div className="list-group mt-4">
                {restaurants.map((restaurant) => (
                        <NavLink key={restaurant._id} to={`/restaurant/${restaurant._id}`}>
                        <div key={restaurant.restaurantId} className="list-group-item">
                            <h5>{restaurant.RestaurantName}</h5>
                            <p>{restaurant.address}</p>
                        </div>
                        </NavLink>
                    ))}
            </div>
        </div>
    );
};

export default ImageSearch;
