import {
  LayoutDashboard,
  Calendar,
  Briefcase,
  MessageSquare,
  Leaf,
  User,
  Settings,
  HelpCircle,
  Shield,
  LogOut,
  Sun,
  Moon
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  // Determine dashboard path based on user role
  const dashboardPath = user?.role?.toLowerCase() === "ngo" 
    ? "/dashboard/ngo" 
    : "/dashboard/volunteer";

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: dashboardPath },
    { icon: Calendar, label: "Schedule Pickup", path: "/schedule" },
    { icon: Briefcase, label: "Opportunities", path: "/opportunities" },
    { icon: MessageSquare, label: "Messages", path: "/messages" },
    { icon: Leaf, label: "My Impact", path: "/impact" },
  ];

  const settingsItems = [
    { icon: User, label: "My Profile", path: "/profile" },
    { icon: Settings, label: "Settings", path: "/settings" },
    { icon: HelpCircle, label: "Help & Support", path: "/support" },
    { icon: Shield, label: "Admin Panel", path: "/admin" },
  ];

  const NavItem = ({ item }) => {
    // Special handling for Dashboard to highlight both /dashboard/ngo and /dashboard/volunteer
    const isActive = item.label === "Dashboard" 
      ? location.pathname.startsWith("/dashboard")
      : location.pathname.startsWith(item.path);
    
    return (
      <Link
        to={item.path}
        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
            ? "text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20"
            : "text-gray-400 hover:text-emerald-500 hover:bg-gray-50 dark:hover:bg-gray-800"
          }`}
      >
        <item.icon size={20} />
        <span className="font-medium">{item.label}</span>
      </Link>
    );
  };

  return (
    <div className="w-64 bg-slate-900 text-white h-screen flex flex-col justify-between p-4 transition-colors duration-300 dark:bg-black border-r border-gray-800">

      {/* Top Section */}
      <div>
        <div className="mb-8 px-4 flex items-center gap-2 text-emerald-500">
          <Leaf size={28} />
          <h1 className="text-2xl font-bold tracking-tight text-white">WasteZero</h1>
        </div>

        {/* User Info Card */}
        <div className="mb-6 px-4 py-4 bg-gray-800 rounded-lg">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold">
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </div>
            <div>
              <p className="text-sm font-semibold text-white truncate">{user?.name || "User"}</p>
              <p className="text-xs capitalize text-gray-400">{user?.role || "user"}</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-4">
              Main Menu
            </h3>
            <div className="space-y-1">
              {menuItems.map((item) => (
                <NavItem key={item.label} item={item} />
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-4">
              Settings
            </h3>
            <div className="space-y-1">
              {settingsItems.map((item) => (
                <NavItem key={item.label} item={item} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="space-y-4">
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg transition-colors font-medium shadow-lg shadow-red-500/20"
        >
          <LogOut size={18} />
          Sign Out
        </button>

        <div className="flex items-center justify-between px-2 pt-4 border-t border-gray-800">
          <span className="text-sm text-gray-400">Theme</span>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 text-emerald-400 transition-colors"
          >
            {theme === "dark" ? <Moon size={20} /> : <Sun size={20} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
