import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const HeroSection = () => {
  const [pickupDate, setPickupDate] = useState(new Date());
  const [pickupTime, setPickupTime] = useState("00:00");
  const [dropoffDate, setDropoffDate] = useState(new Date());
  const [dropoffTime, setDropoffTime] = useState("00:00");
  const [pickupLocation, setPickupLocation] = useState("");
  const [dropoffLocation, setDropoffLocation] = useState("");
  const [isSameDropoff, setIsSameDropoff] = useState(true);

  const timeOptions = Array.from({ length: 48 }, (_, i) => {
    const hours = Math.floor(i / 2)
      .toString()
      .padStart(2, "0");
    const minutes = i % 2 === 0 ? "00" : "30";
    return `${hours}:${minutes}`;
  });

  const handleCheckboxChange = () => {
    setIsSameDropoff(!isSameDropoff);
    if (isSameDropoff) {
      setDropoffLocation(pickupLocation);
    } else {
      setDropoffLocation("");
    }
  };

  return (
    <div className="relative bg-gray-900 h-screen">
      {/* Background Image */}
      <img
        src="https://images.pexels.com/photos/14558135/pexels-photo-14558135.jpeg?auto=compress&cs=tinysrgb&w=300"
        alt="Background"
        className="absolute inset-0 object-cover w-full h-full z-0"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-40 z-10"></div>

      {/* Content */}
      <div className="relative z-20 flex flex-col items-center justify-center px-4 text-white">
        <h1 className="text-4xl md:text-6xl font-bold my-6">Rent a Car</h1>
        <p className="text-lg md:text-xl mb-6">
          Find the best car rental deals for your next trip.
        </p>

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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="">Select Pick-up Location</option>
                <option value="New York">New York</option>
                <option value="Los Angeles">Los Angeles</option>
                <option value="Chicago">Chicago</option>
              </select>
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="">Select Drop-off Location</option>
                  <option value="New York">New York</option>
                  <option value="Los Angeles">Los Angeles</option>
                  <option value="Chicago">Chicago</option>
                </select>
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
                disableClock
              />
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="">Select Time</option>
                {timeOptions.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
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
                disableClock
              />
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="">Select Time</option>
                {timeOptions.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Search Button */}
          <div className="w-full mt-6">
            <button
              className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-md font-medium w-full"
              type="button"
              onClick={() =>
                alert(
                  `Pickup Location: ${pickupLocation}\nDropoff Location: ${dropoffLocation}\nPickup Date: ${pickupDate.toLocaleDateString()}\nPickup Time: ${pickupTime}\nDropoff Date: ${dropoffDate.toLocaleDateString()}\nDropoff Time: ${dropoffTime}`
                )
              }
            >
              Search
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
