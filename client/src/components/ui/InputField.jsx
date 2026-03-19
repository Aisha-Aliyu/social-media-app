import { useState } from "react";

const InputField = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  error,
  autoComplete,
  icon: Icon,
}) => {
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const inputType = type === "password" ? (showPassword ? "text" : "password") : type;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px", width: "100%" }}>
      {label && (
        <label
          htmlFor={name}
          style={{
            fontSize: "12px",
            fontWeight: 600,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: focused ? "var(--color-primary)" : "var(--color-text-secondary)",
            transition: "color var(--transition-fast)",
            fontFamily: "var(--font-display)",
          }}
        >
          {label}
        </label>
      )}
      <div
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
        }}
      >
        {Icon && (
          <span
            style={{
              position: "absolute",
              left: "14px",
              color: focused ? "var(--color-primary)" : "var(--color-text-muted)",
              transition: "color var(--transition-fast)",
              display: "flex",
              pointerEvents: "none",
            }}
          >
            <Icon size={16} />
          </span>
        )}
        <input
          id={name}
          name={name}
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            width: "100%",
            padding: Icon ? "13px 14px 13px 42px" : "13px 14px",
            paddingRight: type === "password" ? "44px" : "14px",
            fontSize: "15px",
            fontFamily: "var(--font-body)",
            background: "var(--color-bg)",
            border: `1.5px solid ${
              error
                ? "var(--color-error)"
                : focused
                ? "var(--color-primary)"
                : "var(--color-border)"
            }`,
            borderRadius: "var(--radius-md)",
            color: "var(--color-text-primary)",
            outline: "none",
            transition: "border-color var(--transition-fast), box-shadow var(--transition-fast)",
            boxShadow: focused
              ? "0 0 0 3px rgba(39, 24, 126, 0.1)"
              : "none",
          }}
        />
        {type === "password" && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: "absolute",
              right: "14px",
              color: "var(--color-text-muted)",
              display: "flex",
              padding: "2px",
              borderRadius: "4px",
            }}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              // Eye off SVG
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                <line x1="1" y1="1" x2="23" y2="23" />
              </svg>
            ) : (
              // Eye SVG
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
        )}
      </div>
      {error && (
        <span
          style={{
            fontSize: "12px",
            color: "var(--color-error)",
            display: "flex",
            alignItems: "center",
            gap: "4px",
          }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
          </svg>
          {error}
        </span>
      )}
    </div>
  );
};

export default InputField;
