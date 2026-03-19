const Avatar = ({ src, name = "U", size = 40, isVerified = false }) => {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div style={{ position: "relative", display: "inline-flex", flexShrink: 0 }}>
      <div
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          overflow: "hidden",
          background: src ? "transparent" : "var(--color-primary)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          border: "2px solid var(--color-border)",
        }}
      >
        {src ? (
          <img
            src={src}
            alt={name}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            loading="lazy"
          />
        ) : (
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: size * 0.38,
              color: "#f7f7ff",
              letterSpacing: "0.02em",
            }}
          >
            {initials}
          </span>
        )}
      </div>
      {isVerified && (
        <div
          style={{
            position: "absolute",
            bottom: 0,
            right: 0,
            width: size * 0.32,
            height: size * 0.32,
            background: "var(--color-primary)",
            borderRadius: "50%",
            border: "2px solid var(--color-bg)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg
            width={size * 0.18}
            height={size * 0.18}
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
  );
};

export default Avatar;
