import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addVehicle } from "../../redux/slices/vehicleSlice";
import Swal from "sweetalert2";
import axios from "axios";
import Spinner from "../../components/Spinner";

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

  const [isFuelConsumptionDisabled, setIsFuelConsumptionDisabled] =
    useState(false);

  const [isUsingUrl, setIsUsingUrl] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  const dispatch = useDispatch();
  const { status, error } = useSelector((state) => state.vehicles);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "category") {
      if (value === "Electric Cars") {
        setFormData((prevData) => ({
          ...prevData,
          [name]: value,
          fuelConsumption: "Electric",
        }));
        setIsFuelConsumptionDisabled(true);
      } else {
        setFormData((prevData) => ({
          ...prevData,
          [name]: value,
          fuelConsumption: "",
        }));
        setIsFuelConsumptionDisabled(false);
      }
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      Swal.fire(
        "Error!",
        "File size exceeds 2MB. Please select a smaller file.",
        "error"
      );
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
    );

    try {
      const response = await axios.post(
        import.meta.env.VITE_CLOUDINARY_API_URL,
        formData
      );
      const imageUrl = response.data.secure_url;
      setFormData((prevData) => ({ ...prevData, image: imageUrl }));
      setIsUploading(false);
      setFormData((prevData) => ({ ...prevData, image: imageUrl }));
      Swal.fire("Success!", "Image uploaded successfully!", "success");
      e.target.value = "";
    } catch (error) {
      setIsUploading(false);
      console.error(error);
      Swal.fire("Error!", "Image upload failed. Try again.", "error");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.category ||
      !formData.pricePerDay ||
      !formData.seats ||
      !formData.transmission ||
      !formData.fuelConsumption ||
      !formData.image
    ) {
      Swal.fire(
        "Error!",
        "All fields are required, including the image.",
        "error"
      );
      return;
    }

    const updatedFormData = {
      ...formData,
      fuelConsumption:
        formData.category === "Electric Cars"
          ? "Electric"
          : formData.fuelConsumption + " l/100km",
    };

    try {
      await dispatch(addVehicle(updatedFormData));
      if (status === "succeeded") {
        setFormData({
          name: "",
          category: "",
          pricePerDay: "",
          seats: "",
          transmission: "",
          fuelConsumption: "",
          image: "",
        });

        Swal.fire({
          title: "Success!",
          text: "Vehicle added successfully!",
          icon: "success",
          confirmButtonText: "Close",
        });
      } else if (status === "failed") {
        Swal.fire({
          title: "Error!",
          text: error || "Failed to add vehicle.",
          icon: "error",
          confirmButtonText: "Close",
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: error?.message || "Something went wrong.",
        icon: "error",
        confirmButtonText: "Close",
      });
    }
  };

  return (
    <div className="w-full p-8">
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
            disabled={isFuelConsumptionDisabled}
            required={!isFuelConsumptionDisabled}
          />
        </div>
        <div>
          <div className="mb-4">
            <label htmlFor="imageOption" className="block font-medium mb-1">
              Image Upload Option
            </label>
            <select
              id="imageOption"
              value={isUsingUrl ? "url" : "cloudinary"}
              onChange={(e) => setIsUsingUrl(e.target.value === "url")}
              className="focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white w-full border border-gray-300 rounded-lg px-3 py-2"
            >
              <option value="url">Use URL</option>
              <option value="cloudinary">Upload from you PC</option>
            </select>
          </div>
        </div>

        {isUsingUrl ? (
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
        ) : (
          <div>
            <label className="block font-medium mb-1" htmlFor="file">
              Upload Image
            </label>
            <input
              type="file"
              id="file"
              onChange={handleFileUpload}
              className="focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white w-full border border-gray-300 rounded-lg px-3 py-2"
            />
            {isUploading && (
              <div className="flex items-center gap-2 my-4">
                <p className="text-md text-gray-500 ml-5">Uploading...</p>
                <Spinner size={20} />
              </div>
            )}
          </div>
        )}

        <button
          type="submit"
          className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 mt-3"
        >
          Add Vehicle
        </button>
      </form>
    </div>
  );
};

export default AddVehicle;
