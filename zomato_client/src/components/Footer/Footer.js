import React from 'react';
import './footer.css'; // Import your CSS file
import { Link } from 'react-router-dom';

export function Footer(){
    return (
        <footer className="footer">
        <div className="footer-content">
            <p>&copy; 2024 DineFind</p>
            <ul className="footer-links">
            <li><Link to="#">Privacy Policy</Link></li>
            <li><Link to="#">Terms of Service</Link></li>
            <li><Link to="#">Contact Us</Link></li>
            </ul>
        </div>
        </footer>
    );
};

