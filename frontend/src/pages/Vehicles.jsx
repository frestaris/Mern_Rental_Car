import carsData from "../utils/data";
import { GiGearStickPattern } from "react-icons/gi";
import { PiSeatbeltFill } from "react-icons/pi";
import { IoIosSpeedometer } from "react-icons/io";

const Vehicles = () => {
  return (
    <div className="flex flex-wrap gap-6 justify-center p-6 bg-gray-100">
      {carsData.map((car, index) => (
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
              {" "}
              <p className="text-md text-gray-500 mb-1 flex items-center gap-1">
                <PiSeatbeltFill className="text-amber-600 text-2xl" />
                {car.seats}
              </p>
              <p className="text-md text-gray-500 mb-1 flex items-center gap-1">
                <GiGearStickPattern className="text-amber-600 text-2xl" />
                {car.transmission.charAt(0)}
              </p>
              <p className="text-md text-gray-500 mb-1 flex items-center gap-1">
                {" "}
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
  );
};

export default Vehicles;
