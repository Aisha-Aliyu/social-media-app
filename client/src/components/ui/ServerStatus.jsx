import { useEffect, useState } from "react";
import Spinner from "./Spinner";

// The API runs on Render's free plan, which sleeps after 15 minutes without visitors and
// takes up to a minute to wake. This pings the health check as soon as the sign-in or
// sign-up page opens, so the server is usually awake by the time the form is sent, and
// tells the visitor what is happening when it is not.
const API_ORIGIN = (import.meta.env.VITE_API_URL || "").replace(/\/api\/?$/, "");
const SHOW_AFTER_MS = 2500;
const GIVE_UP_AFTER_MS = 100000;
const REQUEST_TIMEOUT_MS = 60000;

const isReady = async () => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const res = await fetch(`${API_ORIGIN}/health`, { cache: "no-store", signal: controller.signal });
    if (!res.ok) return false;
    const body = await res.json().catch(() => ({}));
    // Older servers don't report the database, so only a reported outage counts
    return body.database !== "disconnected";
  } catch {
    return false;
  } finally {
    clearTimeout(timer);
  }
};

const ServerStatus = () => {
  // checking: first moments, nothing shown | waking | ready | down
  const [status, setStatus] = useState("checking");

  useEffect(() => {
    let cancelled = false;
    const started = Date.now();
    const showTimer = setTimeout(() => {
      if (!cancelled) setStatus((s) => (s === "checking" ? "waking" : s));
    }, SHOW_AFTER_MS);

    (async () => {
      while (!cancelled && Date.now() - started < GIVE_UP_AFTER_MS) {
        if (await isReady()) {
          if (!cancelled) setStatus("ready");
          return;
        }
        await new Promise((resolve) => setTimeout(resolve, 3000));
      }
      if (!cancelled) setStatus("down");
    })();

    return () => {
      cancelled = true;
      clearTimeout(showTimer);
    };
  }, []);

  if (status === "checking" || status === "ready") return null;

  const waking = status === "waking";
  return (
    <div
      role="status"
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "12px 14px",
        marginBottom: "20px",
        borderRadius: "var(--radius-md)",
        border: "1.5px solid var(--color-border)",
        background: "var(--color-bg-secondary)",
        color: waking ? "var(--color-text-secondary)" : "var(--color-error)",
        fontSize: "14px",
        lineHeight: 1.5,
      }}
    >
      {waking ? <Spinner size={16} /> : null}
      <span>
        {waking
          ? "Waking up the server. The first sign-in can take up to a minute."
          : "The server isn't answering right now. Please try again in a few minutes."}
      </span>
    </div>
  );
};

export default ServerStatus;
