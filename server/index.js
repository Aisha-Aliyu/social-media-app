require("dotenv").config();
const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const helmet = require("helmet");
const securityHeaders = require("./middleware/securityHeaders");
const morgan = require("morgan");
const compression = require("compression");
const jwt = require("jsonwebtoken");

const connectDB = require("./config/db");
const { apiLimiter } = require("./middleware/rateLimiter");
const errorHandler = require("./middleware/errorHandler");
const sanitizeRequest = require("./middleware/sanitize");
const authRoutes = require("./routes/auth");
const postRoutes = require("./routes/posts");
const userRoutes = require("./routes/users");
const notificationRoutes = require("./routes/notifications");
const messageRoutes = require("./routes/messages");

const app = express();
const httpServer = createServer(app);

// Socket.io setup
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Trust proxy for Codespaces/reverse proxies
app.set("trust proxy", 1);

// Connect to MongoDB
connectDB();

// Security Middleware
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "https:"],
        scriptSrc: ["'self'"],
        connectSrc: ["'self'", process.env.CLIENT_URL],
      },
    },
    crossOriginEmbedderPolicy: false,
  })
);

app.use(securityHeaders);
app.use(sanitizeRequest);
app.use(compression());

// CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

// Body parsing
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// Logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Rate limiting
app.use("/api", apiLimiter);

// REST Routes
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/users", userRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/messages", messageRoutes);

// Health check
app.get("/health", (req, res) =>
  res.json({ status: "OK", app: "Chillax API", realtime: "Socket.io active" })
);

// 404
app.use((req, res) =>
  res.status(404).json({ success: false, message: "Route not found" })
);

// Error handler
app.use(errorHandler);

// ============================================================
// SOCKET.IO — Real-time layer
// ============================================================

// Map: userId -> socketId (in-memory, scales to Redis later)
const onlineUsers = new Map();

// Socket auth middleware, verify JWT before allowing connection
io.use((socket, next) => {
  const token = socket.handshake.auth?.token;
  if (!token) return next(new Error("Authentication required"));
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = decoded.id;
    next();
  } catch {
    next(new Error("Invalid token"));
  }
});

io.on("connection", (socket) => {
  const userId = socket.userId;
  onlineUsers.set(userId, socket.id);

  console.log(`⚡ User connected: ${userId}`);

  // Broadcast online status
  socket.broadcast.emit("user:online", { userId });

  // Join personal room for notifications
  socket.join(`user:${userId}`);

  // ---- Messaging events ----

  // Send a direct message
  socket.on("message:send", async (data) => {
    try {
      const { recipientId, text, tempId } = data;
      if (!text?.trim() || !recipientId) return;

      const Message = require("./models/Message");
      const conversationId = Message.getConversationId(userId, recipientId);

      const message = await Message.create({
        sender: userId,
        recipient: recipientId,
        text: text.trim(),
        conversationId,
      });

      await message.populate("sender", "username displayName avatar");
      await message.populate("recipient", "username displayName avatar");

      const msgData = { ...message.toObject(), tempId };

      // Send to recipient if online
      const recipientSocketId = onlineUsers.get(recipientId);
      if (recipientSocketId) {
        io.to(recipientSocketId).emit("message:receive", msgData);
      }

      // Confirm to sender with server message (replacing optimistic)
      socket.emit("message:sent", msgData);
    } catch (err) {
      socket.emit("message:error", { error: "Failed to send message" });
    }
  });

  // Typing indicator
  socket.on("typing:start", ({ recipientId }) => {
    const recipientSocketId = onlineUsers.get(recipientId);
    if (recipientSocketId) {
      io.to(recipientSocketId).emit("typing:start", { userId });
    }
  });

  socket.on("typing:stop", ({ recipientId }) => {
    const recipientSocketId = onlineUsers.get(recipientId);
    if (recipientSocketId) {
      io.to(recipientSocketId).emit("typing:stop", { userId });
    }
  });

  // ---- Notification events ----

  // Emit notification to a specific user (called from controllers)
  socket.on("notification:send", ({ recipientId, notification }) => {
    io.to(`user:${recipientId}`).emit("notification:new", notification);
  });

  // ---- Disconnect ----
  socket.on("disconnect", () => {
    onlineUsers.delete(userId);
    socket.broadcast.emit("user:offline", { userId });
    console.log(`❌ User disconnected: ${userId}`);
  });
});

// Expose io for use in controllers
app.set("io", io);
app.set("onlineUsers", onlineUsers);

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(
    ` Chillax server + Socket.io running in ${process.env.NODE_ENV} mode on port ${PORT}`
  );
});
