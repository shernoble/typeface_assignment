import {Route,Routes,Navigate} from "react-router-dom";

import React from 'react'
import { RestaurantList } from "../pages/ListRestaurants";
import {ImageSearch} from "../pages/SearchByImg";
import {LocationSearch} from "../pages/SearchByLocation";
import { NotFoundPage } from "../pages/NotFound404";
import RestaurantDetails from "../pages/RestDetails";

export function RestaurantRoutes() {
    return (
        <Routes>
            <Route path="/" element={<RestaurantList/>} />
            <Route path="restaurant/:id" element={<RestaurantDetails/>}/>
            <Route path="searchByImg" element={<ImageSearch/>}/>
            <Route path="locationSearch" element={<LocationSearch/>}/>
            <Route path="NotFound" element={<NotFoundPage/>}/>
            <Route path="*" element={<Navigate to="/NotFound" replace />} />
        </Routes>
    );
}


