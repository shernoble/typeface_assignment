import React from 'react';
import { Link } from 'react-router-dom'; 
import "./Header.css";


export function Header() {
    

    return (
        <>
        <nav className="navbar header">
            <h2 className="heading1 pt-serif-bold-italic">DineFind<span className="material-symbols-outlined">
local_dining
</span></h2>
        </nav>
        <nav className="navbar navbar-expand-lg " style={{backgroundColor:'#921A40'}}>
            <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
            >
            <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav mx-auto">
                <li className="nav-item">
                <Link to="/" className="nav-link">Restaurants</Link>
                </li>
                <li className="nav-item">
                <Link to="/locationSearch" className="nav-link">FindRestaurants</Link>
                </li>
                <li className="nav-item">
                <Link to="/searchByImg" className="nav-link">SearchWithImage</Link>
                </li>

            </ul>
            </div>
        </nav>
        </>
    );
}

