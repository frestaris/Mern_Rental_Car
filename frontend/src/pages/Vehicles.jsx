import { useState } from "react";
import carsData from "../utils/data";
import { GiGearStickPattern } from "react-icons/gi";
import { PiSeatbeltFill } from "react-icons/pi";
import { IoIosSpeedometer } from "react-icons/io";
import { FaChevronDown } from "react-icons/fa";

const Vehicles = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sortOption, setSortOption] = useState("");
  const [categoriesDropdownOpen, setCategoriesDropdownOpen] = useState(false);
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);

  const categories = [
    "Cars",
    "SUVs",
    "Electric Cars",
    "People Movers",
    "Luxury Cars",
    "Trucks, Vans, Buses and 4WDs",
  ];

  const handleCategoryChange = (category) => {
    setSelectedCategories((prevSelectedCategories) =>
      prevSelectedCategories.includes(category)
        ? prevSelectedCategories.filter((item) => item !== category)
        : [...prevSelectedCategories, category]
    );
  };

  const parseFuelConsumption = (fuelConsumption) => {
    const match = fuelConsumption.match(/(\d+(\.\d+)?)/);
    return match ? parseFloat(match[0]) : 0;
  };

  const toggleDropdown = (dropdown) => {
    if (dropdown === "categories") {
      setCategoriesDropdownOpen(!categoriesDropdownOpen);
      setSortDropdownOpen(false);
    } else if (dropdown === "sort") {
      setSortDropdownOpen(!sortDropdownOpen);
      setCategoriesDropdownOpen(false);
    }
  };

  const filteredCars = carsData
    .filter((car) => {
      const isCategoryMatch =
        selectedCategories.length === 0 ||
        selectedCategories.includes(car.category);
      const isSearchMatch = car.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      if (sortOption === "Automatic" || sortOption === "Manual") {
        return (
          isCategoryMatch && isSearchMatch && car.transmission === sortOption
        );
      }
      return isCategoryMatch && isSearchMatch;
    })
    .sort((a, b) => {
      switch (sortOption) {
        case "Alphabetical":
          return a.name.localeCompare(b.name);
        case "PriceLowToHigh":
          return a.pricePerDay - b.pricePerDay;
        case "PriceHighToLow":
          return b.pricePerDay - a.pricePerDay;
        case "Automatic":
        case "Manual":
          return 0;
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

  const clearFilters = () => {
    setSelectedCategories([]);
    setSortOption("");
    setSearchQuery("");
    setCategoriesDropdownOpen(false);
    setSortDropdownOpen(false);
  };

  return (
    <div className="p-6 bg-gray-100">
      {/* Search, Categories, and Sort Dropdown */}
      <div className="mb-6 flex flex-wrap justify-between items-center space-y-4 lg:flex-nowrap lg:space-y-0">
        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search vehicles..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-[11px] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white md:w-1/2 md:flex-grow md:mr-4"
        />

        {/* Categories, Sort Dropdown, and Clear Filters */}
        <div className="flex flex-col md:flex-row w-full md:w-auto justify-between gap-4 md:gap-4">
          {/* Categories */}
          <div className="relative w-full md:w-36">
            <button
              onClick={() => toggleDropdown("categories")}
              className="p-[11px] rounded-lg border border-gray-300 bg-white flex items-center justify-between w-full"
            >
              Categories
              <FaChevronDown className="ml-2" />
            </button>
            {categoriesDropdownOpen && (
              <div className="absolute z-20 bg-white border border-gray-300 mt-2 p-4 w-56 rounded-lg shadow-lg">
                {categories.map((category) => (
                  <label
                    key={category}
                    className="hover:cursor-pointer m-2 p-1 flex items-center gap-2"
                  >
                    <input
                      type="checkbox"
                      value={category}
                      checked={selectedCategories.includes(category)}
                      onChange={() => handleCategoryChange(category)}
                      className="form-checkbox"
                    />
                    {category}
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="relative w-full md:w-36">
            <button
              onClick={() => toggleDropdown("sort")}
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
                    onClick={() => setSortOption(option)}
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

          {/* Clear Filters */}
          <div className="w-full md:w-36">
            <button
              className="font-semibold p-[11px] rounded-lg border border-gray-300 bg-red-400 text-white w-full"
              onClick={clearFilters}
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Cars List */}
      <div className="flex flex-wrap gap-6 justify-center">
        {filteredCars.map((car, index) => (
          <div
            className="bg-white shadow-lg rounded-xl border border-gray-200 w-80 p-6 flex flex-col justify-between hover:shadow-2xl transition-shadow group"
            key={index}
          >
            <h3 className="text-2xl font-semibold text-gray-800 mb-3 text-center">
              {car.name}
            </h3>
            <div className="w-full h-48 flex justify-center items-center overflow-hidden mb-4">
              <img
                src={car.image}
                alt={`${car.name} image`}
                className="object-contain w-full h-full transform transition-transform group-hover:scale-110"
              />
            </div>
            <div className="flex-grow">
              <p className="text-md text-gray-500 mb-2">
                <span className="font-semibold text-amber-500">Category:</span>{" "}
                {car.category}
              </p>
              <p className="text-md text-gray-500 mb-5 border-b-2">
                <span className="font-semibold text-amber-500">
                  Price per day:
                </span>{" "}
                ${car.pricePerDay}
              </p>
              <div className="flex justify-between">
                <p className="text-md text-gray-500 mb-1 flex items-center gap-1">
                  <PiSeatbeltFill className="text-amber-600 text-2xl" />
                  {car.seats}
                </p>
                <p className="text-md text-gray-500 mb-1 flex items-center gap-1">
                  <GiGearStickPattern className="text-amber-600 text-2xl" />
                  {car.transmission.charAt(0)}
                </p>
                <p className="text-md text-gray-500 mb-1 flex items-center gap-1">
                  <IoIosSpeedometer className="text-amber-600 text-2xl" />
                  {car.fuelConsumption}
                </p>
              </div>
            </div>
            <button className="mt-4 bg-amber-500 text-white py-2 px-6 rounded-lg hover:bg-amber-600 transition-colors">
              Rent Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Vehicles;
