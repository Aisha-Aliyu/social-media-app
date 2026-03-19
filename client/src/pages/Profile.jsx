import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Sidebar from "../components/layout/Sidebar";
import RightPanel from "../components/layout/RightPanel";
import PostCard from "../components/feed/PostCard";
import PostSkeleton from "../components/feed/PostSkeleton";
import Avatar from "../components/ui/Avatar";
import Spinner from "../components/ui/Spinner";
import { useUserProfile, useToggleFollow } from "../hooks/useUsers";
import useAuthStore from "../store/authStore";

const StatBox = ({ label, value }) => (
  <div style={{ textAlign: "center" }}>
    <p
      style={{
        fontFamily: "var(--font-display)",
        fontWeight: 800,
        fontSize: "22px",
        color: "var(--color-primary)",
        letterSpacing: "0.04em",
      }}
    >
      {value ?? 0}
    </p>
    <p
      style={{
        fontSize: "12px",
        color: "var(--color-text-muted)",
        textTransform: "uppercase",
        letterSpacing: "0.08em",
        fontWeight: 600,
      }}
    >
      {label}
    </p>
  </div>
);

const Profile = () => {
  const { username } = useParams();
  const { user: currentUser } = useAuthStore();
  const navigate = useNavigate();
  const { data, isLoading, isError } = useUserProfile(username);
  const { mutate: toggleFollow, isPending: isFollowPending } = useToggleFollow();
  const [activeTab, setActiveTab] = useState("posts");

  const isOwn = currentUser?.username === username;
  const profileUser = data?.user;
  const posts = data?.posts || [];
  const isFollowing = profileUser?.followers?.some(
    (id) => id === currentUser?.id || id?._id === currentUser?.id
  );

  const LayoutShell = ({ children }) => (
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
            gap: "16px",
          }}
        >
          {children}
        </motion.main>
          <RightPanel />
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <LayoutShell>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "300px",
          }}
        >
          <Spinner size={32} />
        </div>
      </LayoutShell>
    );
  }

  if (isError || !profileUser) {
    return (
      <LayoutShell>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "300px",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "24px",
              color: "var(--color-primary)",
            }}
          >
            User not found
          </p>
          <button
            onClick={() => navigate("/feed")}
            style={{
              color: "var(--color-primary)",
              fontSize: "14px",
              textDecoration: "underline",
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
          >
            Back to Feed
          </button>
        </div>
      </LayoutShell>
    );
  }

  return (
    <LayoutShell>
      {/* Profile Card */}
      <div
        style={{
          background: "var(--color-bg-card)",
          borderRadius: "var(--radius-lg)",
          border: "1px solid var(--color-border)",
          overflow: "hidden",
          boxShadow: "var(--shadow-xs)",
        }}
      >
        {/* Cover Photo */}
        <div
          style={{
            height: "160px",
            background: profileUser.coverPhoto
              ? `url(${profileUser.coverPhoto}) center/cover`
              : "linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%)",
            position: "relative",
          }}
        >
          <svg
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              opacity: 0.08,
              pointerEvents: "none",
            }}
            viewBox="0 0 400 160"
          >
            <circle cx="350" cy="20" r="120" fill="#f7f7ff" />
            <circle cx="50" cy="140" r="80" fill="#f7f7ff" />
          </svg>
        </div>

        <div style={{ padding: "0 24px 24px" }}>
          {/* Avatar + Actions */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              marginTop: "-36px",
              marginBottom: "16px",
            }}
          >
            <div
              style={{
                border: "4px solid var(--color-bg-card)",
                borderRadius: "50%",
                background: "var(--color-bg-card)",
              }}
            >
              <Avatar
                src={profileUser.avatar}
                name={profileUser.displayName || profileUser.username}
                size={80}
                isVerified={profileUser.isVerified}
              />
            </div>

            {isOwn ? (
              <button
                onClick={() => navigate("/settings")}
                style={{
                  padding: "8px 20px",
                  background: "transparent",
                  color: "var(--color-primary)",
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: "15px",
                  letterSpacing: "0.06em",
                  borderRadius: "var(--radius-full)",
                  border: "2px solid var(--color-primary)",
                  cursor: "pointer",
                  transition: "all var(--transition-fast)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "var(--color-primary)";
                  e.currentTarget.style.color = "#f7f7ff";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "var(--color-primary)";
                }}
              >
                Edit Profile
              </button>
            ) : (
              <button
                onClick={() => toggleFollow(profileUser._id)}
                disabled={isFollowPending}
                style={{
                  padding: "8px 22px",
                  background: isFollowing
                    ? "transparent"
                    : "var(--color-primary)",
                  color: isFollowing ? "var(--color-primary)" : "#f7f7ff",
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: "15px",
                  letterSpacing: "0.06em",
                  borderRadius: "var(--radius-full)",
                  border: "2px solid var(--color-primary)",
                  cursor: isFollowPending ? "not-allowed" : "pointer",
                  transition: "all var(--transition-fast)",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                {isFollowPending ? (
                  <Spinner
                    size={14}
                    color={isFollowing ? "var(--color-primary)" : "#f7f7ff"}
                  />
                ) : null}
                {isFollowing ? "Following" : "Follow"}
              </button>
            )}
          </div>

          {/* Name + Bio */}
          <div style={{ marginBottom: "18px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "2px",
              }}
            >
              <h1
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 800,
                  fontSize: "24px",
                  letterSpacing: "0.04em",
                  color: "var(--color-text-primary)",
                }}
              >
                {profileUser.displayName || profileUser.username}
              </h1>
              {profileUser.isVerified && (
                <div
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    background: "var(--color-primary)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <svg
                    width="11"
                    height="11"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M20 6L9 17L4 12"
                      stroke="#f7f7ff"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              )}
            </div>
            <p
              style={{
                fontSize: "14px",
                color: "var(--color-text-muted)",
                marginBottom: "10px",
              }}
            >
              @{profileUser.username}
            </p>
            {profileUser.bio && (
              <p
                style={{
                  fontSize: "15px",
                  color: "var(--color-text-secondary)",
                  lineHeight: 1.6,
                }}
              >
                {profileUser.bio}
              </p>
            )}
          </div>

          {/* Stats */}
          <div
            style={{
              display: "flex",
              gap: "32px",
              paddingTop: "16px",
              borderTop: "1px solid var(--color-border)",
            }}
          >
            <StatBox label="Posts" value={profileUser.postsCount} />
            <StatBox label="Followers" value={profileUser.followersCount} />
            <StatBox label="Following" value={profileUser.followingCount} />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div
        style={{
          display: "flex",
          background: "var(--color-bg-card)",
          borderRadius: "var(--radius-lg)",
          border: "1px solid var(--color-border)",
          overflow: "hidden",
        }}
      >
        {["posts", "likes"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              flex: 1,
              padding: "14px",
              background: "transparent",
              color:
                activeTab === tab
                  ? "var(--color-primary)"
                  : "var(--color-text-muted)",
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "16px",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              borderBottom:
                activeTab === tab
                  ? "2px solid var(--color-primary)"
                  : "2px solid transparent",
              cursor: "pointer",
              transition: "all var(--transition-fast)",
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Posts list */}
      {posts.length === 0 ? (
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
            No posts yet
          </p>
        </div>
      ) : (
        <div
          style={{ display: "flex", flexDirection: "column", gap: "16px" }}
        >
          {posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      )}
    </LayoutShell>
  );
};

export default Profile;
