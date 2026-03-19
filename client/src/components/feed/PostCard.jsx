import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Avatar from "../ui/Avatar";
import CommentSection from "./CommentSection";
import { useToggleLike, useDeletePost } from "../../hooks/usePosts";
import useAuthStore from "../../store/authStore";

const formatDate = (dateStr) => {
  const diff = (Date.now() - new Date(dateStr)) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

const ActionButton = ({ icon, label, count, active, color, onClick }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "5px",
        padding: "6px 10px",
        borderRadius: "var(--radius-full)",
        background: active
          ? `${color}15`
          : hovered
          ? "var(--color-bg-secondary)"
          : "transparent",
        color: active
          ? color
          : hovered
          ? "var(--color-text-primary)"
          : "var(--color-text-muted)",
        fontFamily: "var(--font-body)",
        fontSize: "13px",
        fontWeight: 500,
        transition: "all var(--transition-fast)",
        cursor: "pointer",
        minWidth: "44px",
      }}
    >
      {icon}
      <span>{count > 0 ? count : label || ""}</span>
    </button>
  );
};

const PostCard = ({ post }) => {
  const { user } = useAuthStore();
  const { mutate: toggleLike } = useToggleLike();
  const { mutate: deletePost } = useDeletePost();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [imgError, setImgError] = useState(false);

  const isLiked = post.likes?.includes(user?.id);
  const isOwner = post.author?._id === user?.id;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      style={{
        background: "var(--color-bg-card)",
        borderRadius: "var(--radius-lg)",
        padding: "18px 20px",
        border: "1px solid var(--color-border)",
        boxShadow: "var(--shadow-xs)",
        position: "relative",
      }}
      whileHover={{ boxShadow: "var(--shadow-sm)" }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: "12px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Avatar
            src={post.author?.avatar}
            name={post.author?.displayName || post.author?.username}
            size={42}
            isVerified={post.author?.isVerified}
          />
          <div>
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: "15px",
                color: "var(--color-text-primary)",
                letterSpacing: "0.02em",
                display: "block",
              }}
            >
              {post.author?.displayName || post.author?.username}
            </span>
            <span style={{ fontSize: "12px", color: "var(--color-text-muted)" }}>
              @{post.author?.username} · {formatDate(post.createdAt)}
            </span>
          </div>
        </div>

        {isOwner && (
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              style={{
                padding: "6px",
                borderRadius: "var(--radius-full)",
                color: "var(--color-text-muted)",
                display: "flex",
                transition: "background var(--transition-fast)",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "var(--color-bg-secondary)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "transparent")
              }
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="5" cy="12" r="2" />
                <circle cx="12" cy="12" r="2" />
                <circle cx="19" cy="12" r="2" />
              </svg>
            </button>
            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.92, y: -4 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.92, y: -4 }}
                  transition={{ duration: 0.15 }}
                  style={{
                    position: "absolute",
                    right: 0,
                    top: "36px",
                    background: "var(--color-bg-card)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "var(--radius-md)",
                    boxShadow: "var(--shadow-md)",
                    zIndex: 10,
                    overflow: "hidden",
                    minWidth: "140px",
                  }}
                >
                  <button
                    onClick={() => {
                      deletePost(post._id);
                      setMenuOpen(false);
                    }}
                    style={{
                      width: "100%",
                      padding: "10px 16px",
                      textAlign: "left",
                      fontSize: "14px",
                      color: "var(--color-error)",
                      fontFamily: "var(--font-body)",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      transition: "background var(--transition-fast)",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "#fff0f0")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6l-1 14H6L5 6" />
                      <path d="M10 11v6M14 11v6" />
                      <path d="M9 6V4h6v2" />
                    </svg>
                    Delete Post
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Content */}
      <p
        style={{
          fontSize: "15px",
          lineHeight: 1.65,
          color: "var(--color-text-primary)",
          marginBottom: post.images?.length > 0 ? "14px" : "14px",
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
        }}
      >
        {post.content}
      </p>

      {/* Image */}
      {post.images?.length > 0 && !imgError && (
        <div
          style={{
            marginBottom: "14px",
            borderRadius: "var(--radius-md)",
            overflow: "hidden",
            border: "1px solid var(--color-border)",
          }}
        >
          <img
            src={post.images[0]}
            alt="Post image"
            loading="lazy"
            onError={() => setImgError(true)}
            style={{
              width: "100%",
              maxHeight: "400px",
              objectFit: "cover",
              display: "block",
            }}
          />
        </div>
      )}

      {/* Divider */}
      <div
        style={{
          height: "1px",
          background: "var(--color-border)",
          marginBottom: "10px",
        }}
      />

      {/* Action bar */}
      <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
        {/* Like */}
        <ActionButton
          icon={
            <svg width="15" height="15" viewBox="0 0 24 24" fill={isLiked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          }
          count={post.likes?.length || 0}
          active={isLiked}
          color="#e63946"
          onClick={() => toggleLike(post._id)}
        />

        {/* Comment toggle */}
        <ActionButton
          icon={
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          }
          count={post.comments?.length || 0}
          active={showComments}
          color="var(--color-primary)"
          onClick={() => setShowComments(!showComments)}
        />

        {/* Share */}
        <ActionButton
          icon={
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
              <polyline points="16 6 12 2 8 6" />
              <line x1="12" y1="2" x2="12" y2="15" />
            </svg>
          }
          label="Share"
          active={false}
          color="var(--color-accent)"
          onClick={() => {
            navigator.share
              ? navigator.share({ text: post.content, url: window.location.href })
              : navigator.clipboard.writeText(window.location.href);
          }}
        />
      </div>

      {/* Inline Comments */}
      <AnimatePresence>
        {showComments && <CommentSection post={post} />}
      </AnimatePresence>
    </motion.div>
  );
};

export default PostCard;
