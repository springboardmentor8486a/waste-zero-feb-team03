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
  Moon,
  Users,
  BarChart3,
  ScrollText,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const userRole = user?.role?.toLowerCase().trim();

  const getMenuItems = () => {
    if (userRole === "admin") {
      return [
        { icon: LayoutDashboard, label: "Dashboard",    path: "/admin" },
        { icon: Users,           label: "Users",         path: "/admin/users" },
        { icon: Briefcase,       label: "Opportunities", path: "/admin/opportunities" },
        { icon: BarChart3,       label: "Reports",       path: "/admin/reports" },
        { icon: ScrollText,      label: "Activity Logs", path: "/admin/logs" },
        { icon: MessageSquare,   label: "Messages",      path: "/chat/messages" },
      ];
    }

    if (userRole === "ngo") {
      return [
        { icon: LayoutDashboard, label: "Dashboard",    path: "/dashboard/ngo" },
        { icon: Briefcase,       label: "Opportunities", path: "/opportunities" },
        { icon: MessageSquare,   label: "Messages",      path: "/chat/messages" },
      ];
    }

    return [
      { icon: LayoutDashboard, label: "Dashboard",       path: "/dashboard/volunteer" },
      { icon: Calendar,        label: "Schedule Pickup", path: "/schedule" },
      { icon: Briefcase,       label: "Opportunities",   path: "/opportunities" },
      { icon: MessageSquare,   label: "Messages",        path: "/chat/messages" },
      { icon: Leaf,            label: "My Impact",       path: "/impact" },
    ];
  };

  const menuItems = getMenuItems();

  const settingsItems = [
    { icon: User,      label: "My Profile",   path: "/profile" },
    { icon: Settings,  label: "Settings",     path: "/settings" },
    { icon: HelpCircle,label: "Help & Support",path: "/support" },
    ...(userRole === "admin" ? [{ icon: Shield, label: "Admin Panel", path: "/admin" }] : []),
  ];

  const NavItem = ({ item }) => {
    const isActive = item.label === "Dashboard"
      ? (location.pathname.startsWith("/dashboard") || location.pathname === "/admin")
      : location.pathname.startsWith(item.path);

    return (
      <Link
        to={item.path}
        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
          isActive
            ? "text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20"
            : "text-gray-400 hover:text-emerald-500 hover:bg-gray-50 dark:hover:bg-gray-800"
        }`}
      >
        <item.icon size={20} />
        <span className="font-medium">{item.label}</span>
      </Link>
    );
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="w-64 bg-slate-900 text-white h-screen flex flex-col p-4 transition-colors duration-300 dark:bg-black border-r border-gray-800 shrink-0">
      <div className="flex-1 overflow-y-auto overflow-x-hidden pr-2">
        <div className="mb-8 px-4 flex items-center gap-2 text-emerald-500">
          <Leaf size={28} />
          <h1 className="text-2xl font-bold tracking-tight text-white">WasteZero</h1>
        </div>

        <div className="mb-6 px-4 py-4 bg-gray-800 rounded-lg">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold">
              {user?.name?.charAt(0).toUpperCase() || "A"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{user?.name || "Admin"}</p>
              <p className="text-[10px] uppercase tracking-widest text-emerald-400 font-bold">
                {userRole || "admin"}
              </p>
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
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-500/10 transition-colors mt-4"
              >
                <LogOut size={20} />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="shrink-0 mt-4 pt-4 border-t border-gray-800">
        <div className="flex items-center justify-between px-2">
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
