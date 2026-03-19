import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import useThemeStore from "../store/themeStore";

const FEATURES = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    ),
    title: "Real Conversations",
    desc: "No algorithm games. Just honest talk with people who get you.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
      </svg>
    ),
    title: "Real-time Everything",
    desc: "Messages, notifications, and updates happen instantly. No refresh needed.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
      </svg>
    ),
    title: "Built for Everyone",
    desc: "Dark mode, mobile-first, lightning fast. Works beautifully on any device.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
    title: "Privacy First",
    desc: "Your data stays yours. No ads, no selling your information. Ever.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    title: "Your Community",
    desc: "Follow people you actually like. Build a feed that reflects you.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2"/>
        <circle cx="8.5" cy="8.5" r="1.5"/>
        <polyline points="21 15 16 10 5 21"/>
      </svg>
    ),
    title: "Share Moments",
    desc: "Post text and images. Tell your story the way you want.",
  },
];

const TESTIMONIALS = [
  {
    name: "Aisha A.",
    handle: "@codewithaisha",
    text: "Finally a social app that doesn't feel like a chore. The vibe is immaculate.",
    avatar: "A",
  },
  {
    name: "Kwame D.",
    handle: "@design_monk",
    text: "Dark mode is elite. The UI is so clean I thought I was dreaming.",
    avatar: "K",
  },
  {
    name: "Zara T.",
    handle: "@techvibes_ng",
    text: "Real-time DMs actually work instantly. This is the future fr.",
    avatar: "Z",
  },
];

const Landing = () => {
  const navigate = useNavigate();
  const { isDark, toggle } = useThemeStore();
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--color-bg)",
        overflowX: "hidden",
      }}
    >
      {/* ---- NAVBAR ---- */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          padding: "0 24px",
          height: "64px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "rgba(247,247,255,0.85)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid var(--color-border)",
        }}
        className="landing-nav"
      >
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <svg width="32" height="32" viewBox="0 0 64 64" fill="none">
            <rect width="64" height="64" rx="14" fill="var(--color-primary)" />
            <path
              d="M44 20 C44 20 28 16 20 26 C14 33 14 38 20 44 C26 50 40 48 44 46"
              stroke="#f7f7ff"
              strokeWidth="4.5"
              strokeLinecap="round"
              fill="none"
            />
            <circle cx="46" cy="20" r="3.5" fill="#f7f7ff" opacity="0.8" />
            <circle cx="46" cy="46" r="3.5" fill="#f7f7ff" opacity="0.8" />
          </svg>
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: "22px",
              letterSpacing: "0.1em",
              color: "var(--color-primary)",
              textTransform: "uppercase",
            }}
          >
            Chillax
          </span>
        </div>

        {/* Desktop nav links */}
        <div
          className="nav-links"
          style={{ display: "flex", alignItems: "center", gap: "32px" }}
        >
          {["Features", "Community", "About"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 600,
                fontSize: "15px",
                letterSpacing: "0.06em",
                color: "var(--color-text-secondary)",
                textTransform: "uppercase",
                transition: "color var(--transition-fast)",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "var(--color-primary)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "var(--color-text-secondary)")
              }
            >
              {item}
            </a>
          ))}
        </div>

        {/* CTA + Dark mode */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <button
            onClick={toggle}
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: "var(--color-bg-secondary)",
              border: "1px solid var(--color-border)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "var(--color-text-secondary)",
              transition: "all var(--transition-fast)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--color-accent-soft)";
              e.currentTarget.style.color = "var(--color-primary)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "var(--color-bg-secondary)";
              e.currentTarget.style.color = "var(--color-text-secondary)";
            }}
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

          <button
            onClick={() => navigate("/login")}
            style={{
              padding: "8px 18px",
              background: "transparent",
              color: "var(--color-primary)",
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "14px",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
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
            Sign In
          </button>

          <button
            onClick={() => navigate("/register")}
            style={{
              padding: "8px 18px",
              background: "var(--color-primary)",
              color: "#f7f7ff",
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "14px",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              borderRadius: "var(--radius-full)",
              border: "none",
              cursor: "pointer",
              transition: "all var(--transition-fast)",
              boxShadow: "var(--shadow-md)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--color-primary-dark)";
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "var(--color-primary)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            Join Free
          </button>
        </div>
      </nav>

      {/* ---- HERO ---- */}
      <section
        ref={heroRef}
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
          paddingTop: "64px",
        }}
      >
        {/* Background blobs */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            overflow: "hidden",
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "10%",
              right: "5%",
              width: "500px",
              height: "500px",
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(39,24,126,0.12) 0%, transparent 70%)",
              filter: "blur(40px)",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "10%",
              left: "5%",
              width: "400px",
              height: "400px",
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(75,63,212,0.1) 0%, transparent 70%)",
              filter: "blur(40px)",
            }}
          />
        </div>

        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <div
            style={{
              textAlign: "center",
              maxWidth: "800px",
              padding: "0 24px",
              position: "relative",
              zIndex: 1,
            }}
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "6px 16px",
                background: "var(--color-accent-soft)",
                borderRadius: "var(--radius-full)",
                marginBottom: "28px",
                border: "1px solid rgba(39,24,126,0.2)",
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "#1db954",
                  animation: "pulse 2s infinite",
                }}
              />
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: "13px",
                  letterSpacing: "0.1em",
                  color: "var(--color-primary)",
                  textTransform: "uppercase",
                }}
              >
                Now Live — Join the community
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7 }}
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 800,
                fontSize: "clamp(52px, 10vw, 96px)",
                lineHeight: 0.95,
                letterSpacing: "-0.01em",
                color: "var(--color-primary)",
                marginBottom: "24px",
              }}
            >
              Where Real Talk
              <br />
              <span
                style={{
                  background:
                    "linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Meets Good Vibes.
              </span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.6 }}
              style={{
                fontSize: "clamp(16px, 2.5vw, 20px)",
                color: "var(--color-text-secondary)",
                lineHeight: 1.7,
                maxWidth: "560px",
                margin: "0 auto 40px",
              }}
            >
              Connect with people who get you. Share moments, spark
              conversations, and keep it real — always. No ads. No noise. Just
              Chillax.
            </motion.p>

            {/* CTA buttons */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              style={{
                display: "flex",
                gap: "14px",
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <button
                onClick={() => navigate("/register")}
                style={{
                  padding: "16px 36px",
                  background: "var(--color-primary)",
                  color: "#f7f7ff",
                  fontFamily: "var(--font-display)",
                  fontWeight: 800,
                  fontSize: "18px",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  borderRadius: "var(--radius-full)",
                  border: "none",
                  cursor: "pointer",
                  transition: "all var(--transition-base)",
                  boxShadow: "var(--shadow-lg)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-3px)";
                  e.currentTarget.style.boxShadow = "var(--shadow-xl)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "var(--shadow-lg)";
                }}
              >
                Get Started. It's Free
              </button>
              <button
                onClick={() => navigate("/login")}
                style={{
                  padding: "16px 36px",
                  background: "transparent",
                  color: "var(--color-primary)",
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: "18px",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  borderRadius: "var(--radius-full)",
                  border: "2px solid var(--color-primary)",
                  cursor: "pointer",
                  transition: "all var(--transition-base)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "var(--color-accent-soft)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                Sign In
              </button>
            </motion.div>

            {/* Social proof */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              style={{
                marginTop: "24px",
                fontSize: "13px",
                color: "var(--color-text-muted)",
              }}
            >
              ✨ Free forever · No credit card · No ads
            </motion.p>
          </div>
        </motion.div>
      </section>

      {/* ---- FEATURES ---- */}
      <section
        id="features"
        style={{
          padding: "100px 24px",
          maxWidth: "1100px",
          margin: "0 auto",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          style={{ textAlign: "center", marginBottom: "64px" }}
        >
          <p
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "13px",
              letterSpacing: "0.14em",
              color: "var(--color-primary)",
              textTransform: "uppercase",
              marginBottom: "12px",
            }}
          >
            Why Chillax
          </p>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: "clamp(36px, 6vw, 60px)",
              color: "var(--color-text-primary)",
              letterSpacing: "0.02em",
              lineHeight: 1.05,
            }}
          >
            Built different.
            <br />
            <span style={{ color: "var(--color-primary)" }}>
              Built for you.
            </span>
          </h2>
        </motion.div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "20px",
          }}
        >
          {FEATURES.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              style={{
                background: "var(--color-bg-card)",
                borderRadius: "var(--radius-lg)",
                padding: "28px",
                border: "1px solid var(--color-border)",
                boxShadow: "var(--shadow-xs)",
                transition:
                  "transform var(--transition-base), box-shadow var(--transition-base)",
              }}
              whileHover={{
                y: -4,
                boxShadow: "var(--shadow-md)",
              }}
            >
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: "var(--radius-md)",
                  background: "var(--color-accent-soft)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--color-primary)",
                  marginBottom: "18px",
                }}
              >
                {feature.icon}
              </div>
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 800,
                  fontSize: "20px",
                  letterSpacing: "0.04em",
                  color: "var(--color-text-primary)",
                  marginBottom: "8px",
                }}
              >
                {feature.title}
              </h3>
              <p
                style={{
                  fontSize: "15px",
                  color: "var(--color-text-secondary)",
                  lineHeight: 1.65,
                }}
              >
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ---- COMMUNITY / TESTIMONIALS ---- */}
      <section
        id="community"
        style={{
          padding: "100px 24px",
          background: "var(--color-bg-secondary)",
        }}
      >
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            style={{ textAlign: "center", marginBottom: "64px" }}
          >
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: "13px",
                letterSpacing: "0.14em",
                color: "var(--color-primary)",
                textTransform: "uppercase",
                marginBottom: "12px",
              }}
            >
              The Community
            </p>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 800,
                fontSize: "clamp(36px, 6vw, 60px)",
                color: "var(--color-text-primary)",
                letterSpacing: "0.02em",
                lineHeight: 1.05,
              }}
            >
              Real people.
              <br />
              <span style={{ color: "var(--color-primary)" }}>
                Real energy.
              </span>
            </h2>
          </motion.div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "20px",
            }}
          >
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={t.handle}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                style={{
                  background: "var(--color-bg-card)",
                  borderRadius: "var(--radius-lg)",
                  padding: "28px",
                  border: "1px solid var(--color-border)",
                  boxShadow: "var(--shadow-xs)",
                }}
              >
                {/* Stars */}
                <div
                  style={{
                    display: "flex",
                    gap: "3px",
                    marginBottom: "16px",
                  }}
                >
                  {[...Array(5)].map((_, j) => (
                    <svg
                      key={j}
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="var(--color-primary)"
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  ))}
                </div>
                <p
                  style={{
                    fontSize: "16px",
                    color: "var(--color-text-primary)",
                    lineHeight: 1.7,
                    marginBottom: "20px",
                    fontStyle: "italic",
                  }}
                >
                  "{t.text}"
                </p>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                  }}
                >
                  <div
                    style={{
                      width: 42,
                      height: 42,
                      borderRadius: "50%",
                      background: "var(--color-primary)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: "var(--font-display)",
                      fontWeight: 700,
                      fontSize: "18px",
                      color: "#f7f7ff",
                    }}
                  >
                    {t.avatar}
                  </div>
                  <div>
                    <p
                      style={{
                        fontFamily: "var(--font-display)",
                        fontWeight: 700,
                        fontSize: "15px",
                        color: "var(--color-text-primary)",
                      }}
                    >
                      {t.name}
                    </p>
                    <p
                      style={{
                        fontSize: "13px",
                        color: "var(--color-text-muted)",
                      }}
                    >
                      {t.handle}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- CTA SECTION ---- */}
      <section
        style={{
          padding: "120px 24px",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse at center, rgba(39,24,126,0.08) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          style={{ position: "relative", zIndex: 1 }}
        >
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: "clamp(40px, 8vw, 80px)",
              lineHeight: 1,
              letterSpacing: "0.02em",
              color: "var(--color-primary)",
              marginBottom: "20px",
            }}
          >
            Ready to
            <br />
            Chillax?
          </h2>
          <p
            style={{
              fontSize: "18px",
              color: "var(--color-text-secondary)",
              marginBottom: "40px",
              maxWidth: "400px",
              margin: "0 auto 40px",
              lineHeight: 1.7,
            }}
          >
            Join thousands of people keeping it real. It's free. Always will be.
          </p>
          <button
            onClick={() => navigate("/register")}
            style={{
              padding: "18px 48px",
              background: "var(--color-primary)",
              color: "#f7f7ff",
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: "20px",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              borderRadius: "var(--radius-full)",
              border: "none",
              cursor: "pointer",
              transition: "all var(--transition-base)",
              boxShadow: "var(--shadow-xl)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-4px) scale(1.02)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0) scale(1)";
            }}
          >
            Create Your Account
          </button>
        </motion.div>
      </section>

      {/* ---- FOOTER ---- */}
      <footer
        style={{
          padding: "32px 24px",
          borderTop: "1px solid var(--color-border)",
          background: "var(--color-bg-secondary)",
        }}
      >
        <div
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "16px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <svg width="24" height="24" viewBox="0 0 64 64" fill="none">
              <rect width="64" height="64" rx="14" fill="var(--color-primary)" />
              <path
                d="M44 20 C44 20 28 16 20 26 C14 33 14 38 20 44 C26 50 40 48 44 46"
                stroke="#f7f7ff"
                strokeWidth="4.5"
                strokeLinecap="round"
                fill="none"
              />
            </svg>
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 800,
                fontSize: "16px",
                letterSpacing: "0.1em",
                color: "var(--color-primary)",
                textTransform: "uppercase",
              }}
            >
              Chillax
            </span>
          </div>
          <p
            style={{ fontSize: "13px", color: "var(--color-text-muted)" }}
          >
            © {new Date().getFullYear()} Chillax. Made with 💜 for real people.
          </p>
          <div style={{ display: "flex", gap: "20px" }}>
            {["Privacy", "Terms", "About"].map((item) => (
              <a
                key={item}
                href="#"
                style={{
                  fontSize: "13px",
                  color: "var(--color-text-muted)",
                  transition: "color var(--transition-fast)",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "var(--color-primary)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "var(--color-text-muted)")
                }
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.2); }
        }
        .landing-nav {
          background: rgba(247,247,255,0.85) !important;
        }
        [data-dark="true"] .landing-nav {
          background: rgba(15,14,23,0.85) !important;
        }
        @media (max-width: 768px) {
          .nav-links { display: none !important; }
        }
      `}</style>
    </div>
  );
};

export default Landing;
