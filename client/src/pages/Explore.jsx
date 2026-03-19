import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "../components/layout/Sidebar";
import RightPanel from "../components/layout/RightPanel";
import Avatar from "../components/ui/Avatar";
import Spinner from "../components/ui/Spinner";
import {
  useSearchUsers,
  useSuggestions,
  useToggleFollow,
} from "../hooks/useUsers";
import useAuthStore from "../store/authStore";

const UserCard = ({ user, currentUserId, onFollow, isFollowPending }) => {
  const navigate = useNavigate();
  const isFollowing = user.followers?.some(
    (id) => id === currentUserId || id?._id === currentUserId
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "14px",
        padding: "16px",
        background: "var(--color-bg-card)",
        borderRadius: "var(--radius-lg)",
        border: "1px solid var(--color-border)",
        boxShadow: "var(--shadow-xs)",
        cursor: "pointer",
        transition: "box-shadow var(--transition-fast)",
      }}
      whileHover={{ boxShadow: "var(--shadow-sm)" }}
      onClick={() => navigate(`/profile/${user.username}`)}
    >
      <Avatar
        src={user.avatar}
        name={user.displayName || user.username}
        size={52}
        isVerified={user.isVerified}
      />
      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: "17px",
            letterSpacing: "0.02em",
            color: "var(--color-text-primary)",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {user.displayName || user.username}
        </p>
        <p style={{ fontSize: "13px", color: "var(--color-text-muted)" }}>
          @{user.username}
        </p>
        <p
          style={{
            fontSize: "12px",
            color: "var(--color-text-muted)",
            marginTop: "2px",
          }}
        >
          {user.followers?.length || 0} followers
        </p>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onFollow(user._id);
        }}
        disabled={isFollowPending}
        style={{
          padding: "7px 18px",
          background: isFollowing ? "transparent" : "var(--color-primary)",
          color: isFollowing ? "var(--color-primary)" : "#f7f7ff",
          fontFamily: "var(--font-display)",
          fontWeight: 700,
          fontSize: "14px",
          letterSpacing: "0.06em",
          borderRadius: "var(--radius-full)",
          border: "2px solid var(--color-primary)",
          cursor: "pointer",
          transition: "all var(--transition-fast)",
          flexShrink: 0,
          whiteSpace: "nowrap",
        }}
      >
        {isFollowing ? "Following" : "Follow"}
      </button>
    </motion.div>
  );
};

const Explore = () => {
  const [query, setQuery] = useState("");
  const { user: currentUser } = useAuthStore();
  const { data: searchResults = [], isLoading: isSearching } =
    useSearchUsers(query);
  const { data: suggestions = [], isLoading: isSuggestionsLoading } =
    useSuggestions();
  const { mutate: toggleFollow, isPending: isFollowPending } = useToggleFollow();

  const showSearch = query.length >= 1;

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
          style={{
            flex: 1,
            minWidth: 0,
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          {/* Header */}
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
              Explore
            </h1>
            <p
              style={{
                fontSize: "13px",
                color: "var(--color-text-muted)",
                marginTop: "2px",
              }}
            >
              Discover people and conversations
            </p>
          </div>

          {/* Search Input */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              background: "var(--color-bg-card)",
              borderRadius: "var(--radius-full)",
              padding: "12px 20px",
              border: "1.5px solid var(--color-border)",
              boxShadow: "var(--shadow-xs)",
              transition:
                "border-color var(--transition-fast), box-shadow var(--transition-fast)",
            }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--color-text-muted)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ flexShrink: 0 }}
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search people on Chillax..."
              style={{
                flex: 1,
                border: "none",
                outline: "none",
                background: "transparent",
                fontSize: "16px",
                fontFamily: "var(--font-body)",
                color: "var(--color-text-primary)",
                minWidth: 0,
              }}
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                style={{
                  color: "var(--color-text-muted)",
                  display: "flex",
                  flexShrink: 0,
                }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
          </div>

          {/* Results or Suggestions */}
          <AnimatePresence mode="wait">
            {showSearch ? (
              <motion.div
                key="search"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <h2
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: "16px",
                    letterSpacing: "0.08em",
                    color: "var(--color-text-muted)",
                    marginBottom: "12px",
                    textTransform: "uppercase",
                  }}
                >
                  Results for "{query}"
                </h2>
                {isSearching ? (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      padding: "32px",
                    }}
                  >
                    <Spinner size={24} />
                  </div>
                ) : searchResults.length === 0 ? (
                  <div
                    style={{
                      textAlign: "center",
                      padding: "48px",
                      background: "var(--color-bg-card)",
                      borderRadius: "var(--radius-lg)",
                      border: "1px dashed var(--color-border)",
                    }}
                  >
                    <p
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "20px",
                        color: "var(--color-text-muted)",
                        letterSpacing: "0.04em",
                      }}
                    >
                      No users found for "{query}"
                    </p>
                  </div>
                ) : (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "12px",
                    }}
                  >
                    {searchResults.map((user) => (
                      <UserCard
                        key={user._id}
                        user={user}
                        currentUserId={currentUser?.id}
                        onFollow={toggleFollow}
                        isFollowPending={isFollowPending}
                      />
                    ))}
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="suggestions"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <h2
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: "16px",
                    letterSpacing: "0.08em",
                    color: "var(--color-text-muted)",
                    marginBottom: "12px",
                    textTransform: "uppercase",
                  }}
                >
                  People to Follow
                </h2>
                {isSuggestionsLoading ? (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      padding: "32px",
                    }}
                  >
                    <Spinner size={24} />
                  </div>
                ) : suggestions.length === 0 ? (
                  <div
                    style={{
                      textAlign: "center",
                      padding: "48px",
                      background: "var(--color-bg-card)",
                      borderRadius: "var(--radius-lg)",
                      border: "1px dashed var(--color-border)",
                    }}
                  >
                    <p
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "20px",
                        color: "var(--color-text-muted)",
                        letterSpacing: "0.04em",
                      }}
                    >
                      No suggestions yet — invite your friends!
                    </p>
                  </div>
                ) : (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "12px",
                    }}
                  >
                    {suggestions.map((user) => (
                      <UserCard
                        key={user._id}
                        user={user}
                        currentUserId={currentUser?.id}
                        onFollow={toggleFollow}
                        isFollowPending={isFollowPending}
                      />
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.main>

          <RightPanel />
      </div>
    </div>
  );
};

export default Explore;
