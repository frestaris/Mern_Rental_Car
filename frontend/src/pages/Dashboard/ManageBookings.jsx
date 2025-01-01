import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { deleteBooking } from "../../redux/slices/bookingSlice";
import { RiDeleteBinFill } from "react-icons/ri";
import { FaSearch } from "react-icons/fa";
import DeleteModal from "../../components/DeleteModal";
import { toast } from "react-toastify";
import axios from "axios";
import moment from "moment";
import { baseURL } from "../../utils/baseUrl";
import { Link } from "react-router-dom";

const ManageBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleBookings, setVisibleBookings] = useState(10);

  const [showModal, setShowModal] = useState(false);
  const [bookingToDelete, setBookingToDelete] = useState(null);

  const loadMoreBookings = () => {
    setVisibleBookings((prevCount) => prevCount + 5);
  };
  const handleDelete = (bookingId) => {
    setBookingToDelete(bookingId);
    setShowModal(true);
  };

  const handleDeleteBooking = () => {
    if (bookingToDelete) {
      dispatch(deleteBooking(bookingToDelete))
        .then(() => {
          setShowModal(false);
          setBookingToDelete(null);
          toast.success("Booking deleted successfully!");

          setBookings((prevBookings) =>
            prevBookings.filter((booking) => booking._id !== bookingToDelete)
          );
        })
        .catch((error) => {
          toast.error("Error deleting booking: " + error.message);
        });
    }
  };

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/booking/get-bookings`);
        const formattedBookings = response.data.map((booking) => ({
          ...booking,
          startDate: moment(booking.startDate).format("YYYY-MM-DD"),
          endDate: moment(booking.endDate).format("YYYY-MM-DD"),
        }));
        setBookings(formattedBookings);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching bookings:", err);
        setError(
          err.response ? err.response.data.message : "Something went wrong."
        );
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const filteredBookings = bookings.filter((booking) => {
    return (
      (booking.user.username &&
        booking.user.username
          .toLowerCase()
          .includes(searchQuery.toLowerCase())) ||
      (booking.car.name &&
        booking.car.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (booking.status &&
        booking.status.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  if (loading) {
    return <div>Loading bookings...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <div className="relative">
        <input
          type="text"
          placeholder="Search bookings..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="m-2 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-transparent w-6/12 border border-gray-300 rounded-lg p-3 pl-10"
        />
        <FaSearch
          className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-500"
          size={18}
        />
      </div>
      <table className="w-full min-w-max md:m-0 ml-2 table-auto text-left">
        <thead>
          <tr>
            <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 py-4 pl-1">
              <p className="block antialiased font-sans text-sm text-blue-gray-900 font-normal leading-none opacity-70">
                Customer
              </p>
            </th>
            <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 py-4 pl-1">
              <p className="block antialiased font-sans text-sm text-blue-gray-900 font-normal leading-none opacity-70">
                Vehicle
              </p>
            </th>
            <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 py-4 pl-1">
              <p className="block antialiased font-sans text-sm text-blue-gray-900 font-normal leading-none opacity-70">
                Date
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
          {filteredBookings.slice(0, visibleBookings).map((booking) => (
            <tr key={booking._id}>
              {/* Customer name */}
              <td className="border-b border-blue-gray-50 pl-2">
                <div className="flex items-center gap-3">
                  <p className="block antialiased font-sans text-sm leading-normal text-blue-gray-900 font-bold">
                    {booking.user?.username || "Unknown"}{" "}
                  </p>
                </div>
              </td>
              {/* Vehicle name */}
              <td className="border-b border-blue-gray-50">
                <p className="block antialiased font-sans text-sm leading-normal text-blue-gray-900 font-normal">
                  {booking.car?.name || "Unknown Vehicle"}{" "}
                </p>
              </td>
              {/* Start Date - End Date */}
              <td className="border-b border-blue-gray-50">
                <p className="block antialiased font-sans text-sm leading-normal text-blue-gray-900 font-normal">
                  {moment(booking.startDate).isValid()
                    ? moment(booking.startDate).format("MMM D, YYYY")
                    : "Invalid Start Date"}{" "}
                  -{" "}
                  {moment(booking.endDate).isValid()
                    ? moment(booking.endDate).format("MMM D, YYYY")
                    : "Invalid End Date"}
                </p>
              </td>

              {/* Booking status */}
              <td className="border-b border-blue-gray-50">
                <div className="w-max">
                  <div
                    className={`relative grid items-center font-sans font-bold uppercase whitespace-nowrap select-none ${
                      booking.status === "confirmed"
                        ? "bg-green-500/20 text-green-900"
                        : booking.status === "pending"
                        ? "bg-yellow-500/20 text-yellow-900"
                        : "bg-red-500/20 text-red-900"
                    } py-1 px-2 text-xs rounded-md`}
                  >
                    <span>{booking.status}</span>
                  </div>
                </div>
              </td>
              {/* Booking Actions */}
              <td className="border-b border-blue-gray-50">
                <div className="flex items-center gap-3">
                  {/* View Booking Link */}
                  <Link
                    to={`/booking/${bookings[0]?._id}`}
                    className="underline text-blue-500"
                  >
                    View
                  </Link>

                  {/* Delete Button */}
                  <button
                    className="relative align-middle select-none font-sans font-medium text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none w-10 max-w-[40px] h-10 max-h-[40px] rounded-lg text-xs text-gray-900 hover:bg-gray-900/10 active:bg-gray-900/20"
                    type="button"
                    onClick={() => handleDelete(booking._id)}
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
      {filteredBookings.length > visibleBookings && (
        <div className="flex justify-center mt-4">
          <button
            onClick={loadMoreBookings}
            className="px-4 py-2 mb-5 bg-amber-500 text-white rounded-md hover:bg-amber-600"
          >
            Load More Bookings
          </button>
        </div>
      )}

      {/* Delete Modal */}
      {showModal && (
        <DeleteModal
          showModal={showModal}
          setShowModal={setShowModal}
          handleDelete={handleDeleteBooking}
          deleteItemType="booking"
        />
      )}
    </div>
  );
};

export default ManageBookings;
