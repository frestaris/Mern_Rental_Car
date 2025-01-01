import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUsers, deleteUser } from "../../redux/slices/usersSlice";
import { MdEdit } from "react-icons/md";
import { RiDeleteBinFill } from "react-icons/ri";
import { FaSearch } from "react-icons/fa";
import DeleteModal from "../../components/DeleteModal";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const ManageUsers = () => {
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleUsers, setVisibleUsers] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const { users, status, error } = useSelector((state) => state.users);
  const handleDelete = (userId) => {
    setUserToDelete(userId);
    setShowModal(true);
  };

  const handleDeleteUser = () => {
    if (userToDelete) {
      dispatch(deleteUser(userToDelete));
      setShowModal(false);
      setUserToDelete(null);
      toast.success("User deleted successfully!");
    }
  };

  const loadMoreUsers = () => {
    setVisibleUsers((prevCount) => prevCount + 5);
  };

  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);

  const filteredUsers = users.filter((user) => {
    const userName = user.name || "";
    const userEmail = user.email || "";

    return (
      userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      userEmail.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  if (status === "loading") {
    return <div>Loading users...</div>;
  }

  if (status === "failed") {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <div className="relative">
        <input
          type="text"
          placeholder="Search users..."
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
                Username
              </p>
            </th>
            <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 py-4 pl-1">
              <p className="block antialiased font-sans text-sm text-blue-gray-900 font-normal leading-none opacity-70">
                Email
              </p>
            </th>
            <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 py-4 pl-1">
              <p className="block antialiased font-sans text-sm text-blue-gray-900 font-normal leading-none opacity-70">
                Role
              </p>
            </th>
            <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 py-4 pl-1">
              <p className="block antialiased font-sans text-sm text-blue-gray-900 font-normal leading-none opacity-70">
                Bookings
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
          {filteredUsers.slice(0, visibleUsers).map((user) => (
            <tr key={user._id}>
              {/* User name */}
              <td className="border-b border-blue-gray-50 pl-2">
                <div className="flex items-center gap-3">
                  <p className="block antialiased font-sans text-sm leading-normal text-blue-gray-900 font-bold">
                    {user.username}
                  </p>
                </div>
              </td>
              {/* User email */}
              <td className="border-b border-blue-gray-50">
                <p className="block antialiased font-sans text-sm leading-normal text-blue-gray-900 font-normal">
                  {user.email}
                </p>
              </td>
              {/* User Role */}
              <td className="border-b border-blue-gray-50">
                <div className="w-max">
                  <div
                    className={`relative grid items-center font-sans font-bold uppercase whitespace-nowrap select-none ${
                      user.isAdmin
                        ? "bg-blue-500/20 text-blue-900"
                        : "bg-green-500/20 text-green-900"
                    } py-1 px-2 text-xs rounded-md`}
                  >
                    <span>{user.isAdmin ? "Admin" : "User"}</span>
                    {/* Display User or Admin */}
                  </div>
                </div>
              </td>

              {/* User Bookings */}
              <td className="border-b border-blue-gray-50">
                <div className="w-max">
                  {user.bookings.length > 0 ? (
                    <Link
                      to={`/booking/${user.bookings[0]?._id}`}
                      className="underline text-blue-500"
                    >
                      View Booking
                    </Link>
                  ) : (
                    <span className="text-gray-500">No bookings</span> // Display a message if no bookings
                  )}
                </div>
              </td>

              {/* User actions */}
              <td className="border-b border-blue-gray-50">
                <div className="flex gap-2">
                  {/* Edit Button */}
                  <Link
                    to={`/dashboard/update-user/${user._id}`}
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
                    onClick={() => handleDelete(user._id, user.name)}
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
      {filteredUsers.length > visibleUsers && (
        <div className="text-center mt-4">
          <button
            onClick={loadMoreUsers}
            className="px-4 py-2 mb-5 bg-amber-500 text-white rounded-md hover:bg-amber-600"
          >
            Load More Users
          </button>
        </div>
      )}
      {/* Delete Modal */}
      <DeleteModal
        showModal={showModal}
        setShowModal={setShowModal}
        handleDelete={handleDeleteUser}
        deleteItemType="user"
      />
    </div>
  );
};

export default ManageUsers;
