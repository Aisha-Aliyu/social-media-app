import { useEffect, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import PostCard from "./PostCard";
import PostSkeleton from "./PostSkeleton";
import { useFeed } from "../../hooks/usePosts";
import Spinner from "../ui/Spinner";

const FeedList = () => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useFeed();

  const loaderRef = useRef(null);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.5 }
    );
    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {[...Array(4)].map((_, i) => <PostSkeleton key={i} />)}
      </div>
    );
  }

  if (isError) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "48px 24px",
          background: "var(--color-bg-card)",
          borderRadius: "var(--radius-lg)",
          border: "1px solid var(--color-border)",
        }}
      >
        <p style={{ fontSize: "32px", marginBottom: "8px" }}>😕</p>
        <p style={{ fontFamily: "var(--font-display)", fontSize: "18px", color: "var(--color-text-secondary)", letterSpacing: "0.04em" }}>
          Failed to load feed
        </p>
        <p style={{ fontSize: "14px", color: "var(--color-text-muted)", marginTop: "4px" }}>
          Check your connection and refresh
        </p>
      </div>
    );
  }

  const allPosts = data?.pages?.flatMap((p) => p.posts) || [];

  if (allPosts.length === 0) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "56px 24px",
          background: "var(--color-bg-card)",
          borderRadius: "var(--radius-lg)",
          border: "1px dashed var(--color-border)",
        }}
      >
        <div
          style={{
            width: 64, height: 64, borderRadius: "50%",
            background: "var(--color-accent-soft)",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 16px",
          }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
        </div>
        <p style={{ fontFamily: "var(--font-display)", fontSize: "20px", fontWeight: 700, color: "var(--color-primary)", letterSpacing: "0.04em", marginBottom: "6px" }}>
          Nothing here yet
        </p>
        <p style={{ fontSize: "14px", color: "var(--color-text-muted)" }}>
          Be the first to post something. The world is waiting.
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <AnimatePresence mode="popLayout">
        {allPosts.map((post) => (
          <PostCard key={post._id} post={post} />
        ))}
      </AnimatePresence>

      {/* Infinite scroll trigger */}
      <div ref={loaderRef} style={{ height: "40px", display: "flex", alignItems: "center", justifyContent: "center" }}>
        {isFetchingNextPage && <Spinner size={22} />}
        {!hasNextPage && allPosts.length > 0 && (
          <p style={{ fontSize: "13px", color: "var(--color-text-muted)" }}>
            You've reached the end ✨
          </p>
        )}
      </div>
    </div>
  );
};

export default FeedList;
