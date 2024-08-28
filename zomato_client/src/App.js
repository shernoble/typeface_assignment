import {Route,Routes} from "react-router";
import { RestaurantRoutes } from "./routes/restaurantRoutes";



function App() {
  return (
    <>
      <Routes>
        <Route path="/*" element={<RestaurantRoutes/>}/>
      </Routes>
    </>
  );
}

export default App;
