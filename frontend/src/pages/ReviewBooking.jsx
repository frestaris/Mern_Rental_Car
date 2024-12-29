import { useLocation } from "react-router-dom";
import { getUserById } from "../redux/slices/usersSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const ReviewBooking = () => {
  const location = useLocation();
  const dispatch = useDispatch();

  const {
    pickupLocation,
    dropoffLocation,
    pickupDate,
    pickupTime,
    dropoffDate,
    dropoffTime,
    vehicle,
    totalDays,
    totalCost,
  } = location.state || {};

  const userId = useSelector((state) => state.auth.currentUser?.id);

  useEffect(() => {
    if (userId) {
      dispatch(getUserById(userId));
    }
  }, [userId, dispatch]);

  const currentUser = useSelector((state) => state.auth.currentUser);

  return (
    <div className="p-8 bg-white rounded-lg shadow-xl ">
      <h2 className="text-3xl font-semibold text-gray-800 mb-6 border-b-4 border-amber-500 pb-2">
        Review Your Booking
      </h2>

      <div className="space-y-8">
        {/* Booking and Vehicle Details in the same row on medium and above */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Booking Details */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              Booking Details
            </h2>

            {/* Pickup and Dropoff Locations in the same row */}
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

            {/* Pickup Date and Pickup Time in the same row */}
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

            {/* Dropoff Date and Dropoff Time in the same row */}
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
      <div className="mt-8 text-center">
        <button className="bg-amber-500 text-white py-3 px-8 rounded-lg hover:bg-amber-600 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-400">
          Proceed Checkout
        </button>
      </div>
    </div>
  );
};

export default ReviewBooking;
