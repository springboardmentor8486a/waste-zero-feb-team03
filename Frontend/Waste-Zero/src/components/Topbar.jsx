import { useAuth } from "../context/AuthContext";
import { Bell, Settings } from "lucide-react";

export default function Topbar() {
  const { user } = useAuth();

  return (
    <header className="h-20 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-8 transition-colors duration-300 shadow-sm">

      {/* Search Bar */}
      <div className="flex-1 max-w-md">
        <input
          placeholder="Search pickups, opportunities..."
          className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-sm bg-gray-50 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
        />
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-6 ml-auto">
        {/* Notifications */}
        <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-300">
          <Bell size={20} />
        </button>

        {/* Settings */}
        <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-300">
          <Settings size={20} />
        </button>

        {/* Divider */}
        <div className="h-8 w-px bg-gray-200 dark:bg-gray-600"></div>

        {/* User Info */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-semibold text-gray-800 dark:text-white">{user?.name || "User"}</p>
            <p className="text-xs capitalize text-gray-500 dark:text-gray-400">{user?.role || "user"}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
            {user?.name?.charAt(0).toUpperCase() || "U"}
          </div>
        </div>
      </div>

    </header>
  )
}
