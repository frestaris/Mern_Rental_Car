import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserById, updateUser } from "../../redux/slices/usersSlice";
import Swal from "sweetalert2"; // Import SweetAlert2
import { useParams } from "react-router-dom";

const UpdateUser = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
  });

  const dispatch = useDispatch();
  const { status, error, currentUser } = useSelector((state) => state.users);

  useEffect(() => {
    if (id) {
      dispatch(getUserById(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (currentUser) {
      setFormData({
        username: currentUser.username || "",
        email: currentUser.email || "",
      });
    }
  }, [currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedFormData = {
      ...formData,
    };

    dispatch(updateUser({ id, userData: updatedFormData }));

    if (status === "succeeded") {
      // Show success message with SweetAlert2
      Swal.fire({
        title: "Success!",
        text: "User updated successfully!",
        icon: "success",
        confirmButtonText: "Close",
        timer: 1500,
        showConfirmButton: false,
      });
    } else if (status === "failed" && error) {
      Swal.fire({
        title: "Error!",
        text: `Error: ${error}`,
        icon: "error",
        confirmButtonText: "Close",
      });
    }
  };

  return (
    <div className="w-full p-8">
      <h1 className="text-2xl font-bold mb-4">Update User</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label className="block font-medium mb-1" htmlFor="username">
            Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white w-full border border-gray-300 rounded-lg px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block font-medium mb-1" htmlFor="email">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white w-full border border-gray-300 rounded-lg px-3 py-2"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 mt-3"
        >
          Update User
        </button>
      </form>
    </div>
  );
};

export default UpdateUser;
