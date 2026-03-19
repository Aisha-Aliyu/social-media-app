import { motion } from "framer-motion";

const TRENDING = [
  { tag: "TechTalks", posts: "12.4K" },
  { tag: "ChillVibes", posts: "8.9K" },
  { tag: "BuildInPublic", posts: "6.2K" },
  { tag: "AfricanTech", posts: "4.8K" },
  { tag: "UIDesign", posts: "3.1K" },
];

const SUGGESTIONS = [
  { username: "design_monk", displayName: "Design Monk" },
  { username: "codewithaisha", displayName: "Code with Aisha" },
  { username: "techvibes_ng", displayName: "TechVibes NG" },
];

const RightPanel = () => (
  <motion.aside
  className="hide-desktop-right"
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
    style={{
      width: "280px",
      flexShrink: 0,
      position: "sticky",
      top: "24px",
      height: "calc(100vh - 48px)",
      overflowY: "auto",
      display: "flex",
      flexDirection: "column",
      gap: "16px",
    }}
  >
    {/* Search bar */}
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        background: "var(--color-bg-secondary)",
        borderRadius: "var(--radius-full)",
        padding: "10px 16px",
        border: "1.5px solid transparent",
        transition: "border-color var(--transition-fast)",
        cursor: "text",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--color-border)")}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = "transparent")}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>
      <span style={{ fontSize: "14px", color: "var(--color-text-muted)" }}>Search Chillax...</span>
    </div>

    {/* Trending */}
    <div
      style={{
        background: "var(--color-bg-card)",
        borderRadius: "var(--radius-lg)",
        border: "1px solid var(--color-border)",
        overflow: "hidden",
      }}
    >
      <div style={{ padding: "16px 18px 12px" }}>
        <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "18px", letterSpacing: "0.06em", color: "var(--color-primary)" }}>
          Trending
        </h3>
      </div>
      {TRENDING.map((item, i) => (
        <div
          key={item.tag}
          style={{
            padding: "10px 18px",
            cursor: "pointer",
            transition: "background var(--transition-fast)",
            borderTop: i === 0 ? "1px solid var(--color-border)" : "none",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-bg-secondary)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
        >
          <p style={{ fontSize: "12px", color: "var(--color-text-muted)", marginBottom: "2px" }}>
            Trending
          </p>
          <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "16px", letterSpacing: "0.04em", color: "var(--color-text-primary)" }}>
            #{item.tag}
          </p>
          <p style={{ fontSize: "12px", color: "var(--color-text-muted)" }}>
            {item.posts} posts
          </p>
        </div>
      ))}
    </div>

    {/* Who to follow */}
    <div
      style={{
        background: "var(--color-bg-card)",
        borderRadius: "var(--radius-lg)",
        border: "1px solid var(--color-border)",
        overflow: "hidden",
      }}
    >
      <div style={{ padding: "16px 18px 12px" }}>
        <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "18px", letterSpacing: "0.06em", color: "var(--color-primary)" }}>
          Who to Follow
        </h3>
      </div>
      {SUGGESTIONS.map((person, i) => (
        <div
          key={person.username}
          style={{
            padding: "10px 18px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            borderTop: i === 0 ? "1px solid var(--color-border)" : "none",
            cursor: "pointer",
            transition: "background var(--transition-fast)",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-bg-secondary)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
        >
          <div style={{
            width: 38, height: 38, borderRadius: "50%",
            background: "var(--color-primary)",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
          }}>
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "15px", color: "#f7f7ff" }}>
              {person.displayName[0]}
            </span>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "14px", color: "var(--color-text-primary)", letterSpacing: "0.02em" }}>
              {person.displayName}
            </p>
            <p style={{ fontSize: "12px", color: "var(--color-text-muted)" }}>
              @{person.username}
            </p>
          </div>
          <button
            style={{
              padding: "5px 14px",
              background: "var(--color-primary)",
              color: "#f7f7ff",
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "13px",
              letterSpacing: "0.06em",
              borderRadius: "var(--radius-full)",
              border: "none",
              cursor: "pointer",
              transition: "background var(--transition-fast)",
              flexShrink: 0,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-primary-dark)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "var(--color-primary)")}
          >
            Follow
          </button>
        </div>
      ))}
    </div>

    <p style={{ fontSize: "11px", color: "var(--color-text-muted)", padding: "0 4px", lineHeight: 1.6 }}>
      © {new Date().getFullYear()} Chillax · Terms · Privacy · About
    </p>
  </motion.aside>
);

export default RightPanel;
