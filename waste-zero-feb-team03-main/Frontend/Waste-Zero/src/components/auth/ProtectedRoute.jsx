import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ProtectedRoute = ({ children, role }) => {
  // Destructure 'loading' from your updated AuthContext
  const { user, loading } = useAuth();

  // 1. If we are still checking for the token/user, don't redirect yet!
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  // 2. Only if loading is done and there is NO user, send to home/login
  if (!user) return <Navigate to="/" replace />;

  // 3. Role-based access control
  if (role && user.role.toLowerCase() !== role.toLowerCase()) {
    return <Navigate to="/profile" replace />;
  }

  return children;
};

export default ProtectedRoute;
