import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { HelmetProvider,Helmet } from 'react-helmet-async';

export function RestaurantDetails() {
    const { id } = useParams(); 
    const [restaurant, setRestaurant] = useState(null);
    const [error, setError] = useState('');
    const navigate=useNavigate();

    useEffect(() => {
        const fetchRestaurant = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/restaurants/${id}`);
                setRestaurant(response.data);
            } catch (err) {
                console.error('Error fetching restaurant:', err);
                setError('Could not fetch the restaurant details.');
            }
        };

        fetchRestaurant();
    }, [id]);

    if (error) {
        return <p className="text-danger">{error}</p>;
    }

    if (!restaurant) {
        return <p>Loading...</p>;
    }
    return (
        <HelmetProvider>
        {
            <Helmet>
            <link rel="stylesheet" href="/css/restaurantDisplay.css" />
            <title>{restaurant.restaurantName}</title>
            </Helmet>
        }
        <div className="container p-4">
            <div className="row">
            {restaurant && (
                <>
                <div className="col-md-8">
                    <h3>{restaurant.restaurantName}</h3>
                    <p>
                    <span className="rooms">{restaurant.cuisines}, {restaurant.averageCostForTwo}</span>
                    <span className="location">{restaurant.city}</span>
                    </p>
                </div>
                <div className="col-md-4 d-flex align-items-center justify-content-end">
                    <button className="btn btn-outline-dark" onClick={() => navigate(-1)}>Go Back</button>
                </div>
                </>
            )}
            </div>
        </div>
        <div className="house-imgs">
            <section className="selected-house">
            
                <>
                <div className="image1" style={{ backgroundImage: `url(https://b.zmtcdn.com/data/pictures/6/18689586/1c5375a46c3dc0f0645393696a5cd2f8.jpg?fit=around|771.75:416.25&crop=771.75:416.25;*,*)` }}></div>
                <div className="image1" style={{ backgroundImage:  `url(https://b.zmtcdn.com/data/pictures/chains/6/18689586/0b7d08b10e323bfb9c5f7e4c7c7662e9.jpg?fit=around|300:273&crop=300:273;*,*)`}}></div>
                <div className="image" style={{ backgroundImage: `url(https://b.zmtcdn.com/data/pictures/6/18689586/e0dcb4d45d5c32f72a316cc835557c0c.jpg?fit=around%7C200%3A200&crop=200%3A200%3B%2A%2C%2A)` }}></div>
                <div className="image" style={{ backgroundImage: `url(https://b.zmtcdn.com/data/pictures/6/18689586/a2ade05eab109bc0ddc9309f8e04f165.jpg?fit=around%7C200%3A200&crop=200%3A200%3B%2A%2C%2A)` }}></div>
                <div className="image" style={{ backgroundImage: `url(https://b.zmtcdn.com/data/pictures/chains/6/18689586/0938ebee43192f7952840ab626f24325.jpg?fit=around%7C200%3A200&crop=200%3A200%3B%2A%2C%2A)` }}></div>
                </>
        
            </section>
        </div>

        
        <div className="container">
            <div className='row'>
                <div className=''>
                    <div className=" m-3 card">
                        <div className="card-body h-100" >
                            <h5 style={{ marginBottom: "0" }} className="card-title">Address</h5>
                            <p style={{ marginBottom: "0" }}>{restaurant.address}</p>
                            <p>{restaurant.locality}</p>
                            <p><strong>Rating:</strong> 
                                <span className="badge bg-success">{restaurant.aggregateRating}</span> 
                                <span className="ms-2">({restaurant.ratingText})</span>
                            </p>
                        </div>
                    </div>

                    <div className="m-3 card">
                        <div className="card-body">
                            <h5 className="card-title">Description</h5>
                            <p><strong>Votes:</strong> {restaurant.votes}</p>
                            <p><strong>Has Table Booking:</strong> {restaurant.hasTable === 'Yes' ? 'Yes' : 'No'}</p>
                            <p><strong>Online Delivery Available:</strong> {restaurant.hasOnlineDelivery === 'Yes' ? 'Yes' : 'No'}</p>
                            <p><strong>Currently Delivering:</strong> {restaurant.isDelivering === 'Yes' ? 'Yes' : 'No'}</p>
                            <p><strong>Price Range:</strong> {restaurant.priceRange}</p>
                        </div>
                    </div>

                </div>
                                
            </div>
        </div>
        </HelmetProvider>
    );
}

export default RestaurantDetails;
