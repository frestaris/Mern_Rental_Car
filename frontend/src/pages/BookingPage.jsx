import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import { baseURL } from "../utils/baseUrl";

const BookingPage = () => {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = useSelector((state) => state.auth.currentUser?.token);
  const currentUser = useSelector((state) => state.auth.currentUser);

  useEffect(() => {
    const fetchBooking = async () => {
      if (!token) {
        setError("No token, please login first.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `${baseURL}/api/booking/get-booking/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setBooking(response.data);
        setLoading(false);
      } catch (err) {
        setError("Error fetching booking details.");
        setLoading(false);
        console.log(err);
      }
    };

    fetchBooking();
  }, [id, token]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center my-6 text-3xl font-bold">
        {error}
      </div>
    );
  }

  if (!booking) {
    return <div>Booking not found</div>;
  }

  const {
    pickupLocation,
    dropoffLocation,
    startDate,
    endDate,
    car,
    totalCost,
  } = booking;

  const { name: vehicleName, category, pricePerDay, image } = car;

  return (
    <div className="p-8 bg-white rounded-lg shadow-xl ">
      <h2 className="text-3xl font-semibold text-gray-800 mb-6 border-b-4 border-amber-500 pb-2">
        Review Booking
      </h2>

      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Booking Details */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              Booking Details
            </h2>
            <strong className="text-amber-600">Booking ID:</strong>
            <p className="text-gray-600">{id}</p>
            {/* Pickup and Dropoff Locations */}
            <div className="grid grid-cols-2 gap-6 mb-6 mt-6">
              <div>
                <strong className="text-amber-600">Pickup Location:</strong>
                <p className="text-gray-600">{pickupLocation}</p>
              </div>
              <div>
                <strong className="text-amber-600">Dropoff Location:</strong>
                <p className="text-gray-600">{dropoffLocation}</p>
              </div>
            </div>

            {/* Pickup Date, Pickup Time, Dropoff Date, and Dropoff Time */}
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <strong className="text-amber-600">Pickup Date:</strong>
                <p className="text-gray-600">
                  {startDate && new Date(startDate).toLocaleDateString()}
                </p>
              </div>
              <div>
                <strong className="text-amber-600">Dropoff Date:</strong>
                <p className="text-gray-600">
                  {endDate && new Date(endDate).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <strong className="text-amber-600">Pickup Time:</strong>
                <p className="text-gray-600">
                  {startDate &&
                    new Date(startDate).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                </p>
              </div>
              <div>
                <strong className="text-amber-600">Dropoff Time:</strong>
                <p className="text-gray-600">
                  {endDate &&
                    new Date(endDate).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                </p>
              </div>
            </div>

            <div>
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
                  <strong className="text-amber-600">Price per Day: </strong> $
                  {pricePerDay}
                </p>
                <p>
                  <strong className="text-amber-600">Total Cost:</strong> $
                  {totalCost}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
