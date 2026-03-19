import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Sidebar from "../components/layout/Sidebar";
import Avatar from "../components/ui/Avatar";
import Spinner from "../components/ui/Spinner";
import useAuthStore from "../store/authStore";
import { useSocket } from "../context/SocketContext";
import api from "../api/axios";

const formatTime = (dateStr) => {
  return new Date(dateStr).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

const formatConvoTime = (dateStr) => {
  const diff = (Date.now() - new Date(dateStr)) / 1000;
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  return `${Math.floor(diff / 86400)}d`;
};

const Messages = () => {
  const { user } = useAuthStore();
  const {
    sendMessage,
    onMessage,
    onMessageSent,
    onTyping,
    onTypingStop,
    onlineUsers,
    connected,
    sendTyping,
  } = useSocket();
  const queryClient = useQueryClient();

  const [activeConvo, setActiveConvo] = useState(null);
  const [message, setMessage] = useState("");
  const [localMessages, setLocalMessages] = useState([]);
  const [typingUsers, setTypingUsers] = useState(new Set());
  // Mobile panel state
  const [mobilePanel, setMobilePanel] = useState("list");
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Fetch conversations
  const { data: conversations = [], isLoading: convosLoading } = useQuery({
    queryKey: ["conversations"],
    queryFn: async () => {
      const { data } = await api.get("/messages/conversations");
      return data.conversations;
    },
    refetchInterval: 1000 * 30,
  });

  // Fetch messages for active conversation
  const { data: messagesData, isLoading: messagesLoading } = useQuery({
    queryKey: ["messages", activeConvo?.user?._id],
    queryFn: async () => {
      const { data } = await api.get(`/messages/${activeConvo.user._id}`);
      return data.messages;
    },
    enabled: !!activeConvo,
  });

  useEffect(() => {
    if (messagesData) setLocalMessages(messagesData);
  }, [messagesData]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [localMessages]);

  // Incoming messages
  useEffect(() => {
    const cleanup = onMessage((msg) => {
      if (
        activeConvo &&
        (msg.sender._id === activeConvo.user._id ||
          msg.recipient._id === activeConvo.user._id)
      ) {
        setLocalMessages((prev) => [...prev, msg]);
      }
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    });
    return cleanup;
  }, [activeConvo, onMessage, queryClient]);

  // Sent confirmation
  useEffect(() => {
    const cleanup = onMessageSent((msg) => {
      setLocalMessages((prev) =>
        prev.map((m) => (m.tempId === msg.tempId ? msg : m))
      );
    });
    return cleanup;
  }, [onMessageSent]);

  // Typing listeners
  useEffect(() => {
    const cleanupStart = onTyping(({ userId }) => {
      setTypingUsers((prev) => new Set([...prev, userId]));
    });
    const cleanupStop = onTypingStop(({ userId }) => {
      setTypingUsers((prev) => {
        const next = new Set(prev);
        next.delete(userId);
        return next;
      });
    });
    return () => {
      cleanupStart?.();
      cleanupStop?.();
    };
  }, [onTyping, onTypingStop]);

  const openConvo = (convo) => {
    setActiveConvo(convo);
    setLocalMessages([]);
    setMobilePanel("chat");
  };

  const handleSend = () => {
    if (!message.trim() || !activeConvo) return;
    const tempId = `temp_${Date.now()}`;
    const optimisticMsg = {
      _id: tempId,
      tempId,
      sender: {
        _id: user.id,
        username: user.username,
        displayName: user.displayName,
        avatar: user.avatar,
      },
      recipient: activeConvo.user,
      text: message.trim(),
      createdAt: new Date().toISOString(),
      pending: true,
    };
    setLocalMessages((prev) => [...prev, optimisticMsg]);
    sendMessage(activeConvo.user._id, message.trim(), tempId);
    setMessage("");
    sendTyping(activeConvo.user._id, false);
  };

  const handleTyping = (e) => {
    setMessage(e.target.value);
    if (!activeConvo) return;
    sendTyping(activeConvo.user._id, true);
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      sendTyping(activeConvo.user._id, false);
    }, 1500);
  };

  const isOtherTyping = activeConvo && typingUsers.has(activeConvo.user?._id);
  const isOnline = (userId) => onlineUsers.has(userId);

  // ---- Subcomponents ----

  const ConvoList = () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        minWidth: 0,
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "18px 16px 12px",
          borderBottom: "1px solid var(--color-border)",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: "22px",
              letterSpacing: "0.06em",
              color: "var(--color-primary)",
            }}
          >
            Messages
          </h2>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
              padding: "3px 10px",
              borderRadius: "var(--radius-full)",
              background: connected
                ? "rgba(29,185,84,0.12)"
                : "rgba(230,57,70,0.12)",
              fontSize: "11px",
              fontWeight: 700,
              color: connected ? "#1db954" : "var(--color-error)",
              fontFamily: "var(--font-display)",
              letterSpacing: "0.04em",
            }}
          >
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: connected ? "#1db954" : "var(--color-error)",
              }}
            />
            {connected ? "Live" : "Off"}
          </div>
        </div>
      </div>

      {/* Search */}
      <div style={{ padding: "10px 12px", flexShrink: 0 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: "var(--color-bg-secondary)",
            borderRadius: "var(--radius-full)",
            padding: "8px 14px",
          }}
        >
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--color-text-muted)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            placeholder="Search..."
            style={{
              flex: 1,
              border: "none",
              outline: "none",
              background: "transparent",
              fontSize: "13px",
              fontFamily: "var(--font-body)",
              color: "var(--color-text-primary)",
            }}
          />
        </div>
      </div>

      {/* List */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        {convosLoading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              padding: "32px",
            }}
          >
            <Spinner size={22} />
          </div>
        ) : conversations.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 16px" }}>
            <p style={{ fontSize: "28px", marginBottom: "8px" }}>💬</p>
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "16px",
                color: "var(--color-text-muted)",
                letterSpacing: "0.04em",
              }}
            >
              No conversations yet
            </p>
            <p
              style={{
                fontSize: "12px",
                color: "var(--color-text-muted)",
                marginTop: "4px",
              }}
            >
              Follow someone and start chatting
            </p>
          </div>
        ) : (
          conversations.map((convo) => (
            <div
              key={convo.conversationId}
              onClick={() => openConvo(convo)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "12px 16px",
                cursor: "pointer",
                background:
                  activeConvo?.conversationId === convo.conversationId
                    ? "var(--color-accent-soft)"
                    : "transparent",
                borderLeft:
                  activeConvo?.conversationId === convo.conversationId
                    ? "3px solid var(--color-primary)"
                    : "3px solid transparent",
                transition: "background var(--transition-fast)",
              }}
              onMouseEnter={(e) => {
                if (activeConvo?.conversationId !== convo.conversationId)
                  e.currentTarget.style.background =
                    "var(--color-bg-secondary)";
              }}
              onMouseLeave={(e) => {
                if (activeConvo?.conversationId !== convo.conversationId)
                  e.currentTarget.style.background = "transparent";
              }}
            >
              <div style={{ position: "relative", flexShrink: 0 }}>
                <Avatar
                  src={convo.user?.avatar}
                  name={convo.user?.displayName || convo.user?.username}
                  size={44}
                />
                {isOnline(convo.user?._id) && (
                  <div
                    style={{
                      position: "absolute",
                      bottom: 1,
                      right: 1,
                      width: 11,
                      height: 11,
                      borderRadius: "50%",
                      background: "#1db954",
                      border: "2px solid var(--color-bg-card)",
                    }}
                  />
                )}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "2px",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 700,
                      fontSize: "14px",
                      color: "var(--color-text-primary)",
                      letterSpacing: "0.02em",
                    }}
                  >
                    {convo.user?.displayName || convo.user?.username}
                  </span>
                  <span
                    style={{ fontSize: "11px", color: "var(--color-text-muted)" }}
                  >
                    {formatConvoTime(convo.lastMessageTime)}
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{
                      fontSize: "12px",
                      color: "var(--color-text-muted)",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      flex: 1,
                    }}
                  >
                    {convo.lastMessage}
                  </span>
                  {convo.unread > 0 && (
                    <span
                      style={{
                        background: "var(--color-primary)",
                        color: "#fff",
                        fontSize: "10px",
                        fontWeight: 700,
                        borderRadius: "var(--radius-full)",
                        minWidth: "18px",
                        height: "18px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "0 4px",
                        marginLeft: "6px",
                        flexShrink: 0,
                      }}
                    >
                      {convo.unread}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  const ChatWindow = () => (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        minWidth: 0,
        height: "100%",
      }}
    >
      {/* Chat header */}
      <div
        style={{
          padding: "14px 18px",
          borderBottom: "1px solid var(--color-border)",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          flexShrink: 0,
        }}
      >
        {/* Back button, mobile only */}
        <button
          onClick={() => setMobilePanel("list")}
          className="chat-back-btn"
          style={{
            display: "none",
            padding: "6px",
            borderRadius: "var(--radius-full)",
            color: "var(--color-text-secondary)",
            transition: "background var(--transition-fast)",
            flexShrink: 0,
          }}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
        </button>

        <div style={{ position: "relative" }}>
          <Avatar
            src={activeConvo?.user?.avatar}
            name={activeConvo?.user?.displayName || activeConvo?.user?.username}
            size={40}
          />
          {isOnline(activeConvo?.user?._id) && (
            <div
              style={{
                position: "absolute",
                bottom: 1,
                right: 1,
                width: 11,
                height: 11,
                borderRadius: "50%",
                background: "#1db954",
                border: "2px solid var(--color-bg-card)",
              }}
            />
          )}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "16px",
              letterSpacing: "0.02em",
              color: "var(--color-text-primary)",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {activeConvo?.user?.displayName || activeConvo?.user?.username}
          </p>
          <p
            style={{
              fontSize: "12px",
              color: isOnline(activeConvo?.user?._id)
                ? "#1db954"
                : "var(--color-text-muted)",
            }}
          >
            {isOnline(activeConvo?.user?._id) ? "● Online" : "Offline"}
          </p>
        </div>
      </div>

      {/* Messages area */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "16px",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}
      >
        {messagesLoading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              padding: "32px",
            }}
          >
            <Spinner size={24} />
          </div>
        ) : (
          <>
            <AnimatePresence initial={false}>
              {localMessages.map((msg) => {
                const isMe =
                  msg.sender?._id === user?.id ||
                  msg.sender === user?.id;
                return (
                  <motion.div
                    key={msg._id}
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.2 }}
                    style={{
                      display: "flex",
                      justifyContent: isMe ? "flex-end" : "flex-start",
                      alignItems: "flex-end",
                      gap: "8px",
                    }}
                  >
                    {!isMe && (
                      <Avatar
                        src={activeConvo?.user?.avatar}
                        name={activeConvo?.user?.displayName}
                        size={28}
                      />
                    )}
                    <div
                      style={{
                        maxWidth: "70%",
                        padding: "9px 14px",
                        borderRadius: isMe
                          ? "18px 18px 4px 18px"
                          : "18px 18px 18px 4px",
                        background: isMe
                          ? "var(--color-primary)"
                          : "var(--color-bg-secondary)",
                        color: isMe
                          ? "#f7f7ff"
                          : "var(--color-text-primary)",
                        fontSize: "14px",
                        lineHeight: 1.5,
                        wordBreak: "break-word",
                        opacity: msg.pending ? 0.7 : 1,
                        transition: "opacity 0.2s",
                      }}
                    >
                      <p>{msg.text}</p>
                      <p
                        style={{
                          fontSize: "10px",
                          marginTop: "3px",
                          opacity: 0.6,
                          textAlign: isMe ? "right" : "left",
                        }}
                      >
                        {msg.pending ? "Sending..." : formatTime(msg.createdAt)}
                      </p>
                    </div>
                    {isMe && (
                      <Avatar
                        src={user?.avatar}
                        name={user?.displayName || user?.username}
                        size={28}
                      />
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {/* Typing indicator */}
            <AnimatePresence>
              {isOtherTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <Avatar
                    src={activeConvo?.user?.avatar}
                    name={activeConvo?.user?.displayName}
                    size={28}
                  />
                  <div
                    style={{
                      padding: "10px 14px",
                      background: "var(--color-bg-secondary)",
                      borderRadius: "18px 18px 18px 4px",
                      display: "flex",
                      gap: "4px",
                      alignItems: "center",
                    }}
                  >
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          background: "var(--color-text-muted)",
                          animation: "typing-dot 1.2s infinite",
                          animationDelay: `${i * 0.2}s`,
                        }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Message input */}
      <div
        style={{
          padding: "12px 16px",
          borderTop: "1px solid var(--color-border)",
          display: "flex",
          gap: "10px",
          alignItems: "center",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            gap: "10px",
            background: "var(--color-bg-secondary)",
            borderRadius: "var(--radius-full)",
            padding: "10px 16px",
            border: "1.5px solid transparent",
            transition: "border-color var(--transition-fast)",
          }}
          onFocusCapture={(e) =>
            (e.currentTarget.style.borderColor = "var(--color-primary)")
          }
          onBlurCapture={(e) =>
            (e.currentTarget.style.borderColor = "transparent")
          }
        >
          <input
            value={message}
            onChange={handleTyping}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Type a message..."
            style={{
              flex: 1,
              border: "none",
              outline: "none",
              background: "transparent",
              fontSize: "14px",
              fontFamily: "var(--font-body)",
              color: "var(--color-text-primary)",
            }}
          />
        </div>
        <button
          onClick={handleSend}
          disabled={!message.trim()}
          style={{
            width: 42,
            height: 42,
            borderRadius: "50%",
            background: message.trim()
              ? "var(--color-primary)"
              : "var(--color-border)",
            color: "#f7f7ff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            cursor: message.trim() ? "pointer" : "not-allowed",
            transition: "background var(--transition-fast)",
            boxShadow: message.trim() ? "var(--shadow-sm)" : "none",
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </div>
    </div>
  );

  const EmptyState = () => (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "12px",
        color: "var(--color-text-muted)",
        padding: "24px",
      }}
    >
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: "50%",
          background: "var(--color-accent-soft)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--color-primary)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      </div>
      <p
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "20px",
          fontWeight: 700,
          color: "var(--color-primary)",
          letterSpacing: "0.04em",
        }}
      >
        Your Messages
      </p>
      <p
        style={{
          fontSize: "14px",
          textAlign: "center",
          maxWidth: "220px",
          lineHeight: 1.6,
        }}
      >
        Select a conversation or follow someone to start chatting
      </p>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "var(--color-bg)" }}>
      <div
        className="feed-layout"
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "24px 16px",
          display: "flex",
          gap: "28px",
          alignItems: "flex-start",
        }}
      >
        <Sidebar />

        {/* Messages container */}
        <motion.div
          className="main-content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            flex: 1,
            minWidth: 0,
            height: "calc(100vh - 48px)",
            display: "flex",
            borderRadius: "var(--radius-lg)",
            border: "1px solid var(--color-border)",
            background: "var(--color-bg-card)",
            overflow: "hidden",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          {/* Desktop: always show both panels */}
          {/* Mobile: show only active panel */}

          {/* Convo list panel */}
          <div
            className="convo-panel"
            style={{
              width: "300px",
              flexShrink: 0,
              borderRight: "1px solid var(--color-border)",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            <ConvoList />
          </div>

          {/* Chat panel */}
          <div
            className="chat-panel"
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              minWidth: 0,
              overflow: "hidden",
            }}
          >
            {activeConvo ? <ChatWindow /> : <EmptyState />}
          </div>
        </motion.div>
      </div>

      <style>{`
        @keyframes typing-dot {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30% { transform: translateY(-4px); opacity: 1; }
        }

        /* Mobile responsive — single panel view */
        @media (max-width: 768px) {
          .convo-panel {
            width: 100% !important;
            border-right: none !important;
            display: ${mobilePanel === "list" ? "flex" : "none"} !important;
          }
          .chat-panel {
            display: ${mobilePanel === "chat" ? "flex" : "none"} !important;
            width: 100% !important;
          }
          .chat-back-btn {
            display: flex !important;
          }
          .feed-layout {
            padding: 0 !important;
            gap: 0 !important;
          }
          .main-content {
            border-radius: 0 !important;
            height: calc(100vh - 60px) !important;
            border-left: none !important;
            border-right: none !important;
            border-top: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Messages;
