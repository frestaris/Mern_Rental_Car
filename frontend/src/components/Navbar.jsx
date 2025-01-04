import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signoutSuccess } from "../redux/slices/authSlice";
import logo from "../../public/logo.png";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(signoutSuccess());
  };

  return (
    <nav className="bg-white shadow-md w-full z-50 sticky top-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <img
              className="w-32 h-32 object-cover"
              src={logo}
              alt="Car Rental Logo"
            />
          </div>

          {/* Links */}
          <div className="hidden md:flex space-x-8">
            {["Home", "Vehicles", "About", "Contact"].map((link) => (
              <NavLink
                key={link}
                to={link === "Home" ? "/" : `/${link.toLowerCase()}`}
                className={({ isActive }) =>
                  `relative text-gray-600 hover:text-gray-800 font-medium transition-colors ${
                    isActive
                      ? "text-gray-800 after:content-[''] after:absolute after:left-0 after:bottom-[-3px] after:w-full after:h-[3px] after:bg-amber-600 after:transition-all after:duration-300"
                      : "after:content-[''] after:absolute after:left-1/2 after:bottom-[-3px] after:w-0 after:h-[3px] after:bg-amber-600 after:transition-all after:duration-300 hover:after:w-full hover:after:left-0"
                  }`
                }
              >
                {link}
              </NavLink>
            ))}

            {/* Conditional Links */}
            {currentUser && currentUser?.isAdmin && (
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `relative text-gray-600 hover:text-gray-800 font-medium transition-colors ${
                    isActive
                      ? "text-gray-800 after:content-[''] after:absolute after:left-0 after:bottom-[-3px] after:w-full after:h-[3px] after:bg-amber-600 after:transition-all after:duration-300"
                      : "after:content-[''] after:absolute after:left-1/2 after:bottom-[-3px] after:w-0 after:h-[3px] after:bg-amber-600 after:transition-all after:duration-300 hover:after:w-full hover:after:left-0"
                  }`
                }
              >
                Dashboard
              </NavLink>
            )}

            {currentUser && !currentUser?.isAdmin && (
              <NavLink
                to="/user-booking"
                className={({ isActive }) =>
                  `relative text-gray-600 hover:text-gray-800 font-medium transition-colors ${
                    isActive
                      ? "text-gray-800 after:content-[''] after:absolute after:left-0 after:bottom-[-3px] after:w-full after:h-[3px] after:bg-amber-600 after:transition-all after:duration-300"
                      : "after:content-[''] after:absolute after:left-1/2 after:bottom-[-3px] after:w-0 after:h-[3px] after:bg-amber-600 after:transition-all after:duration-300 hover:after:w-full hover:after:left-0"
                  }`
                }
              >
                Your Bookings
              </NavLink>
            )}

            {/* Sign In / Log Out */}
            {currentUser ? (
              <button
                onClick={handleLogout}
                className="text-red-600 hover:text-red-800 font-medium"
              >
                Logout
              </button>
            ) : (
              <NavLink
                to="/sign-in"
                className="text-gray-600 hover:text-gray-800 font-medium"
              >
                Sign In
              </NavLink>
            )}
          </div>

          {/* Hamburger Menu */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-gray-800 focus:outline-none"
            >
              <svg
                className="h-8 w-8 stroke-amber-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16m-7 6h7"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-md">
          <div className="space-y-3 px-4 pt-2 pb-3">
            {["Home", "Vehicles", "About", "Contact"].map((link) => (
              <NavLink
                key={link}
                to={link === "Home" ? "/" : `/${link.toLowerCase()}`}
                className={({ isActive }) =>
                  `relative block text-gray-600 hover:text-gray-800 font-medium transition-colors ${
                    isActive
                      ? "text-gray-800 after:content-[''] after:absolute after:left-0 after:bottom-[-3px] after:w-2/12 after:h-[3px] after:bg-amber-600 after:transition-all after:duration-300"
                      : "after:content-[''] after:absolute after:left-0 after:bottom-[-3px] after:w-0 after:h-[3px] after:bg-amber-600 after:transition-all after:duration-300 hover:after:w-2/12 hover:after:left-0"
                  }`
                }
                onClick={() => setIsOpen(false)}
              >
                {link}
              </NavLink>
            ))}
            {currentUser && currentUser?.isAdmin && (
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `relative block text-gray-600 hover:text-gray-800 font-medium transition-colors ${
                    isActive
                      ? "text-gray-800 after:content-[''] after:absolute after:left-0 after:bottom-[-3px] after:w-2/12 after:h-[3px] after:bg-amber-600 after:transition-all after:duration-300"
                      : "after:content-[''] after:absolute after:left-0 after:bottom-[-3px] after:w-0 after:h-[3px] after:bg-amber-600 after:transition-all after:duration-300 hover:after:w-2/12 hover:after:left-0"
                  }`
                }
                onClick={() => setIsOpen(false)}
              >
                Dashboard
              </NavLink>
            )}

            {currentUser && !currentUser?.isAdmin && (
              <NavLink
                to="/bookings"
                className={({ isActive }) =>
                  `relative block text-gray-600 hover:text-gray-800 font-medium transition-colors ${
                    isActive
                      ? "text-gray-800 after:content-[''] after:absolute after:left-0 after:bottom-[-3px] after:w-2/12 after:h-[3px] after:bg-amber-600 after:transition-all after:duration-300"
                      : "after:content-[''] after:absolute after:left-0 after:bottom-[-3px] after:w-0 after:h-[3px] after:bg-amber-600 after:transition-all after:duration-300 hover:after:w-2/12 hover:after:left-0"
                  }`
                }
              >
                Bookings
              </NavLink>
            )}

            {/* Sign In / Log Out Buttons */}
            <div>
              {currentUser ? (
                <button
                  onClick={handleLogout}
                  className="text-red-600 hover:text-red-800 font-medium"
                >
                  Log Out
                </button>
              ) : (
                <NavLink
                  to="/sign-in"
                  className="text-gray-600 hover:text-gray-800 font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  Sign In
                </NavLink>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
