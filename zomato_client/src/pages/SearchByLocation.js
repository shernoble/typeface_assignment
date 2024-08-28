import React, { useState } from 'react';
import axios from 'axios';
import { NavLink } from 'react-router-dom';

export function LocationSearch(){
    const [latitude, setLatitude] = useState();
    const [longitude, setLongitude] = useState();
    const [range, setRange] = useState();
    const [restaurants, setRestaurants] = useState([]);
    const [error, setError] = useState('');

    const handleSearch = async () => {
        if (!latitude || !longitude || !range) {
            setError('Please fill in all fields.');
            return;
        }

        try {
            const response = await axios.post(`http://localhost:5000/api/restaurants/location`, {latitude: latitude,longitude: longitude,range: range});
            console.log(response);
            
            setRestaurants(response.data);
            setError();
        } catch (error) {
            console.error('Error fetching restaurants:', error);
            setError('Something went wrong. Please try again.');
        }
    };

    return (
        <div className="container mt-5">
            <h1 className="mb-4">Search Restaurants by Location</h1>
            <div className="mb-3">
                <label>Latitude</label>
                <input
                    type="number"
                    className="form-control"
                    value={latitude}
                    onChange={(e) => setLatitude(e.target.value)}
                />
            </div>
            <div className="mb-3">
                <label>Longitude</label>
                <input
                    type="number"
                    className="form-control"
                    value={longitude}
                    onChange={(e) => setLongitude(e.target.value)}
                />
            </div>
            <div className="mb-3">
                <label>Range (in km)</label>
                <input
                    type="number"
                    className="form-control"
                    value={range}
                    onChange={(e) => setRange(e.target.value)}
                />
            </div>
            <button className="btn btn-outline-dark" onClick={handleSearch}>Search</button>
            {error && <p className="text-danger mt-3">{error}</p>}
            <div className="list-group mt-4">
            {restaurants.map((restaurant) => (
                    <NavLink key={restaurant._id} to={`/restaurant/${restaurant._id}`}>
                    <div key={restaurant.restaurantId} className="list-group-item">
                        <h5>{restaurant.restaurantName}</h5>
                        <p>{restaurant.address}</p>
                    </div>
                    </NavLink>
                ))}
            </div>
        </div>
    );
};

export default LocationSearch;
