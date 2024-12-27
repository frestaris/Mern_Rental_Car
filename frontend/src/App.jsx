import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import Navbar from "./components/Navbar";
import Vehicles from "./pages/Vehicles";
import About from "./pages/About";
import Contact from "./pages/Contact";
import SignIn from "./components/SignIn";
import Footer from "./components/Footer";
import SignUp from "./components/SignUp";
import Dashboard from "./components/Dashboard";
import { PrivateRouteAdmin, PrivateRouteUser } from "./components/PrivateRoute";
import Bookings from "./pages/Bookings";

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
        <Route
          path="/dashboard"
          element={
            <PrivateRouteAdmin>
              <Dashboard />
            </PrivateRouteAdmin>
          }
        />

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
