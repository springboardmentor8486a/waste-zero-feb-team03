import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { MessageSquare, Sparkles, LayoutDashboard, LogOut, Users, Bell, Check, Trash2 } from "lucide-react";
import api from "../../services/api";
import { socket } from "../../utils/socket";

const Navbar1 = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (!user) return;

    const fetchNotifications = async () => {
      try {
        const res = await api.get('/notifications?limit=5');
        setNotifications(res.data.notifications || []);
        setUnreadCount(res.data.unreadCount || 0);
      } catch (err) {
        console.error("Failed to fetch notifications", err);
      }
    };

    fetchNotifications();

    const handleNewNotification = (notification) => {
      setNotifications(prev => [notification, ...prev].slice(0, 5));
      setUnreadCount(prev => prev + 1);
    };

    socket.on('notification', handleNewNotification);
    socket.on('newMatch', (data) => data.notification && handleNewNotification(data.notification));

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      socket.off('notification', handleNewNotification);
      socket.off('newMatch');
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [user]);

  const markAsRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications(notifications.map(n => n._id === id ? { ...n, read: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error(err);
    }
  };

  const markAllRead = async () => {
    try {
      await api.patch('/notifications/read-all');
      setNotifications(notifications.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error(err);
    }
  };

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const role = user.role?.toLowerCase();
  const dashboardPath = role === "admin" ? "/admin" : (role === "ngo" ? "/dashboard/ngo" : "/dashboard/volunteer");

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

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="relative p-2 text-gray-600 hover:text-emerald-600 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-gray-900" />
            )}
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden z-50">
              <div className="p-3 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
                <span className="font-semibold text-gray-900 dark:text-white">Notifications</span>
                {unreadCount > 0 && (
                  <button onClick={markAllRead} className="text-xs text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1">
                    <Check size={14} /> Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-[300px] overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-sm text-gray-500 dark:text-gray-400">
                    No notifications yet
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100 dark:divide-gray-700">
                    {notifications.map(notif => (
                      <div
                        key={notif._id}
                        className={`p-3 text-sm transition-colors cursor-pointer ${notif.read ? 'opacity-70 bg-white dark:bg-gray-800' : 'bg-emerald-50/30 dark:bg-emerald-900/10'}`}
                        onClick={() => !notif.read && markAsRead(notif._id)}
                      >
                        <p className={`text-gray-800 dark:text-gray-200 ${!notif.read && 'font-semibold'}`}>
                          {notif.message}
                        </p>
                        <span className="text-[10px] text-gray-400 mt-1 block">
                          {new Date(notif.sent_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

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
