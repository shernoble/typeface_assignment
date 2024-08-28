import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
// import "/css/guestHomepage.css";
import { Helmet,HelmetProvider } from "react-helmet-async";
import { NavLink,Link } from "react-router-dom";
import axios from "axios";

import { GuestHeader } from "../../components/guestHeader/GuestHeader";
import { GuestNav } from "../../components/guestNavbar/GuestNav";
import { Filters } from "../../components/Filters/Filters";
import { Loading } from "../../components/Loading/Loading";
// import { Footer } from "../../components/Footer/Footer";
import { Footer } from "../../components/Footer2/GFooter";


export function GuestHomepage() {
    const [isLoading, setIsLoading] = useState(true);
    const [allListings, setAllListings] = useState(useSelector(state => state.guestSearch.response));
    const [filterListings,setFilterListings]=useState([]);
    const [searchterm,setSearchterm]=useState();
    const [message,setMessage]=useState();
    // const user=useSelector(state => state.auth.user);
    // console.log("home:");
    // console.log(user);

    useEffect(() => {
        // Simulate loading for 500 milliseconds, then set isLoading to false
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1000);

        return () => clearTimeout(timer); // Cleanup on unmount
    }, []);

    useEffect(() => {
        if (allListings === null) {
        axios
        .get('http://localhost:5050/guest/homepagefull')
        .then((response) => {
            // Update the state with the fetched data
            setAllListings(response.data);
            console.log(allListings);

        })
        .catch(err => {
            console.log(err);
        });
    }
    }, [allListings]); 


// get search results
    const handleSearch=(e) => {
        e.preventDefault();
        // send search query for all listings in db
        // return results
        axios.post('http://localhost:5050/restaurant/search',{searchterm})
        .then((response) => {
            console.log("this is what we received:");
            console.log(response.data.results);
            if(response.data.success){
                setAllListings(response.data.results);
                setFilterListings([]);
                console.log("after search:");
                console.log(filterListings);
                // console.log();
            }
            else{
                setMessage('no results');
                console.log('no results');
            }
        })
        
    }
// get all results
    const handleHomepage = () => {
        axios
        .get('http://localhost:5050/guest/homepagefull')
        .then((response) => {
            // Update the state with the fetched data
            setAllListings(response.data);
            console.log("filtered res after full home:");
            console.log(filterListings);
            // console.log(allListings);

        })
        .catch(err => {
            console.log(err);
        });
    }

    const handleFilter=(e)=>{
        // filter based on curr listings
        e.preventDefault();
        setFilterListings([]);
        const propertyType = document.querySelector('input[name="choice"]:checked').value;
        console.log("value:"+propertyType);
        if (propertyType !== 'All') {
            const filteredListings = allListings.filter(element => {
                // console.log(element.PropertyType);
                
                return element.PropertyType === propertyType;
            });
            setFilterListings(filteredListings);
            if(filteredListings.length===0){
                // set message
                setMessage("No results found for property type : "+propertyType);
            }
            console.log("after adding filters:");
            console.log(filterListings);
            console.log(allListings);
        } else {
            setFilterListings([]); // If 'All' is selected, reset the filter
        }
    }


    const handleDismiss=()=>{
        setMessage(null);
    }

    const closeNav = () => {
        document.getElementById("mySidenav").style.width = "0";
        document.getElementById("main").style.marginLeft = "120px";
        document.body.style.backgroundColor = "white";
    };

    const openNav = () => {
        document.getElementById("mySidenav").style.width = "250px";
        document.getElementById("main").style.marginLeft = "250px";
        document.body.style.backgroundColor = "rgba(0,0,0,0.5)";
        document.body.style.backdropFilter = "blur(5)";
    };

    return (
        <HelmetProvider>
        {
                <Helmet>
                    <link rel="stylesheet" href="/css/guestHomepage.css" />
                    <title>HomePage-Guest</title>
                </Helmet>
            }
        <GuestHeader />
        <GuestNav />
        {isLoading ? ( // Render loading spinner while isLoading is true
            <Loading />
        ) : (
        <>
        <div id="mySidenav" className="sidenav">
            <Link className="closebtn" onClick={closeNav}>&times;</Link>
            <Filters handleFilter={handleFilter} handleHomepage={handleHomepage}/>
        </div>


        <div className="search-container">
            <form onSubmit={handleSearch}>
            <input type="text" className="searchTerm" name="searchTerm" 
            id="searchTerm" placeholder="search"
            value={searchterm}
            onChange={e => {setSearchterm(e.target.value)}}
            />
            <button type="submit"><i className="fa fa-search"></i></button>
            </form>
        </div>

            <div>
                <button className="go_back button" onClick={openNav}>More Options</button>
            </div>

            {message && (
                <div className="alert alert-danger alert-dismissible fade show mx-auto" role="alert" style={{ maxWidth: '700px' }}>
                    {message}
                    <button type="button" onClick={handleDismiss} className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
            )}
            
            {filterListings && filterListings.length > 0 ? (
            <section className="restaurants" id="main">
                {filterListings.map((element) => (
                
                    <div className="house" key={element._id}>
                        <NavLink key={element._id} to={`/restaurant/${element._id}`}>
                        <div style={{ backgroundImage: `url(${element.img_url1})`,
                        backgroundSize: 'cover',
                        }} className="house-img"></div>
                        <p className="title">{element.Title.substring(0, 30) + "..."}</p>
                        <p className="description">{element.Bedrooms} Bedroom(s), {element.Bathrooms} Bathroom(s)</p>
                        <p className="location">{element.Address.District}, {element.Address.State}</p>
                        <p className="pricep">Cost/Night: Rs.{element.CostPerN}</p>
                        </NavLink>
                    </div>
            
                ))}
            </section>
            ) : (
                <section className="houses" id="main">
                {allListings && allListings.map((element) => (
                
                    <div className="house" key={element._id}>
                        <NavLink key={element._id} to={`/guest/reserve/${element._id}`}>
                        <div style={{ backgroundImage: `url(${element.img_url1})`,
                        // maxWidth: '200px', // Adjust the value as needed
                        backgroundSize: 'cover', // or 'contain'// Ensures the image scales within the parent container

                        }} className="house-img">
                        {/* <div>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
                            </svg>
                        </div> */}
                        </div>
                        <p className="title">{element.Title.substring(0, 30) + "..."}</p>
                        <p className="description">{element.Bedrooms} Bedroom(s), {element.Bathrooms} Bathroom(s)</p>
                        <p className="location">{element.Address.District}, {element.Address.State}</p>
                        <p className="pricep">Cost/Night: Rs.{element.CostPerN}</p>
                        </NavLink>
                    </div>
            
                ))}
            </section>
            )}
            
        <Footer/>
        </>
        )}
        </HelmetProvider>
        // </div>
    );
}