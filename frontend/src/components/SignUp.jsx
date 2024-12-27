import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../redux/slices/authSlice";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userData = { username, email, password };

    if (!username || !email || !password) {
      return;
    }
    try {
      await dispatch(registerUser(userData)).unwrap();
      navigate("/sign-in");
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
          Register an account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form
          onSubmit={handleSubmit}
          className="space-y-6"
          action="#"
          method="POST"
        >
          <div>
            <label className="block text-sm/6 font-medium text-gray-900">
              Username
            </label>
            <div className="mt-2">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                name="username"
                id="username"
                required
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-amber-600 sm:text-sm/6"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm/6 font-medium text-gray-900">
              Email address
            </label>
            <div className="mt-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                name="email"
                id="email"
                required
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-amber-600 sm:text-sm/6"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm/6 font-medium text-gray-900">
              Password
            </label>
            <div className="mt-2">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                name="password"
                id="password"
                required
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-amber-600 sm:text-sm/6"
              />
            </div>
          </div>

          {error && error.message && (
            <div className="text-red-500 text-sm mt-2">{error.message}</div>
          )}

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-amber-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-amber-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600"
            >
              Register
            </button>
          </div>
        </form>

        <p className="mt-10 text-center text-sm/6 text-gray-500">
          Already a member?{" "}
          <Link
            to="/sign-in"
            className="font-semibold underline text-amber-600 hover:text-amber-500"
          >
            Log in here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
