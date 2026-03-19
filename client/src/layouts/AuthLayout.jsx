import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const AuthLayout = ({ children, title, subtitle, altText, altLink, altLinkText }) => {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        overflow: "hidden",
      }}
    >
      {/* Left Panel: Branding */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        style={{
          background: "var(--color-primary)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "48px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background geometric texture */}
        <svg
          style={{
            position: "absolute",
            top: 0, right: 0,
            width: "100%", height: "100%",
            opacity: 0.06,
            pointerEvents: "none",
          }}
          viewBox="0 0 500 800"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="400" cy="100" r="220" fill="#f7f7ff" />
          <circle cx="100" cy="700" r="180" fill="#f7f7ff" />
          <circle cx="350" cy="500" r="120" fill="#f7f7ff" />
        </svg>

        {/* Logo */}
        <div style={{ position: "relative", zIndex: 1 }}>
          <Link to="/" style={{ display: "inline-flex", alignItems: "center", gap: "12px" }}>
            <svg width="40" height="40" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="64" height="64" rx="14" fill="rgba(247,247,255,0.12)" />
              <path d="M44 20 C44 20 28 16 20 26 C14 33 14 38 20 44 C26 50 40 48 44 46"
                stroke="#f7f7ff" strokeWidth="4.5" strokeLinecap="round" fill="none" />
              <circle cx="46" cy="20" r="3.5" fill="#f7f7ff" opacity="0.8" />
              <circle cx="46" cy="46" r="3.5" fill="#f7f7ff" opacity="0.8" />
            </svg>
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 800,
                fontSize: "28px",
                letterSpacing: "0.12em",
                color: "#f7f7ff",
                textTransform: "uppercase",
              }}
            >
              Chillax
            </span>
          </Link>
        </div>

        {/* Center quote */}
        <div style={{ position: "relative", zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7 }}
          >
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: "clamp(32px, 4vw, 52px)",
                lineHeight: 1.1,
                color: "#f7f7ff",
                letterSpacing: "0.02em",
                marginBottom: "20px",
              }}
            >
              Where real talk
              <br />
              meets good vibes.
            </p>
            <p style={{ color: "rgba(247,247,255,0.6)", fontSize: "15px", lineHeight: 1.7, maxWidth: "340px" }}>
              Connect with people who get you. Share moments, spark conversations, and keep it real — always.
            </p>
          </motion.div>
        </div>

        {/* Footer note */}
        <p style={{ color: "rgba(247,247,255,0.35)", fontSize: "12px", position: "relative", zIndex: 1 }}>
          © {new Date().getFullYear()} Chillax. All rights reserved.
        </p>
      </motion.div>

      {/* Right Panel: Form */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        style={{
          background: "var(--color-bg)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "48px",
          overflowY: "auto",
        }}
      >
        <div style={{ width: "100%", maxWidth: "400px" }}>
          {/* Form Header */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.5 }}
            style={{ marginBottom: "36px" }}
          >
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 800,
                fontSize: "36px",
                letterSpacing: "0.04em",
                color: "var(--color-primary)",
                lineHeight: 1.1,
                marginBottom: "8px",
              }}
            >
              {title}
            </h1>
            <p style={{ color: "var(--color-text-secondary)", fontSize: "15px" }}>
              {subtitle}
            </p>
          </motion.div>

          {/* Form content injected here */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.5 }}
          >
            {children}
          </motion.div>

          {/* Alt link */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            style={{
              marginTop: "28px",
              textAlign: "center",
              fontSize: "14px",
              color: "var(--color-text-secondary)",
            }}
          >
            {altText}{" "}
            <Link
              to={altLink}
              style={{
                color: "var(--color-primary)",
                fontWeight: 600,
                borderBottom: "1.5px solid transparent",
                transition: "border-color var(--transition-fast)",
              }}
              onMouseEnter={(e) => (e.target.style.borderBottomColor = "var(--color-primary)")}
              onMouseLeave={(e) => (e.target.style.borderBottomColor = "transparent")}
            >
              {altLinkText}
            </Link>
          </motion.p>
        </div>
      </motion.div>

      {/* Responsive mobile */}
      <style>{`
        @media (max-width: 768px) {
          div[style*="grid-template-columns: 1fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
          div[style*="background: var(--color-primary)"] {
            padding: 32px 24px !important;
            min-height: auto !important;
          }
          div[style*="background: var(--color-bg)"] {
            padding: 32px 24px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default AuthLayout;
