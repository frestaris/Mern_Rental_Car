import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import Navbar from "./components/Navbar";
import Vehicles from "./pages/Vehicles";
import About from "./pages/About";
import Contact from "./pages/Contact";
import SignIn from "./components/SignIn";
import Footer from "./components/Footer";
import SignUp from "./components/SignUp";
import { PrivateRouteAdmin, PrivateRouteUser } from "./components/PrivateRoute";
import Bookings from "./pages/Bookings";
import DashboardLayout from "./pages/Dashboard/DashboardLayout";
import ManageBookings from "./pages/Dashboard/ManageBookings";
import ManageVehicles from "./pages/Dashboard/ManageVehicles";
import AddVehicle from "./pages/Dashboard/AddVehicle";
import ManageUsers from "./pages/Dashboard/ManageUsers";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/vehicles" element={<Vehicles />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />

        {/* ADMIN DASHBOARD ROUTE*/}
        <Route
          path="/dashboard"
          element={
            <PrivateRouteAdmin>
              <DashboardLayout />
            </PrivateRouteAdmin>
          }
        >
          <Route path="manage-vehicles" element={<ManageVehicles />} />
          <Route path="bookings" element={<ManageBookings />} />
          <Route path="add-vehicle" element={<AddVehicle />} />
          <Route path="users" element={<ManageUsers />} />
        </Route>

        {/* USER ROUTE*/}
        <Route
          path="/bookings"
          element={
            <PrivateRouteUser>
              <Bookings />
            </PrivateRouteUser>
          }
        />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
