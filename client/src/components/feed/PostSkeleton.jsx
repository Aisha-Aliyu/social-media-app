const shimmer = `
  @keyframes shimmer {
    0% { background-position: -600px 0; }
    100% { background-position: 600px 0; }
  }
`;

const SkeletonBlock = ({ width = "100%", height = 14, radius = 6, style = {} }) => (
  <>
    <style>{shimmer}</style>
    <div
      style={{
        width,
        height,
        borderRadius: radius,
        background: "linear-gradient(90deg, var(--color-bg-secondary) 25%, #e8e8f5 50%, var(--color-bg-secondary) 75%)",
        backgroundSize: "600px 100%",
        animation: "shimmer 1.4s infinite linear",
        ...style,
      }}
    />
  </>
);

const PostSkeleton = () => (
  <div
    style={{
      background: "var(--color-bg-card)",
      borderRadius: "var(--radius-lg)",
      padding: "20px",
      border: "1px solid var(--color-border)",
      display: "flex",
      flexDirection: "column",
      gap: "14px",
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
      <SkeletonBlock width={44} height={44} radius={50} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "8px" }}>
        <SkeletonBlock width="40%" height={13} />
        <SkeletonBlock width="25%" height={11} />
      </div>
    </div>
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <SkeletonBlock width="100%" height={13} />
      <SkeletonBlock width="90%" height={13} />
      <SkeletonBlock width="70%" height={13} />
    </div>
    <div style={{ display: "flex", gap: "20px", paddingTop: "4px" }}>
      <SkeletonBlock width={60} height={28} radius={8} />
      <SkeletonBlock width={60} height={28} radius={8} />
      <SkeletonBlock width={60} height={28} radius={8} />
    </div>
  </div>
);

export default PostSkeleton;
