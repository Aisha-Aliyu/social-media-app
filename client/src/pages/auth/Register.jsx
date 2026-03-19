import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import AuthLayout from "../../layouts/AuthLayout";
import InputField from "../../components/ui/InputField";
import Spinner from "../../components/ui/Spinner";
import useAuthStore from "../../store/authStore";

const Register = () => {
  const navigate = useNavigate();
  const { register, isLoading } = useAuthStore();

  const [form, setForm] = useState({
    username: "",
    displayName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.username) e.username = "Username is required";
    else if (!/^[a-zA-Z0-9_]{3,20}$/.test(form.username))
      e.username = "3–20 chars: letters, numbers, underscores only";
    if (!form.email) e.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Enter a valid email";
    if (!form.password) e.password = "Password is required";
    else if (form.password.length < 8) e.password = "Minimum 8 characters";
    if (!form.confirmPassword) e.confirmPassword = "Please confirm your password";
    else if (form.password !== form.confirmPassword) e.confirmPassword = "Passwords don't match";
    return e;
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    const { confirmPassword, ...payload } = form;
    const result = await register(payload);
    if (result.success) {
      toast.success("Account created! Welcome to Chillax 🎉");
      navigate("/feed");
    } else {
      toast.error(result.message);
    }
  };

  const UserIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
    </svg>
  );
  const AtIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4"/><path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94"/>
    </svg>
  );
  const EmailIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
    </svg>
  );
  const LockIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  );

  // Password strength indicator
  const strength = (() => {
    const p = form.password;
    if (!p) return 0;
    let s = 0;
    if (p.length >= 8) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return s;
  })();
  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][strength];
  const strengthColor = ["", "#e63946", "#f4a261", "#2a9d8f", "#1db954"][strength];

  return (
    <AuthLayout
      title="Join Chillax."
      subtitle="Create your account and start vibing."
      altText="Already have an account?"
      altLink="/login"
      altLinkText="Sign in"
    >
      <form onSubmit={handleSubmit} noValidate style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
          <InputField
            label="Username"
            name="username"
            value={form.username}
            onChange={handleChange}
            placeholder="coolcat_99"
            autoComplete="username"
            icon={AtIcon}
            error={errors.username}
          />
          <InputField
            label="Display Name"
            name="displayName"
            value={form.displayName}
            onChange={handleChange}
            placeholder="Cool Cat"
            autoComplete="name"
            icon={UserIcon}
            error={errors.displayName}
          />
        </div>

        <InputField
          label="Email Address"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="you@example.com"
          autoComplete="email"
          icon={EmailIcon}
          error={errors.email}
        />

        <InputField
          label="Password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Min. 8 characters"
          autoComplete="new-password"
          icon={LockIcon}
          error={errors.password}
        />

        {/* Password strength bar */}
        {form.password && (
          <div style={{ marginTop: "-10px" }}>
            <div style={{ display: "flex", gap: "4px", marginBottom: "4px" }}>
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    height: "3px",
                    borderRadius: "2px",
                    background: i <= strength ? strengthColor : "var(--color-border)",
                    transition: "background 0.3s",
                  }}
                />
              ))}
            </div>
            <span style={{ fontSize: "11px", color: strengthColor, fontWeight: 600 }}>
              {strengthLabel}
            </span>
          </div>
        )}

        <InputField
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          value={form.confirmPassword}
          onChange={handleChange}
          placeholder="Repeat your password"
          autoComplete="new-password"
          icon={LockIcon}
          error={errors.confirmPassword}
        />

        <p style={{ fontSize: "12px", color: "var(--color-text-muted)", lineHeight: 1.6, marginTop: "-4px" }}>
          By creating an account, you agree to our{" "}
          <a href="#" style={{ color: "var(--color-primary)", fontWeight: 500 }}>Terms of Service</a>{" "}
          and{" "}
          <a href="#" style={{ color: "var(--color-primary)", fontWeight: 500 }}>Privacy Policy</a>.
        </p>

        <button
          type="submit"
          disabled={isLoading}
          style={{
            width: "100%",
            padding: "14px",
            background: isLoading ? "var(--color-primary-light)" : "var(--color-primary)",
            color: "#f7f7ff",
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: "17px",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            borderRadius: "var(--radius-md)",
            border: "none",
            cursor: isLoading ? "not-allowed" : "pointer",
            transition: "background var(--transition-fast), transform var(--transition-fast), box-shadow var(--transition-fast)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            boxShadow: "var(--shadow-md)",
          }}
          onMouseEnter={(e) => {
            if (!isLoading) {
              e.currentTarget.style.background = "var(--color-primary-dark)";
              e.currentTarget.style.transform = "translateY(-1px)";
              e.currentTarget.style.boxShadow = "var(--shadow-lg)";
            }
          }}
          onMouseLeave={(e) => {
            if (!isLoading) {
              e.currentTarget.style.background = "var(--color-primary)";
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "var(--shadow-md)";
            }
          }}
        >
          {isLoading ? <Spinner size={18} color="#f7f7ff" /> : null}
          {isLoading ? "Creating Account..." : "Create Account"}
        </button>
      </form>
    </AuthLayout>
  );
};

export default Register;
