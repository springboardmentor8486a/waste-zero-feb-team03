import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ProtectedRoute = ({ children, role }) => {
  // Destructure 'user' and 'loading' from your AuthContext
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

  // 3. FIX: Role-based access control with .trim() 
  // This handles the "admin " vs "admin" mismatch from your MongoDB
  const userRole = user.role?.toLowerCase().trim();
  const requiredRole = role?.toLowerCase().trim();

  if (role && userRole !== requiredRole) {
    // If roles don't match, send to profile
    return <Navigate to="/profile" replace />;
  }

  return children;
};

export default ProtectedRoute;
