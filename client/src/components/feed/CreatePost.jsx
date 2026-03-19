import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Avatar from "../ui/Avatar";
import Spinner from "../ui/Spinner";
import { useCreatePost } from "../../hooks/usePosts";
import useAuthStore from "../../store/authStore";

const MAX_CHARS = 500;

const CreatePost = () => {
  const { user } = useAuthStore();
  const { mutate: createPost, isPending } = useCreatePost();
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [showImageInput, setShowImageInput] = useState(false);
  const [focused, setFocused] = useState(false);
  const [imgPreviewError, setImgPreviewError] = useState(false);
  const isSubmittingRef = useRef(false);

  const remaining = MAX_CHARS - content.length;
  const isOverLimit = remaining < 0;
  const isEmpty = content.trim().length === 0;

  const handleSubmit = () => {
    if (isEmpty || isOverLimit || isPending) return;
    isSubmittingRef.current = true;
    const payload = {
      content: content.trim(),
      ...(imageUrl.trim() && { images: [imageUrl.trim()] }),
    };
    createPost(payload, {
      onSettled: () => {
        isSubmittingRef.current = false;
        setContent("");
        setImageUrl("");
        setShowImageInput(false);
        setFocused(false);
        setImgPreviewError(false);
      },
    });
  };

  const handleBlur = () => {
    setTimeout(() => {
      if (!isSubmittingRef.current) setFocused(false);
    }, 200);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) handleSubmit();
  };

  const circumference = 2 * Math.PI * 10;
  const dashOffset = circumference * (1 - Math.min(content.length / MAX_CHARS, 1));

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        background: "var(--color-bg-card)",
        borderRadius: "var(--radius-lg)",
        padding: "18px 20px",
        border: `1.5px solid ${focused ? "var(--color-primary)" : "var(--color-border)"}`,
        boxShadow: focused
          ? "0 0 0 3px rgba(39,24,126,0.08)"
          : "var(--shadow-xs)",
        transition:
          "border-color var(--transition-base), box-shadow var(--transition-base)",
      }}
    >
      <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
        <Avatar
          src={user?.avatar}
          name={user?.displayName || user?.username}
          size={42}
        />
        <div style={{ flex: 1, minWidth: 0 }}>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            placeholder={`What's on your mind, ${user?.displayName || user?.username}?`}
            rows={focused ? 4 : 2}
            style={{
              width: "100%",
              resize: "none",
              border: "none",
              outline: "none",
              background: "transparent",
              fontSize: "15px",
              fontFamily: "var(--font-body)",
              color: "var(--color-text-primary)",
              lineHeight: 1.6,
            }}
          />

          {/* Image URL input */}
          <AnimatePresence>
            {showImageInput && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                style={{ overflow: "hidden", marginBottom: "10px" }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    background: "var(--color-bg-secondary)",
                    borderRadius: "var(--radius-md)",
                    padding: "8px 12px",
                    border: "1px solid var(--color-border)",
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                  <input
                    value={imageUrl}
                    onChange={(e) => {
                      setImageUrl(e.target.value);
                      setImgPreviewError(false);
                    }}
                    placeholder="Paste image URL..."
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
                  {imageUrl && (
                    <button
                      onClick={() => {
                        setImageUrl("");
                        setImgPreviewError(false);
                      }}
                      style={{ color: "var(--color-text-muted)", display: "flex" }}
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  )}
                </div>
                {/* Image preview */}
                {imageUrl && !imgPreviewError && (
                  <div
                    style={{
                      marginTop: "8px",
                      borderRadius: "var(--radius-md)",
                      overflow: "hidden",
                      border: "1px solid var(--color-border)",
                    }}
                  >
                    <img
                      src={imageUrl}
                      alt="Preview"
                      onError={() => setImgPreviewError(true)}
                      style={{
                        width: "100%",
                        maxHeight: "200px",
                        objectFit: "cover",
                        display: "block",
                      }}
                    />
                  </div>
                )}
                {imgPreviewError && (
                  <p style={{ fontSize: "12px", color: "var(--color-error)", marginTop: "4px" }}>
                    Invalid image URL
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {focused && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                style={{ overflow: "hidden" }}
              >
                <div style={{ height: "1px", background: "var(--color-border)", margin: "10px 0" }} />
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  {/* Toolbar */}
                  <div style={{ display: "flex", gap: "4px" }}>
                    {/* Image toggle button */}
                    <button
                      onMouseDown={(e) => {
                        e.preventDefault();
                        setShowImageInput(!showImageInput);
                      }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                        padding: "5px 10px",
                        borderRadius: "var(--radius-full)",
                        background: showImageInput
                          ? "var(--color-accent-soft)"
                          : "transparent",
                        color: showImageInput
                          ? "var(--color-primary)"
                          : "var(--color-text-muted)",
                        fontSize: "12px",
                        fontFamily: "var(--font-body)",
                        fontWeight: 500,
                        transition: "all var(--transition-fast)",
                        cursor: "pointer",
                      }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <polyline points="21 15 16 10 5 21" />
                      </svg>
                      Photo
                    </button>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    {/* Circle counter */}
                    <div style={{ position: "relative", width: 26, height: 26 }}>
                      <svg width="26" height="26" viewBox="0 0 28 28" style={{ transform: "rotate(-90deg)" }}>
                        <circle cx="14" cy="14" r="10" fill="none" stroke="var(--color-border)" strokeWidth="2.5" />
                        <circle
                          cx="14" cy="14" r="10" fill="none"
                          stroke={isOverLimit ? "var(--color-error)" : remaining <= 50 ? "var(--color-warning)" : "var(--color-primary)"}
                          strokeWidth="2.5"
                          strokeDasharray={circumference}
                          strokeDashoffset={dashOffset}
                          strokeLinecap="round"
                          style={{ transition: "stroke-dashoffset 0.2s, stroke 0.2s" }}
                        />
                      </svg>
                      {remaining <= 50 && (
                        <span style={{
                          position: "absolute", inset: 0,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: "8px", fontWeight: 700,
                          color: isOverLimit ? "var(--color-error)" : "var(--color-text-secondary)",
                        }}>
                          {remaining}
                        </span>
                      )}
                    </div>

                    {/* Post button */}
                    <button
                      onMouseDown={(e) => {
                        e.preventDefault();
                        handleSubmit();
                      }}
                      disabled={isEmpty || isOverLimit || isPending}
                      style={{
                        padding: "7px 20px",
                        background: isEmpty || isOverLimit ? "var(--color-bg-secondary)" : "var(--color-primary)",
                        color: isEmpty || isOverLimit ? "var(--color-text-muted)" : "#f7f7ff",
                        fontFamily: "var(--font-display)",
                        fontWeight: 700,
                        fontSize: "14px",
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        borderRadius: "var(--radius-full)",
                        border: "none",
                        cursor: isEmpty || isOverLimit || isPending ? "not-allowed" : "pointer",
                        transition: "all var(--transition-fast)",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        boxShadow: isEmpty || isOverLimit ? "none" : "var(--shadow-sm)",
                      }}
                    >
                      {isPending ? <Spinner size={13} color="#f7f7ff" /> : null}
                      {isPending ? "Posting..." : "Post"}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default CreatePost;
