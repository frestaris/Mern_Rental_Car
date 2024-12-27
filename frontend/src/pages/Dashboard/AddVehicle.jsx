import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addVehicle } from "../../redux/slices/vehicleSlice";

const AddVehicle = () => {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    pricePerDay: "",
    seats: "",
    transmission: "",
    fuelConsumption: "",
    image: "",
  });
  const dispatch = useDispatch();
  const { status, error } = useSelector((state) => state.vehicles);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(addVehicle(formData));
  };

  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold mb-4">Add New Vehicle</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label className="block font-medium mb-1" htmlFor="name">
            Vehicle Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white w-full border border-gray-300 rounded-lg px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block font-medium mb-1" htmlFor="category">
            Category
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white w-full border border-gray-300 rounded-lg p-3"
            required
          >
            <option value="" disabled>
              Select a category
            </option>
            <option value="Cars">Cars</option>
            <option value="SUVs">SUVs</option>
            <option value="Electric Cars">Electric Cars</option>
            <option value="People Movers">People Movers</option>
            <option value="Luxury Cars">Luxury Cars</option>
            <option value="Trucks, Vans, Buses and 4WDs">
              Trucks, Vans, Buses and 4WDs
            </option>
          </select>
        </div>
        <div>
          <label className="block font-medium mb-1" htmlFor="pricePerDay">
            Price Per Day ($)
          </label>
          <input
            type="number"
            id="pricePerDay"
            name="pricePerDay"
            value={formData.pricePerDay}
            onChange={handleChange}
            className="focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white w-full border border-gray-300 rounded-lg px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block font-medium mb-1" htmlFor="seats">
            Seats
          </label>
          <select
            id="seats"
            name="seats"
            value={formData.seats}
            onChange={handleChange}
            className="focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white w-full border border-gray-300 rounded-lg p-3"
            required
          >
            <option value="" disabled>
              Select the number of seats
            </option>
            {Array.from({ length: 13 }, (_, i) => i + 2).map((seatCount) => (
              <option key={seatCount} value={seatCount}>
                {seatCount}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block font-medium mb-1" htmlFor="transmission">
            Transmission
          </label>
          <select
            id="transmission"
            name="transmission"
            value={formData.transmission}
            onChange={handleChange}
            className="focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white w-full border border-gray-300 rounded-lg p-3"
            required
          >
            <option value="" disabled>
              Select transmission type
            </option>
            <option value="Automatic">Automatic</option>
            <option value="Manual">Manual</option>
          </select>
        </div>
        <div>
          <label className="block font-medium mb-1" htmlFor="fuelConsumption">
            Fuel Consumption (L per 100km)
          </label>
          <input
            type="number"
            id="fuelConsumption"
            name="fuelConsumption"
            placeholder="Example: 2.1"
            value={formData.fuelConsumption}
            onChange={handleChange}
            className="focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white w-full border border-gray-300 rounded-lg px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block font-medium mb-1" htmlFor="image">
            Image URL
          </label>
          <input
            type="url"
            id="image"
            name="image"
            value={formData.image}
            onChange={handleChange}
            className="focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white w-full border border-gray-300 rounded-lg px-3 py-2"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 mt-3"
        >
          Add Vehicle
        </button>
      </form>
      {status === "failed" && (
        <p className="bg-red-100 text-red-500 text-2xl my-2 p-2">{error}</p>
      )}
      {status === "succeeded" && (
        <p className="bg-green-100 text-green-500 text-2xl my-2 p-2">
          Vehicle added successfully!
        </p>
      )}
    </div>
  );
};

export default AddVehicle;
