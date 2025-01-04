import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";
import Spinner from "./Spinner";

const SearchAvailabilityBar = ({
  pickupLocation,
  dropoffLocation,
  pickupDate,
  pickupTime,
  dropoffDate,
  dropoffTime,
}) => {
  const [pickupLocationState, setPickupLocation] = useState(
    pickupLocation || ""
  );
  const [dropoffLocationState, setDropoffLocation] = useState(
    dropoffLocation || ""
  );
  const [pickupDateState, setPickupDate] = useState(pickupDate || new Date());
  const [pickupTimeState, setPickupTime] = useState(pickupTime || "");
  const [dropoffDateState, setDropoffDate] = useState(
    dropoffDate || new Date()
  );
  const [dropoffTimeState, setDropoffTime] = useState(dropoffTime || "");
  const [isSameDropoff, setIsSameDropoff] = useState(
    dropoffLocation === pickupLocation
  );
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();

  const workingHours = (start = 8, end = 20) => {
    const options = [];
    for (let hour = start; hour <= end; hour++) {
      options.push(`${hour.toString().padStart(2, "0")}:00`);
    }
    return options;
  };

  const timeOptions = workingHours();

  const validateForm = () => {
    const newErrors = {};

    if (!pickupLocation)
      newErrors.pickupLocation = "Pick-up location is required.";
    if (!pickupTime) newErrors.pickupTime = "Pick-up time is required.";
    if (!dropoffTime) newErrors.dropoffTime = "Drop-off time is required.";
    if (!dropoffDate) newErrors.dropoffDate = "Drop-off date is required.";
    if (!isSameDropoff && !dropoffLocation)
      newErrors.dropoffLocation = "Drop-off location is required.";

    const pickupDateWithoutTime = new Date(pickupDateState);
    pickupDateWithoutTime.setHours(0, 0, 0, 0);

    const dropoffDateWithoutTime = new Date(dropoffDateState);
    dropoffDateWithoutTime.setHours(0, 0, 0, 0);

    const oneDay = 24 * 60 * 60 * 1000;
    if (dropoffDateWithoutTime - pickupDateWithoutTime < oneDay) {
      newErrors.dropoffDate =
        "Minimum rental duration is 1 day. Please select a later drop-off date.";
    }

    // Check if pick-up and drop-off dates are the same
    if (
      pickupDateState.toDateString() === dropoffDateState.toDateString() &&
      pickupTimeState >= dropoffTimeState
    ) {
      newErrors.dropoffTime =
        "Drop-off time must be later than the pick-up time on the same day.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCheckboxChange = () => {
    setIsSameDropoff(!isSameDropoff);
    if (isSameDropoff) {
      setDropoffLocation(pickupLocationState);
    } else {
      setDropoffLocation("");
    }
  };

  const handleSearch = () => {
    setLoading(true);
    setIsSubmitted(true);
    if (validateForm()) {
      navigate("/available-vehicles", {
        state: {
          pickupLocation: pickupLocationState,
          dropoffLocation: isSameDropoff
            ? pickupLocationState
            : dropoffLocationState,
          pickupDate: pickupDateState,
          pickupTime: pickupTimeState,
          dropoffDate: dropoffDateState,
          dropoffTime: dropoffTimeState,
        },
      });
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  };

  return (
    <>
      {/* Date Picker Section */}
      <div className="bg-white p-3 shadow-lg mb-6">
        <div className="flex flex-wrap gap-4 justify-between">
          {/* Pickup Location */}
          <div className="flex-1 min-w-[200px]">
            <label
              htmlFor="pickup-location"
              className="block text-sm font-semibold text-gray-800 mb-1"
            >
              Pick-up Location
            </label>
            <select
              id="pickup-location"
              value={pickupLocationState}
              onChange={(e) => setPickupLocation(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 text-gray-700"
            >
              <option value="">Select Pick-up Location</option>
              <option value="Brisbane">Brisbane</option>
              <option value="Sydney">Sydney</option>
              <option value="Melbourne">Melbourne</option>
              <option value="Cairns">Cairns</option>
              <option value="Perth">Perth</option>
              <option value="Adelaide">Adelaide</option>
            </select>
            {isSubmitted && errors.pickupLocation && (
              <p className="bg-red-50 p-2 rounded text-red-400 text-sm mt-1">
                {errors.pickupLocation}
              </p>
            )}
            <div className="flex items-center mt-1">
              <input
                type="checkbox"
                id="same-dropoff"
                checked={isSameDropoff}
                onChange={handleCheckboxChange}
                className="mr-2"
              />
              <label
                htmlFor="same-dropoff"
                className="text-xs font-medium text-gray-700"
              >
                Same as Pick-up Location
              </label>
            </div>
          </div>

          {/* Drop-off Location */}
          {!isSameDropoff && (
            <div className="flex-1 min-w-[200px]">
              <label
                htmlFor="dropoff-location"
                className="block text-sm font-semibold text-gray-800 mb-1"
              >
                Drop-off Location
              </label>
              <select
                id="dropoff-location"
                value={dropoffLocationState}
                onChange={(e) => setDropoffLocation(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 text-gray-700"
              >
                <option value="">Select Drop-off Location</option>
                <option value="Brisbane">Brisbane</option>
                <option value="Sydney">Sydney</option>
                <option value="Melbourne">Melbourne</option>
                <option value="Cairns">Cairns</option>
                <option value="Perth">Perth</option>
                <option value="Adelaide">Adelaide</option>
              </select>
              {isSubmitted && errors.dropoffLocation && (
                <p className="bg-red-50 p-2 rounded text-red-400 text-sm mt-1">
                  {errors.dropoffLocation}
                </p>
              )}
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-4 mt-4 justify-between">
          {/* Pickup Date */}
          <div className="flex-1 min-w-[200px]">
            <label
              htmlFor="pickup-date"
              className="block text-sm font-semibold text-gray-800 mb-1"
            >
              Pick-up Date
            </label>
            <DatePicker
              id="pickup-date"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 text-gray-700"
              selected={pickupDateState}
              onChange={setPickupDate}
              clearIcon={null}
              dateFormat="dd-MM-yyyy"
              minDate={new Date()}
              disableClock
            />
            {isSubmitted && errors.pickupDate && (
              <p className="bg-red-50 p-2 rounded text-red-400 text-sm mt-1">
                {errors.pickupDate}
              </p>
            )}
          </div>

          {/* Pickup Time */}
          <div className="flex-1 min-w-[200px]">
            <label
              htmlFor="pickup-time"
              className="block text-sm font-semibold text-gray-800 mb-1"
            >
              Pick-up Time
            </label>
            <select
              id="pickup-time"
              value={pickupTimeState}
              onChange={(e) => setPickupTime(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 text-gray-700"
            >
              <option value="">Select Time</option>
              {timeOptions.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
            {isSubmitted && errors.pickupTime && (
              <p className="bg-red-50 p-2 rounded text-red-400 text-sm mt-1">
                {errors.pickupTime}
              </p>
            )}
          </div>

          {/* Drop-off Date */}
          <div className="flex-1 min-w-[200px]">
            <label
              htmlFor="dropoff-date"
              className="block text-sm font-semibold text-gray-800 mb-1"
            >
              Drop-off Date
            </label>
            <DatePicker
              id="dropoff-date"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 text-gray-700"
              selected={dropoffDateState}
              onChange={setDropoffDate}
              clearIcon={null}
              dateFormat="dd-MM-yyyy"
              minDate={new Date()}
              disableClock
            />
            {isSubmitted && errors.dropoffDate && (
              <p className="bg-red-50 p-2 rounded text-red-400 text-sm mt-1">
                {errors.dropoffDate}
              </p>
            )}
          </div>

          {/* Drop-off Time */}
          <div className="flex-1 min-w-[200px]">
            <label
              htmlFor="dropoff-time"
              className="block text-sm font-semibold text-gray-800 mb-1"
            >
              Drop-off Time
            </label>
            <select
              id="dropoff-time"
              value={dropoffTimeState}
              onChange={(e) => setDropoffTime(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 text-gray-700"
            >
              <option value="">Select Time</option>
              {timeOptions.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
            {isSubmitted && errors.dropoffTime && (
              <p className="bg-red-50 p-2 rounded text-red-400 text-sm mt-1">
                {errors.dropoffTime}
              </p>
            )}
          </div>
        </div>

        {/* Search Button */}
        <div className="w-full mt-6">
          <button
            className="w-full bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-lg font-semibold transition duration-300"
            type="button"
            onClick={handleSearch}
            disabled={loading}
          >
            {loading ? (
              <div className="space-x-4">
                <span>Updating Search...</span>
                <Spinner size={20} color="white" />
              </div>
            ) : (
              "Update Search"
            )}
          </button>
        </div>
      </div>
    </>
  );
};

export default SearchAvailabilityBar;
