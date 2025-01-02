import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { baseURL } from "../utils/baseUrl";

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const sessionId = new URLSearchParams(location.search).get("session_id");

  const [loading, setLoading] = useState(false);
  const [booking, setBooking] = useState(null);
  const [error, setError] = useState(null);
  const [countdown, setCountdown] = useState(5);
  const [redirecting, setRedirecting] = useState(false); // Added state for redirect control

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
  }, [sessionId]);

  useEffect(() => {
    if (booking && !redirecting) {
      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev > 1) {
            return prev - 1;
          } else {
            clearInterval(interval);
            setRedirecting(true); // Ensure redirect happens after countdown ends
            return 0;
          }
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [booking, redirecting]);

  useEffect(() => {
    if (redirecting) {
      navigate("/user-booking"); // Trigger navigation after countdown is done
    }
  }, [redirecting, navigate]); // Add redirecting as dependency

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg font-semibold text-amber-500">
          Processing your payment...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg font-semibold text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50 p-6">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-3xl">
        <h2 className="text-2xl font-bold text-green-600 text-center mb-4">
          Payment Successful
        </h2>
        <p className="text-center text-gray-700 mb-6">
          Your booking has been confirmed. Thank you for choosing our service!
        </p>
        {booking && (
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg text-center font-semibold text-gray-800 mb-4">
              Redirecting in {countdown} second{countdown > 1 ? "s" : ""}...
            </h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;
