import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

// PrivateRoute for Admins
const PrivateRouteAdmin = ({ children }) => {
  const { currentUser } = useSelector((state) => state.auth);
  if (!currentUser || !currentUser.isAdmin) {
    return <Navigate to="/" />;
  }
  return children;
};

// PrivateRoute for Users
const PrivateRouteUser = ({ children }) => {
  const { currentUser } = useSelector((state) => state.auth);
  if (!currentUser || currentUser.isAdmin) {
    return <Navigate to="/" />;
  }

  return children;
};

export { PrivateRouteAdmin, PrivateRouteUser };
