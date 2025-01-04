import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAvailableVehicles } from "../redux/slices/vehicleSlice";
import { PiSeatbeltFill } from "react-icons/pi";
import { GiGearStickPattern } from "react-icons/gi";
import { IoIosSpeedometer } from "react-icons/io";
import SearchAvailabilityBar from "../components/SearchAvailabilityBar";
import { FaChevronDown } from "react-icons/fa";

const AvailableVehicles = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const [sortOption, setSortOption] = useState("");

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

  const { currentUser } = useSelector((state) => state.auth);

  useEffect(() => {
    if (pickupLocation && pickupDate && dropoffDate) {
      dispatch(getAvailableVehicles({ pickupDate, dropoffDate }));
    }
  }, [dispatch, pickupLocation, pickupDate, dropoffDate]);

  const startDate = new Date(pickupDate);
  const endDate = new Date(dropoffDate);
  const totalDays = Math.ceil((endDate - startDate) / (1000 * 3600 * 24));

  const handleBookNow = (vehicle) => {
    if (!currentUser) {
      alert("Please log in before proceeding with the booking.");
      navigate("/sign-in");
    } else {
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
    }
  };
  const parseFuelConsumption = (fuelConsumption) => {
    const match = fuelConsumption.match(/(\d+(\.\d+)?)/);
    return match ? parseFloat(match[0]) : 0;
  };

  const toggleDropdown = () => {
    setSortDropdownOpen(!sortDropdownOpen);
  };

  const sortedVehicles = availableVehicles
    .filter((vehicle) => {
      if (sortOption === "Automatic")
        return vehicle.transmission === "Automatic";
      if (sortOption === "Manual") return vehicle.transmission === "Manual";
      return true;
    })
    .sort((a, b) => {
      switch (sortOption) {
        case "Alphabetical":
          return a.name.localeCompare(b.name);
        case "PriceLowToHigh":
          return a.pricePerDay - b.pricePerDay;
        case "PriceHighToLow":
          return b.pricePerDay - a.pricePerDay;
        case "FuelEfficient":
          return (
            parseFuelConsumption(a.fuelConsumption) -
            parseFuelConsumption(b.fuelConsumption)
          );
        case "LessEfficientFuel":
          return (
            parseFuelConsumption(b.fuelConsumption) -
            parseFuelConsumption(a.fuelConsumption)
          );
        default:
          return 0;
      }
    });

  return (
    <div>
      <div>
        <SearchAvailabilityBar
          pickupLocation={pickupLocation}
          dropoffLocation={dropoffLocation}
          pickupDate={pickupDate}
          pickupTime={pickupTime}
          dropoffDate={dropoffDate}
          dropoffTime={dropoffTime}
        />
        <div>
          {/* Booking Details Section */}
          <h2 className="text-2xl font-semibold text-gray-700 my-4 border-b-4 border-amber-500">
            Booking Details
          </h2>
        </div>
      </div>
      {/* Sort Dropdown */}
      <div className="relative md:w-36 mx-5">
        <button
          onClick={toggleDropdown}
          className="p-[11px] rounded-lg border border-gray-300 bg-white flex items-center justify-between w-full"
        >
          Sort by
          <FaChevronDown className="ml-2" />
        </button>
        {sortDropdownOpen && (
          <div className="absolute z-20 bg-white border border-gray-300 mt-2 p-4 w-56 rounded-lg shadow-lg">
            {[
              "Alphabetical",
              "PriceLowToHigh",
              "PriceHighToLow",
              "Automatic",
              "Manual",
              "FuelEfficient",
              "LessEfficientFuel",
            ].map((option) => (
              <button
                key={option}
                onClick={() => {
                  setSortOption(option);
                  setSortDropdownOpen(false);
                }}
                className={`mb-2 w-full text-left p-2 rounded-lg ${
                  sortOption === option
                    ? "bg-amber-500 text-white"
                    : "hover:bg-gray-200"
                }`}
              >
                {option.replace(/([A-Z])/g, " $1")}
              </button>
            ))}
          </div>
        )}
      </div>
      {/* Vehicle Listing */}
      <div>
        <h2 className="m-5 text-2xl text-gray-600">
          Showing {sortedVehicles.length} results
        </h2>
        {loading && <p>Loading available vehicles...</p>}
        {error && <p>{error.message || "An error occurred"}</p>}

        {sortedVehicles.length === 0 && !loading && !error && (
          <p>No vehicles available for the selected dates.</p>
        )}

        <div className="flex flex-wrap gap-6 justify-center">
          {sortedVehicles.map((vehicle) => (
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
