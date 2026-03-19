import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import App from "./App.jsx";
import { SocketProvider } from "./context/SocketContext.jsx";
import useThemeStore from "./store/themeStore.js";
import "./styles/global.css";


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const Root = () => {
  const init = useThemeStore((s) => s.init);
  useEffect(() => { init(); }, [init]);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <SocketProvider>
          <App />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3500,
              style: {
                fontFamily: "var(--font-body)",
                fontSize: "14px",
                background: "var(--color-bg-card)",
                color: "var(--color-text-primary)",
                boxShadow: "var(--shadow-md)",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--color-border)",
              },
              success: { iconTheme: { primary: "#1db954", secondary: "#fff" } },
              error: { iconTheme: { primary: "#e63946", secondary: "#fff" } },
            }}
          />
        </SocketProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Root />
  </StrictMode>
);
