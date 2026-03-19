import { NavLink, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Avatar from "../ui/Avatar";
import useAuthStore from "../../store/authStore";
import { useUnreadCount } from "../../hooks/useUsers";
import useThemeStore from "../../store/themeStore";


const Sidebar = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const { data: unreadCount = 0 } = useUnreadCount();
  const { isDark, toggle } = useThemeStore();


  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const NAV_ITEMS = [
    {
      label: "Feed",
      path: "/feed",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
      ),
    },
    {
      label: "Explore",
      path: "/explore",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
      ),
    },
    {
      label: "Notifications",
      path: "/notifications",
      badge: unreadCount,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
        </svg>
      ),
    },
    {
      label: "Messages",
      path: "/messages",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
      ),
    },
    {
      label: "Profile",
      path: `/profile/${user?.username}`,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
        </svg>
      ),
    },
  ];

  return (
    <motion.aside
    className="hide-mobile"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      style={{
        width: "240px",
        flexShrink: 0,
        position: "sticky",
        top: "24px",
        height: "calc(100vh - 48px)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "8px 0",
      }}
    >
      <div>

        {/* Logo + Dark mode toggle */}
<div style={{ padding: "0 12px 28px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
    <svg width="34" height="34" viewBox="0 0 64 64" fill="none">
      <rect width="64" height="64" rx="14" fill="var(--color-primary)" />
      <path d="M44 20 C44 20 28 16 20 26 C14 33 14 38 20 44 C26 50 40 48 44 46"
        stroke="#f7f7ff" strokeWidth="4.5" strokeLinecap="round" fill="none" />
      <circle cx="46" cy="20" r="3.5" fill="#f7f7ff" opacity="0.8" />
      <circle cx="46" cy="46" r="3.5" fill="#f7f7ff" opacity="0.8" />
    </svg>
    <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "24px", letterSpacing: "0.1em", color: "var(--color-primary)", textTransform: "uppercase" }}>
      Chillax
    </span>
  </div>

  {/* Dark mode toggle */}
  <button
    onClick={toggle}
    title={isDark ? "Light mode" : "Dark mode"}
    style={{
      width: 34, height: 34,
      borderRadius: "50%",
      background: "var(--color-bg-secondary)",
      border: "1px solid var(--color-border)",
      display: "flex", alignItems: "center", justifyContent: "center",
      cursor: "pointer",
      color: "var(--color-text-secondary)",
      transition: "all var(--transition-fast)",
      flexShrink: 0,
    }}
    onMouseEnter={(e) => { e.currentTarget.style.background = "var(--color-accent-soft)"; e.currentTarget.style.color = "var(--color-primary)"; }}
    onMouseLeave={(e) => { e.currentTarget.style.background = "var(--color-bg-secondary)"; e.currentTarget.style.color = "var(--color-text-secondary)"; }}
  >
    {isDark ? (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
      </svg>
    )}
  </button>
</div>

        {/* Nav */}
        <nav style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              style={({ isActive }) => ({
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "11px 14px",
                borderRadius: "var(--radius-md)",
                color: isActive ? "var(--color-primary)" : "var(--color-text-secondary)",
                background: isActive ? "var(--color-accent-soft)" : "transparent",
                fontFamily: "var(--font-display)",
                fontWeight: isActive ? 700 : 500,
                fontSize: "17px",
                letterSpacing: "0.04em",
                transition: "all var(--transition-fast)",
                textDecoration: "none",
                position: "relative",
              })}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--color-bg-secondary)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "";
              }}
            >
              <span style={{ position: "relative", display: "flex" }}>
                {item.icon}
                {item.badge > 0 && (
                  <span style={{
                    position: "absolute",
                    top: "-5px",
                    right: "-6px",
                    background: "var(--color-error)",
                    color: "#fff",
                    fontSize: "9px",
                    fontWeight: 700,
                    borderRadius: "var(--radius-full)",
                    minWidth: "16px",
                    height: "16px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "0 3px",
                    fontFamily: "var(--font-body)",
                  }}>
                    {item.badge > 99 ? "99+" : item.badge}
                  </span>
                )}
              </span>
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* User card */}
      <div
        style={{
          padding: "14px",
          borderRadius: "var(--radius-lg)",
          background: "var(--color-bg-secondary)",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          cursor: "pointer",
          transition: "background var(--transition-fast)",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-border)")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "var(--color-bg-secondary)")}
      >
        <Avatar src={user?.avatar} name={user?.displayName || user?.username} size={38} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "15px", color: "var(--color-text-primary)", letterSpacing: "0.02em", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {user?.displayName || user?.username}
          </p>
          <p style={{ fontSize: "12px", color: "var(--color-text-muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            @{user?.username}
          </p>
        </div>
        <button
          onClick={handleLogout}
          title="Logout"
          style={{ color: "var(--color-text-muted)", display: "flex", padding: "4px", borderRadius: "6px", flexShrink: 0 }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-error)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-muted)")}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
        </button>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
