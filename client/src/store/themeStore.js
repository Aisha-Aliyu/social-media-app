import { create } from "zustand";
import { persist } from "zustand/middleware";

const useThemeStore = create(
  persist(
    (set, get) => ({
      isDark: window.matchMedia("(prefers-color-scheme: dark)").matches,
      toggle: () => {
        const next = !get().isDark;
        set({ isDark: next });
        applyTheme(next);
      },
      init: () => {
        applyTheme(get().isDark);
      },
    }),
    { name: "chillax_theme" }
  )
);

const applyTheme = (isDark) => {
  const root = document.documentElement;

  // Set data attribute for CSS targeting
  root.setAttribute("data-dark", isDark ? "true" : "false");

  if (isDark) {
    root.style.setProperty("--color-bg", "#0f0e17");
    root.style.setProperty("--color-bg-secondary", "#1a1829");
    root.style.setProperty("--color-bg-card", "#1e1c2e");
    root.style.setProperty("--color-text-primary", "#f7f7ff");
    root.style.setProperty("--color-text-secondary", "#b8b5d4");
    root.style.setProperty("--color-text-muted", "#6e6b8a");
    root.style.setProperty("--color-border", "rgba(247,247,255,0.1)");
    root.style.setProperty("--color-accent-soft", "rgba(75,63,212,0.2)");
    root.style.setProperty("--shadow-xs", "0 1px 3px rgba(0,0,0,0.3)");
    root.style.setProperty("--shadow-sm", "0 2px 8px rgba(0,0,0,0.4)");
    root.style.setProperty("--shadow-md", "0 4px 20px rgba(0,0,0,0.5)");
    root.style.setProperty("--bottom-nav-bg", "rgba(15,14,23,0.95)");
  } else {
    root.style.setProperty("--color-bg", "#f7f7ff");
    root.style.setProperty("--color-bg-secondary", "#eeeef9");
    root.style.setProperty("--color-bg-card", "#ffffff");
    root.style.setProperty("--color-text-primary", "#0f0c2e");
    root.style.setProperty("--color-text-secondary", "#5a567a");
    root.style.setProperty("--color-text-muted", "#9896b0");
    root.style.setProperty("--color-border", "rgba(39,24,126,0.12)");
    root.style.setProperty("--color-accent-soft", "rgba(39,24,126,0.08)");
    root.style.setProperty("--shadow-xs", "0 1px 3px rgba(39,24,126,0.08)");
    root.style.setProperty("--shadow-sm", "0 2px 8px rgba(39,24,126,0.1)");
    root.style.setProperty("--shadow-md", "0 4px 20px rgba(39,24,126,0.13)");
    root.style.setProperty("--bottom-nav-bg", "rgba(247,247,255,0.95)");
  }
};

export default useThemeStore;