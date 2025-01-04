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
import DashboardLayout from "./pages/Dashboard/DashboardLayout";
import ManageBookings from "./pages/Dashboard/ManageBookings";
import ManageVehicles from "./pages/Dashboard/ManageVehicles";
import AddVehicle from "./pages/Dashboard/AddVehicle";
import ManageUsers from "./pages/Dashboard/ManageUsers";
import UpdateVehicle from "./pages/Dashboard/UpdateVehicle";
import UpdateUser from "./pages/Dashboard/UpdateUser";
import AvailableVehicles from "./pages/AvailableVehicles";
import ReviewBooking from "./pages/ReviewBooking";
import PaymentSuccess from "./components/PaymentSuccess";
import BookingUser from "./pages/BookingUser";
import BookingPage from "./pages/BookingPage";
import MainDashboard from "./pages/Dashboard/MainDashboard";

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
        <Route path="/available-vehicles" element={<AvailableVehicles />} />
        <Route path="/reviewBooking" element={<ReviewBooking />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/payment-cancel" element={<Home />} />
        <Route path="booking/:id" element={<BookingPage />} />

        {/* ADMIN DASHBOARD ROUTE*/}
        <Route
          path="/dashboard"
          element={
            <PrivateRouteAdmin>
              <DashboardLayout />
            </PrivateRouteAdmin>
          }
        >
          <Route path="" element={<MainDashboard />} />
          <Route path="manage-vehicles" element={<ManageVehicles />} />
          <Route path="bookings" element={<ManageBookings />} />
          <Route path="add-vehicle" element={<AddVehicle />} />
          <Route path="manage-users" element={<ManageUsers />} />
          <Route path="update-vehicle/:id" element={<UpdateVehicle />} />
          <Route path="update-user/:id" element={<UpdateUser />} />
        </Route>

        {/* USER ROUTE*/}
        <Route
          path="/user-booking"
          element={
            <PrivateRouteUser>
              <BookingUser />
            </PrivateRouteUser>
          }
        />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
