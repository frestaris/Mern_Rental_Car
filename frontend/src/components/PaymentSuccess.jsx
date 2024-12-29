import { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { baseURL } from "../utils/baseUrl";

const PaymentSuccess = () => {
  const location = useLocation();
  const sessionId = new URLSearchParams(location.search).get("session_id");

  const [loading, setLoading] = useState(false);
  const [booking, setBooking] = useState(null);
  const [error, setError] = useState(null);

  const hasCreatedBooking = useRef(false);

  useEffect(() => {
    const createBooking = async () => {
      if (sessionId && !hasCreatedBooking.current) {
        setLoading(true);
        hasCreatedBooking.current = true;
        try {
          const response = await axios.post(
            `${baseURL}/api/booking/payment-success?session_id=${sessionId}`
          );

          if (response.data) {
            setBooking(response.data);
          } else {
            const createResponse = await axios.post(
              `${baseURL}/api/booking/payment-success`,
              { session_id: sessionId }
            );
            setBooking(createResponse.data);
          }
        } catch (err) {
          console.error("Error creating booking:", err);
          setError(err.response?.data?.message || "Something went wrong.");
        } finally {
          setLoading(false);
        }
      }
    };

    createBooking();

    return () => {
      setError(null);
    };
  }, [sessionId]);

  if (loading) {
    return <div>Processing your payment...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Payment Successful</h2>
      <p>Your booking has been confirmed.</p>
      {booking && (
        <div>
          <h3>Booking Details:</h3>
          <p>Car: {booking.car.name}</p>
          <p>Pickup Location: {booking.pickupLocation}</p>
          <p>Dropoff Location: {booking.dropoffLocation}</p>
          <p>Total Cost: ${booking.totalCost}</p>
        </div>
      )}
    </div>
  );
};

export default PaymentSuccess;
