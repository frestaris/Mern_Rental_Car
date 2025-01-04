import { useEffect, useState } from "react";
import axios from "axios";
import { baseURL } from "../../utils/baseUrl";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import moment from "moment";
import { getCars } from "../../redux/slices/vehicleSlice";
import { useDispatch, useSelector } from "react-redux";
import { getUsers } from "../../redux/slices/usersSlice";

const MainDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const dispatch = useDispatch();
  const { vehicles } = useSelector((state) => state.vehicles);
  const { users } = useSelector((state) => state.users);

  useEffect(() => {
    dispatch(getCars());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/booking/get-bookings`);
        const formattedBookings = response.data.map((booking) => ({
          ...booking,
        }));

        const revenue = formattedBookings.reduce((total, booking) => {
          return total + booking.totalCost;
        }, 0);

        setBookings(formattedBookings);
        setTotalRevenue(revenue);
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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const chartData = bookings
    .map((booking) => ({
      date: moment(booking.startDate).format("D MMM, YYYY"),
      revenue: booking.totalCost,
    }))
    .sort((a, b) =>
      moment(a.date, "D MMM, YYYY").diff(moment(b.date, "D MMM, YYYY"))
    );

  let cumulativeRevenue = 0;
  const cumulativeChartData = chartData.map((dataPoint) => {
    cumulativeRevenue += dataPoint.revenue;
    return { ...dataPoint, cumulativeRevenue };
  });

  return (
    <div>
      {/* Total section with responsive styling */}
      <div className="flex flex-wrap gap-4 m-6 sm:flex-col sm:items-center sm:gap-2 md:flex-row">
        {/* Total Revenue Section */}
        <div className="bg-white flex-1 text-center rounded-lg border p-5 shadow-md mb-4 sm:w-full md:w-auto h-28">
          <h2 className="text-xl font-semibold text-black">Total Revenue:</h2>
          <span className="block text-md font-bold text-gray-600 mt-2">
            ${totalRevenue.toFixed(2)}
          </span>
        </div>

        {/* Total Bookings Section */}
        <div className="bg-white flex-1 text-center rounded-lg border p-5 shadow-md mb-4 sm:w-full md:w-auto h-28">
          <h2 className="text-xl font-semibold text-black">Total Bookings:</h2>
          <span className="block text-md font-bold text-gray-600 mt-2">
            {bookings.length}
          </span>
        </div>

        {/* Total Vehicles Section */}
        <div className="bg-white flex-1 text-center rounded-lg border p-5 shadow-md mb-4 sm:w-full md:w-auto h-28">
          <h2 className="text-xl font-semibold text-black">Total Vehicles:</h2>
          <span className="block text-md font-bold text-gray-600 mt-2">
            {vehicles.length}
          </span>
        </div>

        {/* Total Users Section */}
        <div className="bg-white flex-1 text-center rounded-lg border p-5 shadow-md mb-4 sm:w-full md:w-auto h-28">
          <h2 className="text-xl font-semibold text-black">Total Users:</h2>
          <span className="block text-md font-bold text-gray-600 mt-2">
            {users.length}
          </span>
        </div>
      </div>

      {/* Chart Section */}
      <div className="w-full h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={cumulativeChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip
              labelFormatter={(value) => `Date: ${value}`}
              formatter={(value, name) => {
                if (name === "revenue") {
                  return [`$${value.toFixed(2)}`, "Booking Price"];
                } else if (name === "cumulativeRevenue") {
                  return [`$${value.toFixed(2)}`, "Total Revenue"];
                }
              }}
            />
            <Legend
              formatter={(value) => {
                if (value === "revenue") {
                  return "Booking Price";
                } else if (value === "cumulativeRevenue") {
                  return "Total Revenue";
                }
                return value;
              }}
            />
            <Line dataKey="revenue" stroke="#ffb300" />
            <Line dataKey="cumulativeRevenue" stroke="#0044cc" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MainDashboard;
