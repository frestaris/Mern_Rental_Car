import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";

const SearchAvailability = () => {
  const [pickupDate, setPickupDate] = useState(new Date());
  const [pickupTime, setPickupTime] = useState("08:00");
  const [dropoffDate, setDropoffDate] = useState(new Date());
  const [dropoffTime, setDropoffTime] = useState("08:00");
  const [pickupLocation, setPickupLocation] = useState("");
  const [dropoffLocation, setDropoffLocation] = useState("");
  const [isSameDropoff, setIsSameDropoff] = useState(true);
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

    const pickupDateWithoutTime = new Date(pickupDate);
    pickupDateWithoutTime.setHours(0, 0, 0, 0);

    const dropoffDateWithoutTime = new Date(dropoffDate);
    dropoffDateWithoutTime.setHours(0, 0, 0, 0);

    const oneDay = 24 * 60 * 60 * 1000;
    if (dropoffDateWithoutTime - pickupDateWithoutTime < oneDay) {
      newErrors.dropoffDate =
        "Minimum rental duration is 1 day. Please select a later drop-off date.";
    }

    if (
      pickupDate.toDateString() === dropoffDate.toDateString() &&
      pickupTime >= dropoffTime
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
      setDropoffLocation(pickupLocation);
    } else {
      setDropoffLocation("");
    }
  };

  const handleSearch = () => {
    setIsSubmitted(true);
    if (validateForm()) {
      navigate("/available-vehicles", {
        state: {
          pickupLocation,
          dropoffLocation: isSameDropoff ? pickupLocation : dropoffLocation,
          pickupDate,
          pickupTime,
          dropoffDate,
          dropoffTime,
        },
      });
    }
  };

  return (
    <>
      {/* Date Picker Section */}
      <div className="w-full bg-white text-black bg-opacity-60 p-6 shadow-lg rounded-t-2xl max-w-5xl border-b-[5px] border-b-amber-500">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Pickup Location */}
          <div className="flex-1">
            <label
              htmlFor="pickup-location"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Pick-up Location
            </label>
            <select
              id="pickup-location"
              value={pickupLocation}
              onChange={(e) => setPickupLocation(e.target.value)}
              className="w-full p-[11px] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
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
                {isSubmitted && errors.pickupLocation}
              </p>
            )}
            <div className="flex items-center mb-2">
              <input
                type="checkbox"
                id="same-dropoff"
                checked={isSameDropoff}
                onChange={handleCheckboxChange}
                className="mr-2"
              />
              <label
                htmlFor="same-dropoff"
                className="text-sm font-medium text-gray-700"
              >
                Same as Pick-up Location
              </label>
            </div>
          </div>

          {/* Drop-off Location */}
          {!isSameDropoff && (
            <div className="flex-1">
              <label
                htmlFor="dropoff-location"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Drop-off Location
              </label>
              <select
                id="dropoff-location"
                value={dropoffLocation}
                onChange={(e) => setDropoffLocation(e.target.value)}
                className="w-full p-[11px] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
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
                  {isSubmitted && errors.dropoffLocation}
                </p>
              )}
            </div>
          )}
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          {/* Pickup Date */}
          <div className="flex-1">
            <label
              htmlFor="pickup-date"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Pick-up Date
            </label>
            <DatePicker
              id="pickup-date"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
              selected={pickupDate}
              onChange={setPickupDate}
              clearIcon={null}
              dateFormat="dd-MM-yyyy"
              minDate={new Date()}
              disableClock
            />
            {isSubmitted && errors.pickupDate && (
              <p className="bg-red-50 p-2 rounded text-red-400 text-sm mt-1">
                {isSubmitted && errors.pickupDate}
              </p>
            )}
          </div>

          {/* Pickup Time */}
          <div className="flex-1">
            <label
              htmlFor="pickup-time"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Pick-up Time
            </label>
            <select
              id="pickup-time"
              value={pickupTime}
              onChange={(e) => setPickupTime(e.target.value)}
              className="w-full p-[11px] rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
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
          <div className="flex-1">
            <label
              htmlFor="dropoff-date"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Drop-off Date
            </label>
            <DatePicker
              id="dropoff-date"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
              selected={dropoffDate}
              onChange={setDropoffDate}
              clearIcon={null}
              dateFormat="dd-MM-yyyy"
              minDate={new Date()}
              disableClock
            />
            {isSubmitted && errors.dropoffDate && (
              <p className="bg-red-50 p-2 rounded text-red-400 text-sm mt-1">
                {isSubmitted && errors.dropoffDate}
              </p>
            )}
          </div>

          {/* Drop-off Time */}
          <div className="flex-1">
            <label
              htmlFor="dropoff-time"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Drop-off Time
            </label>
            <select
              id="dropoff-time"
              value={dropoffTime}
              onChange={(e) => setDropoffTime(e.target.value)}
              className="w-full p-[11px] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
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
                {isSubmitted && errors.dropoffTime}
              </p>
            )}
          </div>
        </div>

        {/* Search Button */}
        <div className="w-full mt-6">
          <button
            className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-md font-medium w-full"
            type="button"
            onClick={handleSearch}
          >
            Search
          </button>
        </div>
      </div>
    </>
  );
};

export default SearchAvailability;
