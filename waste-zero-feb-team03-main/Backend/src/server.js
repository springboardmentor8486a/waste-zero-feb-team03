import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createServer } from "http"; // 1. Import http server
import { Server } from "socket.io"; // 2. Import Socket.io
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import opportunityRoutes from "./routes/opportunityRoutes.js";

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Socket.io Setup
const httpServer = createServer(app); // 3. Wrap Express app
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173", // Your Vite Frontend URL
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Real-time Logic (Milestone 3 Infrastructure)
io.on("connection", (socket) => {
  console.log(`⚡ User Connected: ${socket.id}`);

  // Test event for Ping-Pong
  socket.on("ping_test", (data) => {
    console.log("📩 Ping received:", data.message);
    socket.emit("pong_test", { message: "Hello from Backend!" });
  });

  socket.on("disconnect", () => {
    console.log("❌ User Disconnected");
  });
});

// Routes
app.use("/auth", authRoutes); 
app.use("/users", userRoutes);
app.use("/opportunities", opportunityRoutes);

app.get("/", (req, res) => {
  res.send("Backend is running with Socket.io...");
});

const PORT = process.env.PORT || 5000;

// 4. IMPORTANT: Listen on httpServer, not app
httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});