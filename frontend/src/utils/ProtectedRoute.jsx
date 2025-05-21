import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = () => {
  const { user } = useSelector((state) => state.auth);
  // console.log("User from redux",user)

  // Fallback to localStorage if Redux is empty
  const storedUser = localStorage.getItem("user");
  const userData = user || (storedUser && JSON.parse(storedUser));

  return userData ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
