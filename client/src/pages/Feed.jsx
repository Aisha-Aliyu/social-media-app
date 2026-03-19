import { lazy, Suspense } from "react";
import { motion } from "framer-motion";
import Sidebar from "../components/layout/Sidebar";
import RightPanel from "../components/layout/RightPanel";
import CreatePost from "../components/feed/CreatePost";
import FeedList from "../components/feed/FeedList";
import PostSkeleton from "../components/feed/PostSkeleton";

const Feed = () => {
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
        {/* Sidebar but hidden on mobile */}
          <Sidebar />

        {/* Main Feed */}
        <motion.main
          className="main-content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          style={{
            flex: 1,
            minWidth: 0,
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          <div style={{ padding: "4px 0 8px" }}>
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 800,
                fontSize: "28px",
                letterSpacing: "0.06em",
                color: "var(--color-primary)",
              }}
            >
              Your Feed
            </h1>
            <p
              style={{
                fontSize: "13px",
                color: "var(--color-text-muted)",
                marginTop: "2px",
              }}
            >
              What's happening in your world
            </p>
          </div>

          <CreatePost />

          <Suspense
            fallback={
              <div
                style={{ display: "flex", flexDirection: "column", gap: "16px" }}
              >
                {[...Array(3)].map((_, i) => (
                  <PostSkeleton key={i} />
                ))}
              </div>
            }
          >
            <FeedList />
          </Suspense>
        </motion.main>

        {/* Right Panel but hidden on tablet + mobile */}
          <RightPanel />
      </div>
    </div>
  );
};

export default Feed;
