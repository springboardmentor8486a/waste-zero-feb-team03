import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { socket } from "../utils/socket";
import api from "../services/api";
import { Send, Loader2 } from "lucide-react";

const ChatRoom = () => {
  const { userId } = useParams(); // ID of the person you are chatting with
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef();

  useEffect(() => {
    // 1. Join a private room for these two users
    socket.connect();
    socket.emit("join_chat", { targetId: userId });

    // 2. Load Message History
    const fetchHistory = async () => {
      try {
        const res = await api.get(`/messages/${userId}`);
        setMessages(res.data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchHistory();

    // 3. Listen for Incoming Messages
    socket.on("receive_message", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.off("receive_message");
      socket.disconnect();
    };
  }, [userId]);

  // Auto-scroll logic
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const messageData = {
      receiverId: userId,
      text: newMessage,
      timestamp: new Date(),
    };

    // Emit real-time event
    socket.emit("send_message", messageData);
    
    // Optimistic UI update
    setMessages((prev) => [...prev, { ...messageData, senderId: "me" }]);
    setNewMessage("");
  };

  return (
    <div className="flex flex-col h-[80vh] bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {loading ? <Loader2 className="animate-spin mx-auto" /> : messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.senderId === "me" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[70%] p-3 rounded-2xl ${
              msg.senderId === "me" ? "bg-emerald-600 text-white rounded-tr-none" : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-tl-none"
            }`}>
              <p>{msg.text}</p>
              <span className="text-[10px] opacity-70 mt-1 block">
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}
        <div ref={scrollRef} />
      </div>

      <form onSubmit={handleSendMessage} className="p-4 border-t dark:border-gray-700 flex gap-2">
        <input 
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 bg-gray-50 dark:bg-gray-800 border-none rounded-xl px-4 py-2 focus:ring-2 focus:ring-emerald-500 outline-none"
        />
        <button type="submit" className="bg-emerald-600 p-2 rounded-xl text-white hover:bg-emerald-700 transition-colors">
          <Send size={20} />
        </button>
      </form>
    </div>
  );
};

export default ChatRoom;