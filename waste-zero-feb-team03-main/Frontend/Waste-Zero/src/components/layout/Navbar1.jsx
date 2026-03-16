import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { MessageSquare, Sparkles, LayoutDashboard, LogOut, Users } from "lucide-react";

const Navbar1 = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const role = user.role?.toLowerCase();
  const dashboardPath = role === "ngo" ? "/dashboard/ngo" : "/dashboard/volunteer";

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
      <Link to="/" className="text-2xl font-bold text-emerald-600 flex items-center gap-2">
        ♻️ WasteZero
      </Link>

      <div className="flex items-center gap-6">
        <Link
          to={dashboardPath}
          className="flex items-center gap-1 text-gray-600 hover:text-emerald-600 font-medium transition-colors"
        >
          <LayoutDashboard size={18} /> Dashboard
        </Link>

        {/* Volunteers see: matched opportunities */}
        {role === "volunteer" && (
          <Link
            to="/matches"
            className="flex items-center gap-1 text-gray-600 hover:text-emerald-600 font-medium transition-colors"
          >
            <Sparkles size={18} /> My Matches
          </Link>
        )}

        {/* NGOs see: matched volunteers */}
        {role === "ngo" && (
          <Link
            to="/ngo/matches"
            className="flex items-center gap-1 text-gray-600 hover:text-emerald-600 font-medium transition-colors"
          >
            <Users size={18} /> Volunteer Matches
          </Link>
        )}

        <Link
          to="/chat/messages"
          className="flex items-center gap-1 text-gray-600 hover:text-emerald-600 font-medium transition-colors"
        >
          <MessageSquare size={18} /> Chats
        </Link>

        <div className="h-6 w-[1px] bg-gray-200 mx-2" />

        <button
          onClick={handleLogout}
          className="flex items-center gap-1 text-red-500 hover:text-red-600 font-medium transition-colors"
        >
          <LogOut size={18} /> Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar1;
