import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import AuthLayout from "../../layouts/AuthLayout";
import InputField from "../../components/ui/InputField";
import Spinner from "../../components/ui/Spinner";
import useAuthStore from "../../store/authStore";

const Login = () => {
  const navigate = useNavigate();
  const { login, isLoading } = useAuthStore();

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.email) e.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Enter a valid email";
    if (!form.password) e.password = "Password is required";
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
    const result = await login(form);
    if (result.success) {
      toast.success("Welcome back! 👋");
      navigate("/feed");
    } else {
      toast.error(result.message);
    }
  };

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

  return (
    <AuthLayout
      title="Welcome back."
      subtitle="Sign in to your Chillax account."
      altText="New here?"
      altLink="/register"
      altLinkText="Create an account"
    >
      <form onSubmit={handleSubmit} noValidate style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
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
          placeholder="Your password"
          autoComplete="current-password"
          icon={LockIcon}
          error={errors.password}
        />

        {/* Forgot password link */}
        <div style={{ textAlign: "right", marginTop: "-8px" }}>
          <a
            href="#"
            style={{
              fontSize: "13px",
              color: "var(--color-primary)",
              fontWeight: 500,
              opacity: 0.8,
            }}
          >
            Forgot password?
          </a>
        </div>

        {/* Submit Button */}
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
            marginTop: "4px",
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
          {isLoading ? "Signing In..." : "Sign In"}
        </button>
      </form>
    </AuthLayout>
  );
};

export default Login;
