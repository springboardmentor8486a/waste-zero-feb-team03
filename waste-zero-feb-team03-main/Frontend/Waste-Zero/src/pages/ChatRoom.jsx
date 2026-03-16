import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { socket } from "../utils/socket";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { Send, Loader2 } from "lucide-react";

const ChatRoom = () => {
  const { userId } = useParams();       
  const { user: me } = useAuth();       
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [otherUser, setOtherUser] = useState(null);
  const scrollRef = useRef();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get(`/messages/${userId}`);
        setMessages(res.data.messages || []);

        if (res.data.messages?.length) {
          const first = res.data.messages[0];
          const other =
            first.sender_id?._id === (me?._id || me?.id)
              ? first.receiver_id
              : first.sender_id;
          setOtherUser(other);
        }
      } catch (err) {
        console.error("Failed to load messages:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();

    const handleNewMessage = ({ message }) => {
      setMessages((prev) => [...prev, message]);
    };

    socket.on("newMessage", handleNewMessage);

    api.patch(`/messages/${userId}/read`).catch(() => {});

    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [userId, me]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const res = await api.post("/messages", {
        receiver_id: userId,
        content: newMessage.trim(),
      });

      setMessages((prev) => [...prev, res.data]);
      setNewMessage("");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to send message");
    }
  };

  const myId = me?._id || me?.id;

  const isMine = (msg) => {
    const senderId = msg.sender_id?._id || msg.sender_id;
    return senderId?.toString() === myId?.toString();
  };

  const formatTime = (ts) =>
    new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="flex flex-col h-[80vh] bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">

      {/* Header */}
      <div className="p-4 border-b dark:border-gray-700 font-semibold text-gray-800 dark:text-white">
        {otherUser?.name || "Chat"}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {loading ? (
          <Loader2 className="animate-spin mx-auto text-emerald-600" />
        ) : messages.length === 0 ? (
          <p className="text-center text-gray-400">No messages yet. Say hi! 👋</p>
        ) : (
          messages.map((msg, i) => (
            <div key={msg._id || i} className={`flex ${isMine(msg) ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[70%] p-3 rounded-2xl ${
                isMine(msg)
                  ? "bg-emerald-600 text-white rounded-tr-none"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-tl-none"
              }`}>
                <p>{msg.content}</p>
                <span className="text-[10px] opacity-70 mt-1 block">
                  {formatTime(msg.timestamp)}
                </span>
              </div>
            </div>
          ))
        )}
        <div ref={scrollRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="p-4 border-t dark:border-gray-700 flex gap-2">
        <input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2 focus:ring-2 focus:ring-emerald-500 outline-none dark:text-white"
        />
        <button
          type="submit"
          className="bg-emerald-600 p-2 rounded-xl text-white hover:bg-emerald-700 transition-colors"
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  );
};

export default ChatRoom;
