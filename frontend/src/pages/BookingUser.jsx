import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { baseURL } from "../utils/baseUrl";
import DeleteModal from "../components/DeleteModal";
import { toast } from "react-toastify";
import { deleteBooking } from "../redux/slices/bookingSlice";
import Spinner from "../components/Spinner";

const BookingUser = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [bookingToDelete, setBookingToDelete] = useState(null);

  const token = useSelector((state) => state.auth.currentUser?.token);
  const currentUser = useSelector((state) => state.auth.currentUser);
  const dispatch = useDispatch();

  const handleDelete = (bookingId) => {
    setBookingToDelete(bookingId);
    setShowModal(true);
  };

  const handleDeleteBooking = async () => {
    if (bookingToDelete) {
      dispatch(deleteBooking(bookingToDelete))
        .then(() => {
          setShowModal(false);
          setBookingToDelete(null);
          toast.success("Booking deleted successfully!");
          setBookings(
            bookings.filter((booking) => booking._id !== bookingToDelete)
          );
        })
        .catch((error) => {
          toast.error("Error deleting booking: " + error.message);
        });
    }
  };

  useEffect(() => {
    const fetchBookings = async () => {
      if (!token) {
        setError("No token, please login first.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `${baseURL}/api/booking/user/${currentUser._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setLoading(false);
        if (response.data.length === 0) {
          setBookings([]);
        } else {
          setBookings(response.data);
        }
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || "Error fetching booking details.";
        setError(errorMessage);
        setLoading(false);
      }
    };

    fetchBookings();
  }, [token, currentUser._id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center mt-20">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="p-8 bg-white rounded-lg shadow-xl">
      <h2 className="text-3xl font-semibold text-gray-800 border-b-4 border-amber-500 pb-2 mb-6">
        Review Bookings
      </h2>

      {bookings.map((booking) => {
        const {
          pickupLocation,
          dropoffLocation,
          startDate,
          endDate,
          pickupTime,
          dropoffTime,
          car,
          totalCost,
        } = booking;

        const { name: vehicleName, category, pricePerDay, image } = car;

        return (
          <div
            key={booking._id}
            className="relative flex justify-between items-center mb-6 border-b-4 border-amber-500"
          >
            {/* Delete Button */}
            <button
              className="absolute top-0 right-0 bg-red-600 text-white px-3 py-1 rounded-full hover:bg-red-700 transition duration-300"
              onClick={() => handleDelete(booking._id)}
            >
              X
            </button>

            <div className="w-full flex items-center space-x-8">
              {/* Vehicle and Booking Details */}
              <div className="space-y-8 w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                      Booking Details
                    </h2>
                    <strong className="text-amber-600">Booking ID:</strong>
                    <p className="text-gray-600 mb-5">{booking._id}</p>
                    {/* Pickup and Dropoff Locations */}
                    <div className="grid grid-cols-2 gap-6 mb-6">
                      <div>
                        <strong className="text-amber-600">
                          Pickup Location:
                        </strong>
                        <p className="text-gray-600">{pickupLocation}</p>
                      </div>
                      <div>
                        <strong className="text-amber-600">
                          Dropoff Location:
                        </strong>
                        <p className="text-gray-600">{dropoffLocation}</p>
                      </div>
                    </div>

                    {/* Pickup and Dropoff Dates */}
                    <div className="grid grid-cols-2 gap-6 mb-6">
                      <div>
                        <strong className="text-amber-600">Pickup Date:</strong>
                        <p className="text-gray-600">
                          {startDate &&
                            new Date(startDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <strong className="text-amber-600">
                          Dropoff Date:
                        </strong>
                        <p className="text-gray-600">
                          {endDate && new Date(endDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {/* Pickup and Dropoff Times */}
                    <div className="grid grid-cols-2 gap-6 mb-6">
                      <div>
                        <strong className="text-amber-600">Pickup Time:</strong>
                        <p className="text-gray-600">{pickupTime}</p>
                      </div>
                      <div>
                        <strong className="text-amber-600">
                          Dropoff Time:
                        </strong>
                        <p className="text-gray-600">{dropoffTime}</p>
                      </div>
                    </div>

                    <div className="mb-5">
                      <strong className="text-amber-600">Email:</strong>
                      <p className="text-gray-600">{currentUser.email}</p>
                    </div>
                  </div>

                  {/* Vehicle Details */}
                  <div>
                    <h3 className="text-2xl font-semibold text-gray-700 mb-4">
                      Vehicle Details
                    </h3>
                    <div className="flex flex-col md:flex-row">
                      {/* Vehicle Image */}
                      <div className="mt-4 md:mt-0 md:mr-6">
                        <img src={image} alt={vehicleName} className="w-auto" />
                      </div>

                      {/* Vehicle Information */}
                      <div className="text-lg text-gray-600 md:m-0 mt-6 space-y-2">
                        <p>
                          <strong className="text-amber-600">Vehicle:</strong>{" "}
                          {vehicleName}
                        </p>
                        <p>
                          <strong className="text-amber-600">Category:</strong>{" "}
                          {category}
                        </p>
                        <p>
                          <strong className="text-amber-600">
                            Price per Day:{" "}
                          </strong>
                          ${pricePerDay}
                        </p>
                        <p>
                          <strong className="text-amber-600">
                            Total Cost:
                          </strong>{" "}
                          ${new Intl.NumberFormat().format(totalCost)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}

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

export default BookingUser;
