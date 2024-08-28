import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { NavLink,Link } from "react-router-dom";
// import { Footer } from '../components/Footer/Footer';
import { Filters } from '../components/Filter/Filter';
import { Helmet,HelmetProvider } from 'react-helmet-async';

export function RestaurantList(){
    const [restaurants, setRestaurants] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(10);
    const [message,setMessage] = useState(null);
    const [searchTerm,setSearchTerm] =useState('');

    const cuisines = [
        "Italian", "Mexican", "Chinese", "Japanese", "Thai", "Korean",
        "French", "Spanish", "Indian", "American", "Arabian", "Cafe","Filipino",
        "Pizza","Bakery","Mediterranean","Seafood","Brazilian",
        "Desserts","Ice Cream", "Other International"
    ];
    

    const countries=["India", "Pakistan","Singapore"];

    useEffect(() => {
        fetchRestaurants(page);
    }, [page]);

    const fetchRestaurants = async (page) => {
        try {
            const response = await axios.get(`http://localhost:5000/api/restaurants?page=${page}`);
            setRestaurants(response.data.restaurants);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error('Error fetching restaurants:', error);
        }
    };

    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            setPage(newPage);
        }
    };

    const handleSearch=(e) => {
        e.preventDefault();
        // send search query for all listings in db
        // return results
        axios.post('http://localhost:5000/api/restaurants/search',{searchTerm})
        .then((response) => {
            console.log("this is what we received:");
            console.log(response.data.results);
            if(response.data.success){
                setRestaurants(response.data.results);

            }
            else{
                setMessage('no results');
                console.log('no results');
            }
        })
        
    }
// // get all results
//     const handleHomepage = () => {
//         axios
//         .get('http://localhost:5050/guest/homepagefull')
//         .then((response) => {
//             // Update the state with the fetched data
//             setAllListings(response.data);
//             console.log("filtered res after full home:");
//             console.log(filterListings);
//             // console.log(allListings);

//         })
//         .catch(err => {
//             console.log(err);
//         });
//     }

    const handleFilter=() => {

    }

    const handleHomepage=() => {

    }

    // const handleFilter=(e)=>{
    //     // filter based on curr listings
    //     e.preventDefault();
    //     setFilterListings([]);
    //     const propertyType = document.querySelector('input[name="choice"]:checked').value;
    //     console.log("value:"+propertyType);
    //     if (propertyType !== 'All') {
    //         const filteredListings = allListings.filter(element => {
    //             // console.log(element.PropertyType);
                
    //             return element.PropertyType === propertyType;
    //         });
    //         setFilterListings(filteredListings);
    //         if(filteredListings.length===0){
    //             // set message
    //             setMessage("No results found for property type : "+propertyType);
    //         }
    //         console.log("after adding filters:");
    //         console.log(filterListings);
    //         console.log(allListings);
    //     } else {
    //         setFilterListings([]); // If 'All' is selected, reset the filter
    //     }
    // }


    const handleDismiss=()=>{
        setMessage(null);
    }

    const closeNav = () => {
        document.getElementById("mySidenav").style.width = "0";
        // document.getElementById("main").style.marginLeft = "120px";
        document.body.style.backgroundColor = "white";
    };

    const openNav = () => {
        document.getElementById("mySidenav").style.width = "250px";
        // document.getElementById("main").style.marginLeft = "250px";
        document.body.style.backgroundColor = "rgba(0,0,0,0.5)";
        document.body.style.backdropFilter = "blur(5)";
    };
    const getPageNumbers = () => {
        const pageNumbers = [];
        if (totalPages <= 3) {
            // If total pages are 3 or fewer, display all
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(i);
            }
        } else {
            // Show page - 1, page, and page + 1
            if (page > 1) pageNumbers.push(page - 1);
            pageNumbers.push(page);
            if (page < totalPages) pageNumbers.push(page + 1);
        }
        return pageNumbers;
    };

    return (
        <HelmetProvider>
        {
                <Helmet>
                    <link rel="stylesheet" href="/css/styles.css" />
                </Helmet>
            }
        <div id="mySidenav" className="sidenav">
            <Link className="closebtn" onClick={closeNav}>&times;</Link>
            <Filters 
                handleFilter={handleFilter} 
                handleHomepage={handleHomepage}
                cuisines={cuisines} 
                countries={countries} 
            />
        </div>
        <div className="search-container">
            <form onSubmit={handleSearch}>
            <input type="text" className="searchTerm" name="searchTerm" 
            id="searchTerm" placeholder="search"
            value={searchTerm}
            onChange={e => {setSearchTerm(e.target.value)}}
            />
            <button type="submit"><span className="material-symbols-outlined">
            search
            </span></button>
            </form>
        </div>

            <div>
                <button className="go_back button" onClick={openNav}>Filters</button>
            </div>

            {message && (
                <div className="alert alert-danger alert-dismissible fade show mx-auto" role="alert" style={{ maxWidth: '700px' }}>
                    {message}
                    <button type="button" onClick={handleDismiss} className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
            )}
        <div className="container mt-5">

            <h1 className="mb-4">Restaurant List</h1>
    
            <div className="list-group">
                
                {restaurants.map((restaurant) => (
                    <NavLink key={restaurant._id} to={`/restaurant/${restaurant._id}`}>
                    <div key={restaurant.restaurantId} className="list-group-item">
                        <h5>{restaurant.restaurantName}</h5>
                        <p>{restaurant.address}</p>
                    </div>
                    </NavLink>
                ))}
                
            </div>

            <nav aria-label="Page navigation" className="mt-4">
                <ul className="pagination justify-content-center">
                    <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
                        <button className="page-link" onClick={() => handlePageChange(page - 1)} aria-label="Previous">
                            <span aria-hidden="true">&laquo;</span>
                        </button>
                    </li>
                    {getPageNumbers().map((pageNumber) => (
                        <li key={pageNumber} className={`page-item ${page === pageNumber ? 'active' : ''}`}>
                            <button className="page-link" onClick={() => handlePageChange(pageNumber)}>
                                {pageNumber}
                            </button>
                        </li>
                    ))}
                    <li className={`page-item ${page === totalPages ? 'disabled' : ''}`}>
                        <button className="page-link" onClick={() => handlePageChange(page + 1)} aria-label="Next">
                            <span aria-hidden="true">&raquo;</span>
                        </button>
                    </li>
                </ul>
            </nav>
        </div>
        
        
        </HelmetProvider>

    );
};

