import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getCars, deleteCar } from "../../redux/slices/vehicleSlice";
import { MdEdit } from "react-icons/md";
import { RiDeleteBinFill } from "react-icons/ri";
import { FaSearch } from "react-icons/fa";
import DeleteModal from "../../components/DeleteModal";
import Swal from "sweetalert2";
import Spinner from "../../components/Spinner";

const ManageVehicles = () => {
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleVehicles, setVisibleVehicles] = useState(10);

  const [showModal, setShowModal] = useState(false);
  const [vehicleToDelete, setVehicleToDelete] = useState(null);

  const { vehicles, status, error } = useSelector((state) => state.vehicles);

  const loadMoreVehicles = () => {
    setVisibleVehicles((prevCount) => prevCount + 5);
  };

  const handleDelete = (vehicleId) => {
    setVehicleToDelete(vehicleId);
    setShowModal(true);
  };

  const handleDeleteVehicle = () => {
    if (vehicleToDelete) {
      dispatch(deleteCar(vehicleToDelete));
      setShowModal(false);
      setVehicleToDelete(null);
      Swal.fire({
        title: "Success",
        text: "Vehicle deleted successfully!",
        icon: "success",
        timer: 1000,
        showConfirmButton: false,
      });
    }
  };

  useEffect(() => {
    dispatch(getCars());
  }, [dispatch]);

  // Filter vehicles based on search query
  const filteredVehicles = vehicles.filter((vehicle) => {
    return (
      vehicle.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center mt-20">
        <Spinner />
      </div>
    );
  }

  if (status === "failed") {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <div className="relative flex items-center">
        <input
          type="text"
          placeholder="Search vehicles..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="m-2 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-transparent w-6/12 border border-gray-300 rounded-lg p-3 pl-10"
        />
        <FaSearch
          className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-500"
          size={18}
        />
        <p className="ml-2">
          Tot. cars: <span className="font-semibold">{vehicles.length}</span>
        </p>
      </div>

      <table className="w-full min-w-max md:m-0 ml-2 table-auto text-left">
        <thead>
          <tr>
            <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 py-4 pl-1">
              <p className="block antialiased font-sans text-sm text-blue-gray-900 font-normal leading-none opacity-70">
                Vehicle
              </p>
            </th>
            <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 py-4 pl-1">
              <p className="block antialiased font-sans text-sm text-blue-gray-900 font-normal leading-none opacity-70">
                Category
              </p>
            </th>
            <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 py-4 pl-1">
              <p className="block antialiased font-sans text-sm text-blue-gray-900 font-normal leading-none opacity-70">
                Price
              </p>
            </th>
            <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 py-4 pl-1">
              <p className="block antialiased font-sans text-sm text-blue-gray-900 font-normal leading-none opacity-70">
                Status
              </p>
            </th>
            <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 py-4 pl-1">
              <p className="block antialiased font-sans text-sm text-blue-gray-900 font-normal leading-none opacity-70">
                Actions
              </p>
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredVehicles.slice(0, visibleVehicles).map((vehicle) => (
            <tr key={vehicle._id}>
              {/* vehicle image and name */}
              <td className="border-b border-blue-gray-50 pl-2">
                <div className="flex items-center gap-3">
                  <img
                    src={vehicle.image}
                    alt={vehicle.name}
                    className="inline-block relative object-center w-10 h-10 rounded-full border border-blue-gray-50 bg-blue-gray-50/50 object-cover"
                  />
                  <p className="block antialiased font-sans text-sm leading-normal text-blue-gray-900 font-bold">
                    {vehicle.name}{" "}
                  </p>
                </div>
              </td>
              {/* vehicle category */}
              <td className="border-b border-blue-gray-50">
                <p className="block antialiased font-sans text-sm leading-normal text-blue-gray-900 font-normal">
                  {vehicle.category}{" "}
                </p>
              </td>
              {/* vehicle price */}
              <td className="border-b border-blue-gray-50">
                <p className="block antialiased font-sans text-sm leading-normal text-blue-gray-900 font-normal">
                  $ {vehicle.pricePerDay} /day
                </p>
              </td>
              {/* vehicle status */}
              <td className="border-b border-blue-gray-50">
                <div className="w-max">
                  <div
                    className={`relative grid items-center font-sans font-bold uppercase whitespace-nowrap select-none ${
                      vehicle.status === "available"
                        ? "bg-green-500/20 text-green-900"
                        : vehicle.status === "booked"
                        ? "bg-yellow-500/20 text-yellow-900"
                        : "bg-red-500/20 text-red-900"
                    } py-1 px-2 text-xs rounded-md`}
                  >
                    <span>
                      {vehicle.status === "available"
                        ? "Available"
                        : vehicle.status === "booked"
                        ? "Booked"
                        : "Not available"}
                    </span>
                  </div>
                </div>
              </td>

              {/* vehicle Actions */}
              <td className="border-b border-blue-gray-50">
                <div className="flex gap-2">
                  {/* Edit Button */}
                  <Link
                    to={`/dashboard/update-vehicle/${vehicle._id}`}
                    className="relative align-middle select-none font-sans font-medium text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none w-10 max-w-[40px] h-10 max-h-[40px] rounded-lg text-xs text-blue-gray-900 hover:bg-gray-900/10 active:bg-gray-900/20"
                  >
                    <span className="absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2">
                      <MdEdit size={16} color="blue" />
                    </span>
                  </Link>

                  {/* Delete Button */}
                  <button
                    className="relative align-middle select-none font-sans font-medium text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none w-10 max-w-[40px] h-10 max-h-[40px] rounded-lg text-xs text-gray-900 hover:bg-gray-900/10 active:bg-gray-900/20"
                    type="button"
                    onClick={() => handleDelete(vehicle._id, vehicle.name)}
                  >
                    <span className="absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2">
                      <RiDeleteBinFill size={16} color="red" />
                    </span>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Load More Button */}
      {filteredVehicles.length > visibleVehicles && (
        <div className="flex justify-center mt-4">
          <button
            onClick={loadMoreVehicles}
            className="px-4 py-2 mb-5 bg-amber-500 text-white rounded-md hover:bg-amber-600"
          >
            Load More Vehicles
          </button>
        </div>
      )}

      {/* Delete Modal */}
      <DeleteModal
        showModal={showModal}
        setShowModal={setShowModal}
        handleDelete={handleDeleteVehicle}
        deleteItemType="vehicle"
      />
    </div>
  );
};

export default ManageVehicles;
