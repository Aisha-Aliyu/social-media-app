import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import RightPanel from "../components/layout/RightPanel";
import Avatar from "../components/ui/Avatar";
import Spinner from "../components/ui/Spinner";
import { useNotifications, useMarkAllRead } from "../hooks/useUsers";

const TYPE_CONFIG = {
  follow: {
    label: "followed you",
    color: "var(--color-primary)",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
      </svg>
    ),
  },
  like: {
    label: "liked your post",
    color: "var(--color-error)",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
    ),
  },
  comment: {
    label: "commented on your post",
    color: "var(--color-accent)",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
      </svg>
    ),
  },
  mention: {
    label: "mentioned you",
    color: "var(--color-warning)",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10h5v-2h-5c-4.34 0-8-3.66-8-8s3.66-8 8-8 8 3.66 8 8v1.43c0 .79-.71 1.57-1.5 1.57s-1.5-.78-1.5-1.57V12c0-2.76-2.24-5-5-5s-5 2.24-5 5 2.24 5 5 5c1.38 0 2.64-.56 3.54-1.47.65.89 1.77 1.47 2.96 1.47C19.35 22 21 20.2 21 18.43V12c0-5.52-4.48-10-9-10zm0 13c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z" />
      </svg>
    ),
  },
};

const formatDate = (dateStr) => {
  const diff = (Date.now() - new Date(dateStr)) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};

const Notifications = () => {
  const { data: notifications = [], isLoading } = useNotifications();
  const { mutate: markAllRead, isPending } = useMarkAllRead();
  const navigate = useNavigate();

  const unread = notifications.filter((n) => !n.read).length;

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

        <motion.main
          className="main-content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ flex: 1, minWidth: 0 }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "20px",
            }}
          >
            <div>
              <h1
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 800,
                  fontSize: "28px",
                  letterSpacing: "0.06em",
                  color: "var(--color-primary)",
                }}
              >
                Notifications
              </h1>
              <p
                style={{
                  fontSize: "13px",
                  color: "var(--color-text-muted)",
                  marginTop: "2px",
                }}
              >
                {unread > 0 ? `${unread} unread` : "All caught up ✨"}
              </p>
            </div>
            {unread > 0 && (
              <button
                onClick={() => markAllRead()}
                disabled={isPending}
                style={{
                  padding: "8px 16px",
                  background: "var(--color-accent-soft)",
                  color: "var(--color-primary)",
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: "13px",
                  letterSpacing: "0.06em",
                  borderRadius: "var(--radius-full)",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  whiteSpace: "nowrap",
                }}
              >
                {isPending ? <Spinner size={12} /> : null}
                Mark all read
              </button>
            )}
          </div>

          {/* Notification List */}
          <div
            style={{
              background: "var(--color-bg-card)",
              borderRadius: "var(--radius-lg)",
              border: "1px solid var(--color-border)",
              overflow: "hidden",
            }}
          >
            {isLoading ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  padding: "48px",
                }}
              >
                <Spinner size={28} />
              </div>
            ) : notifications.length === 0 ? (
              <div style={{ textAlign: "center", padding: "56px 24px" }}>
                <p style={{ fontSize: "36px", marginBottom: "12px" }}>🔔</p>
                <p
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "20px",
                    fontWeight: 700,
                    color: "var(--color-text-secondary)",
                    letterSpacing: "0.04em",
                  }}
                >
                  No notifications yet
                </p>
                <p
                  style={{
                    fontSize: "14px",
                    color: "var(--color-text-muted)",
                    marginTop: "4px",
                  }}
                >
                  When people interact with you, it'll show here.
                </p>
              </div>
            ) : (
              <AnimatePresence>
                {notifications.map((notif, i) => {
                  const config = TYPE_CONFIG[notif.type] || TYPE_CONFIG.follow;
                  return (
                    <motion.div
                      key={notif._id}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                      onClick={() => {
                        if (notif.sender?.username)
                          navigate(`/profile/${notif.sender.username}`);
                      }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "14px",
                        padding: "14px 20px",
                        background: notif.read
                          ? "transparent"
                          : "rgba(39,24,126,0.04)",
                        borderBottom:
                          i < notifications.length - 1
                            ? "1px solid var(--color-border)"
                            : "none",
                        cursor: "pointer",
                        transition: "background var(--transition-fast)",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background =
                          "var(--color-bg-secondary)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = notif.read
                          ? "transparent"
                          : "rgba(39,24,126,0.04)")
                      }
                    >
                      {/* Unread dot */}
                      <div
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          background: notif.read
                            ? "transparent"
                            : "var(--color-primary)",
                          flexShrink: 0,
                        }}
                      />

                      {/* Avatar with type badge */}
                      <div style={{ position: "relative", flexShrink: 0 }}>
                        <Avatar
                          src={notif.sender?.avatar}
                          name={
                            notif.sender?.displayName || notif.sender?.username
                          }
                          size={44}
                        />
                        <div
                          style={{
                            position: "absolute",
                            bottom: -2,
                            right: -2,
                            width: 22,
                            height: 22,
                            borderRadius: "50%",
                            background: config.color,
                            border: "2px solid var(--color-bg-card)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#fff",
                          }}
                        >
                          {config.icon}
                        </div>
                      </div>

                      {/* Text */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p
                          style={{
                            fontSize: "14px",
                            color: "var(--color-text-primary)",
                            lineHeight: 1.5,
                          }}
                        >
                          <span style={{ fontWeight: 700 }}>
                            {notif.sender?.displayName ||
                              notif.sender?.username}
                          </span>{" "}
                          {config.label}
                          {notif.post?.content && (
                            <span
                              style={{ color: "var(--color-text-muted)" }}
                            >
                              {" — "}
                              {notif.post.content.slice(0, 40)}
                              {notif.post.content.length > 40 ? "..." : ""}
                            </span>
                          )}
                        </p>
                        <p
                          style={{
                            fontSize: "12px",
                            color: "var(--color-text-muted)",
                            marginTop: "2px",
                          }}
                        >
                          {formatDate(notif.createdAt)}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            )}
          </div>
        </motion.main>

          <RightPanel />
      </div>
    </div>
  );
};

export default Notifications;
