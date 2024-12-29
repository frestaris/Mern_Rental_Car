import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";

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
  const [pickupTimeState, setPickupTime] = useState(pickupTime || "00:00");
  const [dropoffDateState, setDropoffDate] = useState(
    dropoffDate || new Date()
  );
  const [dropoffTimeState, setDropoffTime] = useState(dropoffTime || "00:00");
  const [isSameDropoff, setIsSameDropoff] = useState(
    dropoffLocation === pickupLocation
  );

  const navigate = useNavigate();

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
      setDropoffLocation(pickupLocationState); // Use state for pickupLocation
    } else {
      setDropoffLocation("");
    }
  };

  const handleSearch = () => {
    if (
      !pickupLocationState ||
      !pickupDateState ||
      !pickupTimeState ||
      !dropoffDateState ||
      !dropoffTimeState
    ) {
      alert("Please fill in all required fields!");
      return;
    }

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
              value={pickupLocationState} // Bind state value
              onChange={(e) => setPickupLocation(e.target.value)} // Update state on change
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 text-gray-700"
            >
              <option value="">Select Pick-up Location</option>
              <option value="New York">New York</option>
              <option value="Los Angeles">Los Angeles</option>
              <option value="Chicago">Chicago</option>
            </select>
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
                value={dropoffLocationState} // Bind state value
                onChange={(e) => setDropoffLocation(e.target.value)} // Update state on change
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 text-gray-700"
              >
                <option value="">Select Drop-off Location</option>
                <option value="New York">New York</option>
                <option value="Los Angeles">Los Angeles</option>
                <option value="Chicago">Chicago</option>
              </select>
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
              selected={pickupDateState} // Bind state value
              onChange={setPickupDate} // Update state on change
              clearIcon={null}
              dateFormat="dd-MM-yyyy"
              disableClock
            />
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
              value={pickupTimeState} // Bind state value
              onChange={(e) => setPickupTime(e.target.value)} // Update state on change
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 text-gray-700"
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
              selected={dropoffDateState} // Bind state value
              onChange={setDropoffDate} // Update state on change
              clearIcon={null}
              dateFormat="dd-MM-yyyy"
              disableClock
            />
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
              value={dropoffTimeState} // Bind state value
              onChange={(e) => setDropoffTime(e.target.value)} // Update state on change
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 text-gray-700"
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
            className="w-full bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-lg font-semibold transition duration-300"
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

export default SearchAvailabilityBar;
