import React, { useState } from 'react';

export function Filters({ handleFilter, handleHomepage, cuisines, countries }) {
    const [selectedCuisine, setSelectedCuisine] = useState('All');
    const [selectedCountry, setSelectedCountry] = useState('All');
    const [avgCost, setAvgCost] = useState(1000); // Default value for average cost

    const handleCuisineChange = (e) => {
        setSelectedCuisine(e.target.value);
    };

    const handleCountryChange = (e) => {
        setSelectedCountry(e.target.value);
    };

    const handleCostChange = (e) => {
        setAvgCost(e.target.value);
    };

    const onSubmit = (e) => {
        e.preventDefault();
        handleFilter({ cuisine: selectedCuisine, country: selectedCountry, avgCost });
    };

    return (
        <div className="container">
            <form onSubmit={onSubmit}>
                <h5>Filters</h5>

                <label>Cuisine</label>
                <select className="form-select mb-3" value={selectedCuisine} onChange={handleCuisineChange}>
                    <option value="All">All Cuisines</option>
                    {cuisines.map((cuisine, index) => (
                        <option key={index} value={cuisine}>{cuisine}</option>
                    ))}
                </select>

                <label>Country</label>
                <select className="form-select mb-3" value={selectedCountry} onChange={handleCountryChange}>
                    <option value="All">All Countries</option>
                    {countries.map((country, index) => (
                        <option key={index} value={country}>{country}</option>
                    ))}
                </select>

                <label>Average Cost for Two People</label>
                <input 
                    type="range" 
                    className="form-range mb-3" 
                    min="500" 
                    max="5000" 
                    step="100" 
                    value={avgCost} 
                    onChange={handleCostChange} 
                />
                <p>Selected Cost: {avgCost} </p>

                <button className="btn btn-outline-dark fil_btn" type="submit">
                    Apply Filters
                </button>
            </form>

            <button className="btn btn-outline-success" onClick={handleHomepage}>
                View All
            </button>
        </div>
    );
}
