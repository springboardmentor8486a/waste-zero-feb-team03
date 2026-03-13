import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; 
import { MessageSquare, Sparkles, LayoutDashboard, LogOut } from "lucide-react";

const Navbar1 = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // --- THE FIX ---
  // If there is no logged-in user, do not render the navbar at all.
  // This removes it from the Landing Page, Login, and Register pages.
  if (!user) {
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
      <Link to="/" className="text-2xl font-bold text-emerald-600 flex items-center gap-2">
        ♻️ WasteZero
      </Link>

      <div className="flex items-center gap-6">
        <Link 
          to={user.role === "volunteer" ? "/dashboard/volunteer" : "/dashboard/ngo"} 
          className="flex items-center gap-1 text-gray-600 hover:text-emerald-600 font-medium transition-colors"
        >
          <LayoutDashboard size={18} /> Dashboard
        </Link>

        {user.role === "volunteer" && (
          <Link to="/matches" className="flex items-center gap-1 text-gray-600 hover:text-emerald-600 font-medium transition-colors">
            <Sparkles size={18} /> Matches
          </Link>
        )}

        <Link to="/chat/messages" className="flex items-center gap-1 text-gray-600 hover:text-emerald-600 font-medium transition-colors">
          <MessageSquare size={18} /> Chats
        </Link>

        <div className="h-6 w-[1px] bg-gray-200 mx-2"></div>

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