import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Avatar from "../ui/Avatar";
import Spinner from "../ui/Spinner";
import { useAddComment, useDeleteComment } from "../../hooks/usePosts";
import useAuthStore from "../../store/authStore";

const formatDate = (dateStr) => {
  const diff = (Date.now() - new Date(dateStr)) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  return `${Math.floor(diff / 86400)}d`;
};

const CommentSection = ({ post }) => {
  const { user } = useAuthStore();
  const [text, setText] = useState("");
  const { mutate: addComment, isPending: isAdding } = useAddComment();
  const { mutate: deleteComment } = useDeleteComment();
  const inputRef = useRef(null);
  const isSubmittingRef = useRef(false);

  const handleSubmit = () => {
    if (!text.trim() || isAdding) return;
    isSubmittingRef.current = true;
    addComment(
      { postId: post._id, text: text.trim() },
      {
        onSettled: () => {
          isSubmittingRef.current = false;
          setText("");
        },
      }
    );
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      style={{ overflow: "hidden" }}
    >
      <div
        style={{
          borderTop: "1px solid var(--color-border)",
          paddingTop: "14px",
          marginTop: "4px",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        {/* Existing comments */}
        {post.comments?.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <AnimatePresence>
              {post.comments.map((comment) => (
                <motion.div
                  key={comment._id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  style={{
                    display: "flex",
                    gap: "10px",
                    alignItems: "flex-start",
                    padding: "10px 12px",
                    background: "var(--color-bg-secondary)",
                    borderRadius: "var(--radius-md)",
                  }}
                >
                  <Avatar
                    src={comment.user?.avatar}
                    name={comment.user?.displayName || comment.user?.username || "U"}
                    size={32}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "3px" }}>
                      <span
                        style={{
                          fontFamily: "var(--font-display)",
                          fontWeight: 700,
                          fontSize: "13px",
                          color: "var(--color-text-primary)",
                          letterSpacing: "0.02em",
                        }}
                      >
                        {comment.user?.displayName || comment.user?.username}
                      </span>
                      <span style={{ fontSize: "11px", color: "var(--color-text-muted)" }}>
                        · {formatDate(comment.createdAt)}
                      </span>
                    </div>
                    <p
                      style={{
                        fontSize: "14px",
                        color: "var(--color-text-secondary)",
                        lineHeight: 1.5,
                        wordBreak: "break-word",
                      }}
                    >
                      {comment.text}
                    </p>
                  </div>

                  {/* Delete comment, only for comment author */}
                  {comment.user?._id === user?.id && (
                    <button
                      onClick={() =>
                        deleteComment({ postId: post._id, commentId: comment._id })
                      }
                      style={{
                        color: "var(--color-text-muted)",
                        display: "flex",
                        padding: "2px",
                        borderRadius: "4px",
                        flexShrink: 0,
                        transition: "color var(--transition-fast)",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color = "var(--color-error)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color = "var(--color-text-muted)")
                      }
                      title="Delete comment"
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6l-1 14H6L5 6" />
                        <path d="M10 11v6M14 11v6" />
                        <path d="M9 6V4h6v2" />
                      </svg>
                    </button>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Add comment input */}
        <div style={{ display: "flex", gap: "10px", alignItems: "flex-end" }}>
          <Avatar src={user?.avatar} name={user?.displayName || user?.username} size={32} />
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              gap: "8px",
              background: "var(--color-bg-secondary)",
              borderRadius: "var(--radius-full)",
              padding: "8px 14px",
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
              ref={inputRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Write a comment..."
              maxLength={300}
              style={{
                flex: 1,
                border: "none",
                outline: "none",
                background: "transparent",
                fontSize: "14px",
                fontFamily: "var(--font-body)",
                color: "var(--color-text-primary)",
                minWidth: 0,
              }}
            />
            <button
              onMouseDown={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
              disabled={!text.trim() || isAdding}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 28,
                height: 28,
                borderRadius: "50%",
                background:
                  !text.trim() || isAdding
                    ? "var(--color-border)"
                    : "var(--color-primary)",
                color: "#f7f7ff",
                flexShrink: 0,
                transition: "background var(--transition-fast)",
                cursor: !text.trim() || isAdding ? "not-allowed" : "pointer",
              }}
            >
              {isAdding ? (
                <Spinner size={12} color="#f7f7ff" />
              ) : (
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CommentSection;
