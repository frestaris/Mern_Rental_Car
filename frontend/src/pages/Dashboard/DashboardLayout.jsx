import { useState } from "react";
import { Link, Outlet } from "react-router-dom";

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen relative">
      {/* Sidebar */}
      <div
        className={`bg-white p-6 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out md:relative md:translate-x-0 w-8/12 md:w-64 z-30 fixed top-0 left-0 bottom-0 mt-16 md:mt-0`}
      >
        <button
          className="block md:hidden fixed top-4 right-4 mb-4 hover:text-amber-600"
          onClick={() => setIsSidebarOpen(false)}
        >
          X
        </button>

        {/* Sidebar content */}
        <ul className="space-y-4">
          <li>
            <Link
              to="/dashboard/manage-vehicles"
              className="hover:text-amber-600 cursor-pointer"
            >
              Manage Vehicles
            </Link>
          </li>
          <li>
            <Link
              to="/dashboard/bookings"
              className="hover:text-amber-600 cursor-pointer"
            >
              Bookings
            </Link>
          </li>
          <li>
            <Link
              to="/dashboard/add-vehicle"
              className="hover:text-amber-600 cursor-pointer"
            >
              Add New Vehicle
            </Link>
          </li>
          <li>
            <Link
              to="/dashboard/users"
              className="hover:text-amber-600 cursor-pointer"
            >
              Users
            </Link>
          </li>
        </ul>
      </div>

      {/* Sidebar Toggle Button for Mobile */}
      <button
        className={`md:hidden z-30 absolute top-0 left-0 bg-white ${
          isSidebarOpen ? "hidden" : ""
        } flex flex-col justify-start h-full pt-2`}
        onClick={() => setIsSidebarOpen(true)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8 md:hidden text-amber-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16m-7 6h7"
          />
        </svg>
      </button>

      {/* Main Content */}
      <div
        className={`flex-1 bg-gray-100 p-8 overflow-y-auto transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "ml-10/12" : "ml-5 md:ml-0"
        }`}
        style={{
          zIndex: "10",
        }}
      >
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
