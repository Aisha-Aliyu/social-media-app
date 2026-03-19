import { NavLink } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import { useUnreadCount } from "../../hooks/useUsers";
import useThemeStore from "../../store/themeStore";

const BottomNav = () => {
  const { user } = useAuthStore();
  const { data: unreadCount = 0 } = useUnreadCount();
  const { isDark, toggle } = useThemeStore();

  const items = [
    {
      path: "/feed",
      label: "Home",
      icon: (active) => (
        <svg width="21" height="21" viewBox="0 0 24 24" fill={active ? "var(--color-primary)" : "none"} stroke={active ? "var(--color-primary)" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          <polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
      ),
    },
    {
      path: "/explore",
      label: "Explore",
      icon: (active) => (
        <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke={active ? "var(--color-primary)" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
      ),
    },
    {
      path: "/notifications",
      label: "Alerts",
      badge: unreadCount,
      icon: (active) => (
        <svg width="21" height="21" viewBox="0 0 24 24" fill={active ? "var(--color-primary)" : "none"} stroke={active ? "var(--color-primary)" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
        </svg>
      ),
    },
    {
      path: "/messages",
      label: "DMs",
      icon: (active) => (
        <svg width="21" height="21" viewBox="0 0 24 24" fill={active ? "var(--color-primary)" : "none"} stroke={active ? "var(--color-primary)" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
      ),
    },
    {
      path: `/profile/${user?.username}`,
      label: "Profile",
      icon: (active) => (
        <svg width="21" height="21" viewBox="0 0 24 24" fill={active ? "var(--color-primary)" : "none"} stroke={active ? "var(--color-primary)" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
      ),
    },
  ];

  return (
    <>
      <div style={{ height: "64px", display: "none" }} className="bottom-nav-spacer" />

      <nav
        className="bottom-nav"
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          height: "60px",
          background: "var(--bottom-nav-bg, rgba(247,247,255,0.95))",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderTop: "1px solid var(--color-border)",
          display: "none",
          alignItems: "center",
          justifyContent: "space-around",
          zIndex: 100,
          paddingBottom: "env(safe-area-inset-bottom)",
        }}
      >
        {items.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            style={({ isActive }) => ({
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "3px",
              padding: "4px 8px",
              color: isActive
                ? "var(--color-primary)"
                : "var(--color-text-muted)",
              textDecoration: "none",
              position: "relative",
              flex: 1,
              maxWidth: "60px",
            })}
          >
            {({ isActive }) => (
              <>
                <span style={{ position: "relative", display: "flex" }}>
                  {item.icon(isActive)}
                  {item.badge > 0 && (
                    <span
                      style={{
                        position: "absolute",
                        top: "-4px",
                        right: "-6px",
                        background: "var(--color-error)",
                        color: "#fff",
                        fontSize: "9px",
                        fontWeight: 700,
                        borderRadius: "var(--radius-full)",
                        minWidth: "15px",
                        height: "15px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "0 3px",
                        fontFamily: "var(--font-body)",
                      }}
                    >
                      {item.badge > 99 ? "99+" : item.badge}
                    </span>
                  )}
                </span>
                <span
                  style={{
                    fontSize: "9px",
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                  }}
                >
                  {item.label}
                </span>
              </>
            )}
          </NavLink>
        ))}

        {/* Dark mode toggle */}
        <button
          onClick={toggle}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "3px",
            padding: "4px 8px",
            color: "var(--color-text-muted)",
            flex: 1,
            maxWidth: "60px",
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
        >
          <span style={{ display: "flex" }}>
            {isDark ? (
              // Sun icon
              <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5"/>
                <line x1="12" y1="1" x2="12" y2="3"/>
                <line x1="12" y1="21" x2="12" y2="23"/>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                <line x1="1" y1="12" x2="3" y2="12"/>
                <line x1="21" y1="12" x2="23" y2="12"/>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
              </svg>
            ) : (
              // Moon icon
              <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            )}
          </span>
          <span
            style={{
              fontSize: "9px",
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}
          >
            {isDark ? "Light" : "Dark"}
          </span>
        </button>
      </nav>

      <style>{`
        @media (max-width: 768px) {
          .bottom-nav { display: flex !important; }
          .bottom-nav-spacer { display: block !important; }
        }
      `}</style>
    </>
  );
};

export default BottomNav;
