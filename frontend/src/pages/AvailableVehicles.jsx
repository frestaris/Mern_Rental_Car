import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAvailableVehicles } from "../redux/slices/vehicleSlice";
import { PiSeatbeltFill } from "react-icons/pi";
import { GiGearStickPattern } from "react-icons/gi";
import { IoIosSpeedometer } from "react-icons/io";

const AvailableVehicles = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    pickupLocation,
    dropoffLocation,
    pickupDate,
    pickupTime,
    dropoffDate,
    dropoffTime,
  } = location.state || {};

  const dispatch = useDispatch();
  const { availableVehicles, loading, error } = useSelector(
    (state) => state.vehicles
  );

  useEffect(() => {
    if (pickupLocation && pickupDate && dropoffDate) {
      dispatch(getAvailableVehicles({ pickupDate, dropoffDate }));
    }
  }, [dispatch, pickupLocation, pickupDate, dropoffDate]);

  const startDate = new Date(pickupDate);
  const endDate = new Date(dropoffDate);
  const totalDays = Math.ceil((endDate - startDate) / (1000 * 3600 * 24));

  const handleBookNow = (vehicle) => {
    navigate("/reviewBooking", {
      state: {
        pickupLocation,
        dropoffLocation,
        pickupDate,
        pickupTime,
        dropoffDate,
        dropoffTime,
        vehicle,
        totalDays,
        totalCost: vehicle.pricePerDay * totalDays,
      },
    });
  };

  return (
    <div>
      <div className=" mx-auto p-6 bg-gray-50 rounded-lg shadow-lg">
        <div>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4 border-b-4 border-amber-500">
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
        </div>
      </div>

      <div>
        <h2 className="m-5 text-2xl text-gray-600">
          Showing {availableVehicles.length} results
        </h2>
        {loading && <p>Loading available vehicles...</p>}
        {error && <p>{error.message || "An error occurred"}</p>}

        {availableVehicles.length === 0 && !loading && !error && (
          <p>No vehicles available for the selected dates.</p>
        )}

        <div className="flex flex-wrap gap-6 justify-center">
          {availableVehicles.map((vehicle) => (
            <div
              className="bg-white shadow-lg rounded-xl border border-gray-200 w-80 p-6 flex flex-col justify-between hover:shadow-2xl transition-shadow group"
              key={vehicle._id}
            >
              <h3 className="text-2xl font-semibold text-gray-800 mb-3 text-center">
                {vehicle.name}
              </h3>
              <div className="w-full h-48 flex justify-center items-center overflow-hidden mb-4">
                <img
                  src={vehicle.image}
                  alt={`${vehicle.name} image`}
                  className="object-contain w-full h-full transform transition-transform group-hover:scale-110"
                />
              </div>
              <div className="flex-grow">
                <p className="text-md text-gray-500 mb-2">
                  <span className="font-semibold text-amber-500">
                    Category:
                  </span>{" "}
                  {vehicle.category}
                </p>
                <p className="text-md text-gray-500 mb-5 border-b-2">
                  <span className="font-semibold text-amber-500">
                    Price per day:
                  </span>{" "}
                  ${vehicle.pricePerDay}
                </p>
                <div className="flex justify-between">
                  <p className="text-md text-gray-500 mb-1 flex items-center gap-1">
                    <PiSeatbeltFill className="text-amber-600 text-2xl" />
                    {vehicle.seats}
                  </p>
                  <p className="text-md text-gray-500 mb-1 flex items-center gap-1">
                    <GiGearStickPattern className="text-amber-600 text-2xl" />
                    {vehicle.transmission.charAt(0)}
                  </p>
                  <p className="text-md text-gray-500 mb-1 flex items-center gap-1">
                    <IoIosSpeedometer className="text-amber-600 text-2xl" />
                    {vehicle.fuelConsumption}
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleBookNow(vehicle)}
                className="mt-4 bg-amber-500 text-white py-2 px-6 rounded-lg hover:bg-amber-600 transition-colors"
              >
                Book Now
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AvailableVehicles;
