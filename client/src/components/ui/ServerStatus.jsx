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

// Waits ms, or less if the page is left
const pause = (ms, signal) =>
  new Promise((resolve) => {
    const timer = setTimeout(resolve, ms);
    signal.addEventListener("abort", () => { clearTimeout(timer); resolve(); }, { once: true });
  });

const isReady = async (signal) => {
  const request = new AbortController();
  const stop = () => request.abort();
  const timer = setTimeout(stop, REQUEST_TIMEOUT_MS);
  signal.addEventListener("abort", stop, { once: true });
  try {
    const res = await fetch(`${API_ORIGIN}/health`, { cache: "no-store", signal: request.signal });
    if (!res.ok) return false;
    const body = await res.json();
    // Only the API's own health reply counts. Anything else, such as this site's HTML
    // page when VITE_API_URL is missing, means the API wasn't reached.
    if (body?.status !== "OK") return false;
    // Older servers don't report the database, so only a reported outage counts
    return body.database !== "disconnected";
  } catch {
    return false;
  } finally {
    clearTimeout(timer);
    signal.removeEventListener("abort", stop);
  }
};

const ServerStatus = () => {
  // checking: first moments, nothing shown | waking | ready | down
  const [status, setStatus] = useState("checking");

  useEffect(() => {
    const page = new AbortController();
    const started = Date.now();
    const showTimer = setTimeout(() => {
      setStatus((s) => (s === "checking" ? "waking" : s));
    }, SHOW_AFTER_MS);

    (async () => {
      while (!page.signal.aborted) {
        if (await isReady(page.signal)) {
          if (!page.signal.aborted) setStatus("ready");
          return;
        }
        if (page.signal.aborted) return;
        // After the wake-up window, say it's down but keep checking in case it recovers
        const overdue = Date.now() - started > GIVE_UP_AFTER_MS;
        if (overdue) setStatus("down");
        await pause(overdue ? 10000 : 3000, page.signal);
      }
    })();

    return () => {
      page.abort();
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
