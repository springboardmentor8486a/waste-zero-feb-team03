import { useAuth } from "../context/AuthContext";
import { Bell, Settings, Search, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import api from "../services/api";
import { socket } from "../utils/socket";
import { useNavigate, useLocation } from "react-router-dom";

export default function Topbar() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [searchQuery, setSearchQuery] = useState("");
  const inputRef = useRef();
  const isOnOpportunities = location.pathname === "/opportunities";

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setSearchQuery(params.get("q") || "");
  }, [location.pathname]); 

  useEffect(() => {
    if (!isOnOpportunities) return; 

    const timer = setTimeout(() => {
      const params = new URLSearchParams(window.location.search);
      const current = params.get("q") || "";

      if (searchQuery.trim() !== current) {
        if (searchQuery.trim()) {
          navigate(`/opportunities?q=${encodeURIComponent(searchQuery.trim())}`, { replace: true });
        } else {
          navigate("/opportunities", { replace: true });
        }
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, isOnOpportunities]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      navigate(`/opportunities?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    inputRef.current?.focus(); 
  };

  const [notifications, setNotifications] = useState([]);
  const [unreadCount,   setUnreadCount]   = useState(0);
  const [open,          setOpen]          = useState(false);
  const [acceptedToast, setAcceptedToast] = useState(null);
  const dropdownRef = useRef();

  const fetchNotifications = async () => {
    try {
      const res = await api.get("/notifications?limit=10");
      setNotifications(res.data.notifications || []);
      setUnreadCount(res.data.unreadCount     || 0);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    }
  };

  useEffect(() => {
    fetchNotifications();

    const handleNotification = (notification) => {
      setNotifications((prev) => [notification, ...prev.slice(0, 9)]);
      setUnreadCount((prev) => prev + 1);
    };

    const handleNewMatch = ({ notification }) => {
      if (notification) {
        setNotifications((prev) => [notification, ...prev.slice(0, 9)]);
        setUnreadCount((prev) => prev + 1);
      }
    };

    const handleApplicationAccepted = ({ opportunity }) => {
      setAcceptedToast(opportunity);
      setTimeout(() => setAcceptedToast(null), 6000);
    };

    socket.on("notification",        handleNotification);
    socket.on("newMatch",            handleNewMatch);
    socket.on("applicationAccepted", handleApplicationAccepted);

    return () => {
      socket.off("notification",        handleNotification);
      socket.off("newMatch",            handleNewMatch);
      socket.off("applicationAccepted", handleApplicationAccepted);
    };
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const markAsRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications((prev) => prev.map((n) => n._id === id ? { ...n, read: true } : n));
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error("Mark read failed:", err);
    }
  };

  const markAllRead = async () => {
    try {
      await api.patch("/notifications/read-all");
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error("Mark all read failed:", err);
    }
  };

  const handleNotificationClick = async (notification) => {
    if (!notification.read) await markAsRead(notification._id);
    if      (notification.type === "newMessage")        navigate("/chat/messages");
    else if (notification.type === "newMatch")          navigate("/matches");
    else if (notification.type === "applicationUpdate") navigate("/opportunities");
    setOpen(false);
  };

  const typeIcon = {
    newMessage:        "💬",
    newMatch:          "✨",
    applicationUpdate: "📋",
    system:            "🔔",
  };

  const timeAgo = (ts) => {
    const diff  = Date.now() - new Date(ts).getTime();
    const mins  = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days  = Math.floor(diff / 86400000);
    if (mins  < 1)  return "just now";
    if (mins  < 60) return `${mins}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <>
      {acceptedToast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 bg-emerald-600 text-white px-6 py-4 rounded-2xl shadow-2xl max-w-md w-full mx-4">
          <span className="text-2xl">🎉</span>
          <div className="flex-1">
            <p className="font-bold text-sm">Application Accepted!</p>
            <p className="text-xs opacity-90">You've been accepted for "{acceptedToast.title}"</p>
          </div>
          <button onClick={() => setAcceptedToast(null)} className="text-white/70 hover:text-white text-lg leading-none">×</button>
        </div>
      )}

      <header className="h-20 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-8 transition-colors duration-300 shadow-sm">

        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isOnOpportunities
                ? "Search opportunities..."
                : "Search opportunities... (press Enter)"
              }
              className="w-full pl-9 pr-8 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-gray-50 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-6 ml-6">

          {/* Notification Bell */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setOpen((prev) => !prev)}
              className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-300"
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>

            {open && (
              <div className="absolute right-0 top-12 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                  <h3 className="font-bold text-gray-900 dark:text-white text-sm">
                    Notifications{" "}
                    {unreadCount > 0 && (
                      <span className="ml-1 bg-red-100 text-red-600 text-xs px-1.5 py-0.5 rounded-full">
                        {unreadCount} new
                      </span>
                    )}
                  </h3>
                  {unreadCount > 0 && (
                    <button onClick={markAllRead} className="text-xs text-emerald-600 hover:text-emerald-700 font-semibold">
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="max-h-72 overflow-y-auto divide-y divide-gray-50 dark:divide-gray-700">
                  {notifications.length === 0 ? (
                    <div className="py-8 text-center text-gray-400 text-sm">No notifications yet</div>
                  ) : (
                    notifications.map((n) => (
                      <button
                        key={n._id}
                        onClick={() => handleNotificationClick(n)}
                        className={`w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors flex gap-3 items-start ${
                          !n.read ? "bg-emerald-50/50 dark:bg-emerald-900/10" : ""
                        }`}
                      >
                        <span className="text-lg mt-0.5">{typeIcon[n.type] || "🔔"}</span>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm ${!n.read ? "font-semibold text-gray-900 dark:text-white" : "text-gray-600 dark:text-gray-400"}`}>
                            {n.message}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5">{timeAgo(n.sent_at)}</p>
                        </div>
                        {!n.read && <div className="w-2 h-2 bg-emerald-500 rounded-full mt-1.5 shrink-0" />}
                      </button>
                    ))
                  )}
                </div>

                <div className="px-4 py-2 border-t border-gray-100 dark:border-gray-700 text-center">
                  <button onClick={fetchNotifications} className="text-xs text-emerald-600 hover:text-emerald-700 font-semibold">
                    Refresh
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Settings */}
          <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-300">
            <Settings size={20} />
          </button>

          <div className="h-8 w-px bg-gray-200 dark:bg-gray-600" />

          {/* User info */}
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
    </>
  );
}
