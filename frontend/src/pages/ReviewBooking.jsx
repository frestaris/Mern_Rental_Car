import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { resetError } from "../redux/slices/bookingSlice";
import { addBooking } from "../redux/slices/bookingSlice";
import { FaStripeS } from "react-icons/fa";
import { useEffect, useState } from "react";
import axios from "axios";
import { baseURL } from "../utils/baseUrl";
import Swal from "sweetalert2";

const ReviewBooking = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  const {
    pickupLocation,
    dropoffLocation,
    pickupDate,
    pickupTime,
    dropoffTime,
    dropoffDate,
    vehicle,
    totalDays,
    totalCost,
  } = location.state || {};

  useEffect(() => {
    dispatch(resetError());
  }, [dispatch]);

  const { loading, error } = useSelector((state) => state.booking);

  const currentUser = useSelector((state) => state.auth.currentUser);

  const handleCheckoutWithStripe = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    if (
      !pickupLocation ||
      !dropoffLocation ||
      !pickupDate ||
      !pickupTime ||
      !dropoffTime ||
      !dropoffDate ||
      !vehicle
    ) {
      alert("Please ensure all booking details are provided.");
      return;
    }

    if (!currentUser || !currentUser._id) {
      alert("User is not logged in. Please log in to proceed.");
      return;
    }

    if (isNaN(new Date(pickupDate)) || isNaN(new Date(dropoffDate))) {
      alert("Invalid date format. Please select valid dates.");
      return;
    }

    const bookingData = {
      userId: currentUser._id,
      carId: {
        _id: vehicle._id,
        name: vehicle.name,
        image: vehicle.image,
        category: vehicle.category,
        pricePerDay: vehicle.pricePerDay,
      },
      pickupLocation,
      dropoffLocation,
      startDate: pickupDate,
      endDate: dropoffDate,
      pickupTime,
      dropoffTime,
      totalCost,
      totalDays,
    };

    try {
      localStorage.setItem("bookingData", JSON.stringify(bookingData));
    } catch (error) {
      console.error("Error saving booking data to localStorage:", error);
      alert("There was an issue saving your booking data. Please try again.");
      return;
    }

    try {
      const { data } = await axios.post(
        `${baseURL}/api/booking/payment/create-session`,
        { bookingData }
      );

      if (!data || !data.sessionId) {
        throw new Error("Missing sessionId in response from the backend.");
      }

      const stripe = window.Stripe(import.meta.env.VITE_STRIPE_PK);

      const result = await stripe.redirectToCheckout({
        sessionId: data.sessionId,
      });

      if (result.error) {
        throw new Error(result.error.message);
      }
    } catch (error) {
      console.error("Error during checkout:", error);

      if (error.response) {
        alert(
          `Request failed: ${
            error.response.data.message || error.response.statusText
          }`
        );
      } else if (error.message) {
        alert(`Error: ${error.message}`);
      } else {
        alert("There was an issue with the payment. Please try again.");
      }
    }
  };

  const handleCheckoutWithoutStripe = async () => {
    if (isProcessing) return;
    setIsProcessing(true);

    if (
      !pickupLocation ||
      !dropoffLocation ||
      !pickupTime ||
      !dropoffTime ||
      !pickupDate ||
      !dropoffDate ||
      !vehicle
    );
    const bookingData = {
      userId: currentUser._id,
      carId: {
        _id: vehicle._id,
        name: vehicle.name,
        image: vehicle.image,
        category: vehicle.category,
        pricePerDay: vehicle.pricePerDay,
      },
      pickupLocation,
      dropoffLocation,
      startDate: pickupDate,
      endDate: dropoffDate,
      pickupTime,
      dropoffTime,
      totalCost,
      totalDays,
    };

    try {
      dispatch(addBooking(bookingData));

      let countdown = 3;

      Swal.fire({
        title: "Success",
        html: `Booking has been successfully created.<br><strong>Redirecting in <span id="countdown">${countdown}</span> seconds...</strong>`,
        icon: "success",
        timer: countdown * 1000,
        showConfirmButton: false,
        willOpen: () => {
          const interval = setInterval(() => {
            countdown -= 1;
            const countdownElement = document.getElementById("countdown");
            if (countdownElement) {
              countdownElement.textContent = countdown;
            }
            if (countdown === 0) {
              clearInterval(interval);
            }
          }, 1000);
        },
        didClose: () => {
          navigate(`/user-booking`);
        },
      });
    } catch (error) {
      console.error("Error during booking:", error);
      Swal.fire({
        title: "Error",
        text: "There was an issue creating your booking. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <div className="p-8 bg-white rounded-lg shadow-xl ">
      <h2 className="text-3xl font-semibold text-gray-800 mb-6 border-b-4 border-amber-500 pb-2">
        Review Your Booking
      </h2>

      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Booking Details */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              Booking Details
            </h2>

            {/* Pickup and Dropoff Locations */}
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <strong className="text-amber-600">Pickup Location:</strong>
                <p className="text-gray-600">{pickupLocation}</p>
              </div>
              <div>
                <strong className="text-amber-600">Dropoff Location:</strong>
                <p className="text-gray-600">{dropoffLocation}</p>
              </div>
            </div>

            {/* Pickup Date and Pickup Time */}
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <strong className="text-amber-600">Pickup Date:</strong>
                <p className="text-gray-600">
                  {pickupDate && new Date(pickupDate).toLocaleDateString()}
                </p>
              </div>
              <div>
                <strong className="text-amber-600">Pickup Time:</strong>
                <p className="text-gray-600">{pickupTime}</p>
              </div>
            </div>

            {/* Dropoff Date and Dropoff Time */}
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <strong className="text-amber-600">Dropoff Date:</strong>
                <p className="text-gray-600">
                  {dropoffDate && new Date(dropoffDate).toLocaleDateString()}
                </p>
              </div>
              <div>
                <strong className="text-amber-600">Dropoff Time:</strong>
                <p className="text-gray-600">{dropoffTime}</p>
              </div>
            </div>
            <div>
              <strong className="text-amber-600">Email:</strong>
              <p className="text-gray-600">{currentUser.email}</p>
            </div>
          </div>

          {/* Vehicle Details */}
          <div>
            <h3 className="text-2xl font-semibold text-gray-700 mb-4">
              Vehicle Details
            </h3>
            <div className="flex flex-col md:flex-row">
              {/* Vehicle Image */}
              <div className="mt-4 md:mt-0 md:mr-6">
                <img
                  src={vehicle.image}
                  alt={vehicle.name}
                  className="w-auto"
                />
              </div>

              {/* Vehicle Information */}
              <div className="text-lg text-gray-600 md:m-0 mt-6 space-y-2">
                <p>
                  <strong className="text-amber-600">Vehicle:</strong>{" "}
                  {vehicle.name}
                </p>
                <p>
                  <strong className="text-amber-600">Category:</strong>{" "}
                  {vehicle.category}
                </p>
                <p>
                  <strong className="text-amber-600">Price per Day: </strong> $
                  {vehicle.pricePerDay}
                </p>
                {/* Display the total days */}
                <p>
                  <strong className="text-amber-600">Total Days: </strong>
                  {totalDays}
                </p>
                <p>
                  <strong className="text-amber-600">Total Cost:</strong> $
                  {totalCost}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="flex flex-col md:flex-row justify-center gap-5 mt-8">
        <div className="m-0 md:mt-8 text-center">
          <button
            className="bg-amber-500 text-white py-3 px-8 rounded-lg hover:bg-amber-600 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-400"
            onClick={handleCheckoutWithoutStripe}
            disabled={loading}
          >
            {loading ? "Processing..." : "Proceed Checkout without Stripe"}
          </button>
          {error && <p className="text-red-500 mt-4">{error}</p>}
        </div>
        <div className="m-0 md:mt-8 text-center">
          <button
            className="flex items-center justify-center bg-[#6772e5] text-white py-3 px-8 rounded-lg hover:bg-[#5469d4] transition-colors focus:outline-none focus:ring-2 focus:ring-[#5469d4] disabled:opacity-50"
            onClick={handleCheckoutWithStripe}
            disabled={loading}
          >
            {loading ? (
              "Processing..."
            ) : (
              <>
                <FaStripeS className="mr-2 text-white text-xl" />
                Proceed Checkout with Stripe
              </>
            )}
          </button>
          {error && <p className="text-red-500 mt-4">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default ReviewBooking;
