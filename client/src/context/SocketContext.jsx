import { createContext, useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import useAuthStore from "../store/authStore";

const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const { token, isAuthenticated } = useAuthStore();
  const socketRef = useRef(null);
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !token) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setConnected(false);
      }
      return;
    }

    // Connect with JWT auth
    const socket = io(
      import.meta.env.VITE_API_URL.replace("/api", ""),
      {
        auth: { token },
        transports: ["websocket", "polling"],
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      }
    );

    socketRef.current = socket;

    socket.on("connect", () => {
      setConnected(true);
      console.log("⚡ Socket connected");
    });

    socket.on("disconnect", () => {
      setConnected(false);
    });

    socket.on("user:online", ({ userId }) => {
      setOnlineUsers((prev) => new Set([...prev, userId]));
    });

    socket.on("user:offline", ({ userId }) => {
      setOnlineUsers((prev) => {
        const next = new Set(prev);
        next.delete(userId);
        return next;
      });
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [isAuthenticated, token]);

  const sendMessage = (recipientId, text, tempId) => {
    socketRef.current?.emit("message:send", { recipientId, text, tempId });
  };

  const sendTyping = (recipientId, isTyping) => {
    socketRef.current?.emit(
      isTyping ? "typing:start" : "typing:stop",
      { recipientId }
    );
  };

  const onMessage = (cb) => {
    socketRef.current?.on("message:receive", cb);
    return () => socketRef.current?.off("message:receive", cb);
  };

  const onMessageSent = (cb) => {
    socketRef.current?.on("message:sent", cb);
    return () => socketRef.current?.off("message:sent", cb);
  };

  const onTyping = (cb) => {
    socketRef.current?.on("typing:start", cb);
    return () => socketRef.current?.off("typing:start", cb);
  };

  const onTypingStop = (cb) => {
    socketRef.current?.on("typing:stop", cb);
    return () => socketRef.current?.off("typing:stop", cb);
  };

  const onNotification = (cb) => {
    socketRef.current?.on("notification:new", cb);
    return () => socketRef.current?.off("notification:new", cb);
  };

  return (
    <SocketContext.Provider
      value={{
        socket: socketRef.current,
        connected,
        onlineUsers,
        sendMessage,
        sendTyping,
        onMessage,
        onMessageSent,
        onTyping,
        onTypingStop,
        onNotification,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
