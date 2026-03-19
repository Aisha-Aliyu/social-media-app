import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Sidebar from "../components/layout/Sidebar";
import RightPanel from "../components/layout/RightPanel";
import Avatar from "../components/ui/Avatar";
import Spinner from "../components/ui/Spinner";
import InputField from "../components/ui/InputField";
import useAuthStore from "../store/authStore";
import api from "../api/axios";

const Settings = () => {
  const { user, updateUser } = useAuthStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [form, setForm] = useState({
    displayName: user?.displayName || "",
    bio: user?.bio || "",
    avatar: user?.avatar || "",
    coverPhoto: user?.coverPhoto || "",
    currentPassword: "",
    newPassword: "",
  });

  const [avatarPreviewError, setAvatarPreviewError] = useState(false);

  const PersonIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  );

  const LinkIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
    </svg>
  );

  const LockIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  );

  const { mutate: saveProfile, isPending } = useMutation({
    mutationFn: async (data) => {
      const { currentPassword, newPassword, ...profileData } = data;
      const promises = [api.put("/users/profile/update", profileData)];
      if (currentPassword && newPassword) {
        promises.push(
          api.put("/auth/change-password", { currentPassword, newPassword })
        );
      }
      return Promise.all(promises);
    },
    onSuccess: ([profileRes]) => {
      updateUser(profileRes.data.user);
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      setForm((prev) => ({ ...prev, currentPassword: "", newPassword: "" }));
      toast.success("Profile updated! ✨");
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to update profile"
      );
    },
  });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (e.target.name === "avatar") setAvatarPreviewError(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.newPassword && form.newPassword.length < 8) {
      toast.error("New password must be at least 8 characters");
      return;
    }
    if (form.newPassword && !form.currentPassword) {
      toast.error("Please enter your current password");
      return;
    }
    saveProfile(form);
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--color-bg)" }}>
      <div
        className="feed-layout"
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "24px 16px",
          display: "flex",
          gap: "28px",
          alignItems: "flex-start",
        }}
      >
        <Sidebar />

        <motion.main
          className="main-content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            flex: 1,
            minWidth: 0,
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <button
              onClick={() => navigate(-1)}
              style={{
                display: "flex",
                padding: "8px",
                borderRadius: "var(--radius-full)",
                color: "var(--color-text-secondary)",
                transition: "background var(--transition-fast)",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "var(--color-bg-secondary)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "transparent")
              }
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12"/>
                <polyline points="12 19 5 12 12 5"/>
              </svg>
            </button>
            <div>
              <h1
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 800,
                  fontSize: "28px",
                  letterSpacing: "0.06em",
                  color: "var(--color-primary)",
                }}
              >
                Edit Profile
              </h1>
              <p style={{ fontSize: "13px", color: "var(--color-text-muted)" }}>
                Update your public profile info
              </p>
            </div>
          </div>

          {/* Avatar preview card */}
          <div
            style={{
              background: "var(--color-bg-card)",
              borderRadius: "var(--radius-lg)",
              border: "1px solid var(--color-border)",
              padding: "24px",
              display: "flex",
              alignItems: "center",
              gap: "20px",
            }}
          >
            <div style={{ position: "relative" }}>
              {form.avatar && !avatarPreviewError ? (
                <div
                  style={{
                    width: 72,
                    height: 72,
                    borderRadius: "50%",
                    overflow: "hidden",
                    border: "3px solid var(--color-primary)",
                  }}
                >
                  <img
                    src={form.avatar}
                    alt="Avatar preview"
                    onError={() => setAvatarPreviewError(true)}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>
              ) : (
                <Avatar
                  src={null}
                  name={form.displayName || user?.username}
                  size={72}
                />
              )}
            </div>
            <div>
              <p
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: "18px",
                  color: "var(--color-text-primary)",
                  letterSpacing: "0.02em",
                }}
              >
                {form.displayName || user?.username}
              </p>
              <p style={{ fontSize: "13px", color: "var(--color-text-muted)" }}>
                @{user?.username}
              </p>
            </div>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            style={{
              background: "var(--color-bg-card)",
              borderRadius: "var(--radius-lg)",
              border: "1px solid var(--color-border)",
              padding: "24px",
              display: "flex",
              flexDirection: "column",
              gap: "20px",
            }}
          >
            {/* Profile Info Section */}
            <div>
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: "16px",
                  letterSpacing: "0.06em",
                  color: "var(--color-text-secondary)",
                  textTransform: "uppercase",
                  marginBottom: "16px",
                }}
              >
                Profile Info
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <InputField
                  label="Display Name"
                  name="displayName"
                  value={form.displayName}
                  onChange={handleChange}
                  placeholder="Your display name"
                  icon={PersonIcon}
                />

                {/* Bio */}
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label
                    style={{
                      fontSize: "12px",
                      fontWeight: 600,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: "var(--color-text-secondary)",
                      fontFamily: "var(--font-display)",
                    }}
                  >
                    Bio
                  </label>
                  <textarea
                    name="bio"
                    value={form.bio}
                    onChange={handleChange}
                    placeholder="Tell the world about yourself..."
                    maxLength={160}
                    rows={3}
                    style={{
                      width: "100%",
                      padding: "12px 14px",
                      fontSize: "15px",
                      fontFamily: "var(--font-body)",
                      background: "var(--color-bg)",
                      border: "1.5px solid var(--color-border)",
                      borderRadius: "var(--radius-md)",
                      color: "var(--color-text-primary)",
                      outline: "none",
                      resize: "vertical",
                      transition: "border-color var(--transition-fast)",
                    }}
                    onFocus={(e) =>
                      (e.target.style.borderColor = "var(--color-primary)")
                    }
                    onBlur={(e) =>
                      (e.target.style.borderColor = "var(--color-border)")
                    }
                  />
                  <span
                    style={{
                      fontSize: "11px",
                      color: "var(--color-text-muted)",
                      textAlign: "right",
                    }}
                  >
                    {form.bio.length}/160
                  </span>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div style={{ height: "1px", background: "var(--color-border)" }} />

            {/* Photos Section */}
            <div>
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: "16px",
                  letterSpacing: "0.06em",
                  color: "var(--color-text-secondary)",
                  textTransform: "uppercase",
                  marginBottom: "16px",
                }}
              >
                Photos
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <InputField
                  label="Avatar URL"
                  name="avatar"
                  value={form.avatar}
                  onChange={handleChange}
                  placeholder="https://example.com/avatar.jpg"
                  icon={LinkIcon}
                />
                <InputField
                  label="Cover Photo URL"
                  name="coverPhoto"
                  value={form.coverPhoto}
                  onChange={handleChange}
                  placeholder="https://example.com/cover.jpg"
                  icon={LinkIcon}
                />
              </div>
            </div>

            {/* Divider */}
            <div style={{ height: "1px", background: "var(--color-border)" }} />

            {/* Password Section */}
            <div>
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: "16px",
                  letterSpacing: "0.06em",
                  color: "var(--color-text-secondary)",
                  textTransform: "uppercase",
                  marginBottom: "16px",
                }}
              >
                Change Password
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <InputField
                  label="Current Password"
                  name="currentPassword"
                  type="password"
                  value={form.currentPassword}
                  onChange={handleChange}
                  placeholder="Enter current password"
                  icon={LockIcon}
                />
                <InputField
                  label="New Password"
                  name="newPassword"
                  type="password"
                  value={form.newPassword}
                  onChange={handleChange}
                  placeholder="Min. 8 characters"
                  icon={LockIcon}
                />
                {form.newPassword && form.newPassword.length < 8 && (
                  <p style={{ fontSize: "12px", color: "var(--color-error)", marginTop: "-8px" }}>
                    Password must be at least 8 characters
                  </p>
                )}
              </div>
            </div>

            {/* Divider */}
            <div style={{ height: "1px", background: "var(--color-border)" }} />

            {/* Action Buttons */}
            <div
              style={{
                display: "flex",
                gap: "12px",
                justifyContent: "flex-end",
                flexWrap: "wrap",
              }}
            >
              <button
                type="button"
                onClick={() => navigate(-1)}
                style={{
                  padding: "10px 20px",
                  background: "transparent",
                  color: "var(--color-text-secondary)",
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: "15px",
                  letterSpacing: "0.06em",
                  borderRadius: "var(--radius-md)",
                  border: "1.5px solid var(--color-border)",
                  cursor: "pointer",
                  transition: "all var(--transition-fast)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--color-primary)";
                  e.currentTarget.style.color = "var(--color-primary)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--color-border)";
                  e.currentTarget.style.color = "var(--color-text-secondary)";
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isPending}
                style={{
                  padding: "10px 28px",
                  background: "var(--color-primary)",
                  color: "#f7f7ff",
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: "15px",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  borderRadius: "var(--radius-md)",
                  border: "none",
                  cursor: isPending ? "not-allowed" : "pointer",
                  transition: "all var(--transition-fast)",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  boxShadow: "var(--shadow-md)",
                }}
                onMouseEnter={(e) => {
                  if (!isPending)
                    e.currentTarget.style.background = "var(--color-primary-dark)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "var(--color-primary)";
                }}
              >
                {isPending ? <Spinner size={14} color="#f7f7ff" /> : null}
                {isPending ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </motion.main>

        <RightPanel />
      </div>
    </div>
  );
};

export default Settings;
