import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, Outlet, useLocation } from "react-router-dom";
import { signoutSuccess } from "../../redux/slices/authSlice";

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(signoutSuccess());
  };

  const links = [
    { path: "/dashboard", label: "Dashboard" },
    { path: "/dashboard/add-vehicle", label: "Add New Vehicle" },
    { path: "/dashboard/manage-vehicles", label: "Manage Vehicles" },
    { path: "/dashboard/manage-users", label: "Manage Users" },
    { path: "/dashboard/bookings", label: "Bookings" },
  ];

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
          {links.map((link) => (
            <li key={link.path}>
              <Link
                to={link.path}
                className={`relative text-gray-600 hover:text-gray-800 font-medium transition-colors ${
                  location.pathname === link.path
                    ? "text-gray-800 after:content-[''] after:absolute after:left-0 after:bottom-[-3px] after:w-full after:h-[3px] after:bg-amber-600 after:transition-all after:duration-300"
                    : "after:content-[''] after:absolute after:left-1/2 after:bottom-[-3px] after:w-0 after:h-[3px] after:bg-amber-600 after:transition-all after:duration-300 hover:after:w-full hover:after:left-0"
                }`}
                onClick={() => setIsSidebarOpen(false)}
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li>
            <button
              onClick={handleLogout}
              className="text-red-600 hover:text-red-800 font-medium"
            >
              Logout
            </button>
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
        className={`flex-1 bg-gray-100  overflow-y-auto transition-all duration-300 ease-in-out ${
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
