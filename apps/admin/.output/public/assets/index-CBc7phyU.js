import { an as axios, ao as getSession, s as signOut, u as useSession, r as reactExports, j as jsxRuntimeExports } from './main-D54NVj6U.js';

var define_process_env_default = {};
const diagnosticClient = axios.create({
  baseURL: define_process_env_default.NEXT_PUBLIC_API_URL || "http://localhost:4000",
  headers: {
    "Content-Type": "application/json"
  }
});
diagnosticClient.interceptors.request.use(
  async (config) => {
    const session = await getSession();
    if (session?.session.token) {
      config.headers.Authorization = `Bearer ${session.session.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

async function checkRefreshToken(refreshToken) {
  try {
    const response = await diagnosticClient.post("/auth/check-token", {
      refreshToken
    });
    return response.data;
  } catch (error) {
    console.error("Error checking refresh token:", error);
    throw error;
  }
}
async function getSessionDiagnostics() {
  try {
    const response = await diagnosticClient.get("/auth/session-info");
    return response.data;
  } catch (error) {
    console.error("Error getting session diagnostics:", error);
    throw error;
  }
}
async function cleanupSessions() {
  try {
    const response = await diagnosticClient.post("/auth/cleanup-sessions");
    return response.data;
  } catch (error) {
    console.error("Error cleaning up sessions:", error);
    throw error;
  }
}
function saveRefreshTokenBackup(refreshToken) {
}
function getRefreshTokenBackup() {
  return null;
}

async function resetAuthState() {
  try {
    if (typeof window !== "undefined") {
      localStorage.removeItem("debug_refresh_token");
      localStorage.removeItem("nextauth.message");
      Object.keys(localStorage).forEach((key) => {
        if (key.includes("auth") || key.includes("token")) {
          localStorage.removeItem(key);
        }
      });
      sessionStorage.clear();
    }
    await signOut({
      redirect: false,
      callbackUrl: "/login"
    });
    console.log("Authentication state reset successfully");
    if (typeof window !== "undefined") {
      window.location.href = "/login?reset=true";
    }
  } catch (error) {
    console.error("Error resetting auth state:", error);
    if (typeof window !== "undefined") {
      window.location.href = "/login?reset=error";
    }
  }
}
function shouldResetAuth(session) {
  if (!session) return false;
  const errorStates = [
    "MaxRefreshAttemptsExceeded",
    "InvalidRefreshToken",
    "RefreshAccessTokenError"
  ];
  return errorStates.includes(session.error);
}

const SplitComponent = function AuthDiagnosticsPage() {
  const {
    data: session,
    status
  } = useSession();
  const [sessionInfo, setSessionInfo] = reactExports.useState(null);
  const [tokenStatus, setTokenStatus] = reactExports.useState(null);
  const [cleanupResult, setCleanupResult] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(false);
  const [error, setError] = reactExports.useState(null);
  const [hasAttemptedFetch, setHasAttemptedFetch] = reactExports.useState(false);
  const [backupToken, setBackupToken] = reactExports.useState(null);
  const [customToken, setCustomToken] = reactExports.useState("");
  reactExports.useEffect(() => {
    if (session && shouldResetAuth(session)) {
      console.log("Auto-resetting auth due to error state:", session.error);
      setError(`Authentication error detected: ${session.error}. Auto-resetting...`);
      setTimeout(() => {
        resetAuthState();
      }, 3e3);
      return;
    }
    if (session && session.refreshToken) {
      saveRefreshTokenBackup(session.refreshToken);
    }
    setBackupToken(getRefreshTokenBackup());
  }, [session]);
  reactExports.useEffect(() => {
    async function fetchSessionDiagnostics() {
      if (hasAttemptedFetch) return;
      if (session?.error) {
        console.log("Session has error, skipping diagnostics fetch:", session.error);
        setError(`Session error: ${session.error}`);
        return;
      }
      setHasAttemptedFetch(true);
      try {
        setLoading(true);
        const data = await getSessionDiagnostics();
        setSessionInfo(data);
        setError(null);
      } catch (err) {
        console.error("Session diagnostics error:", err);
        setError(err.message || "Failed to fetch session diagnostics");
      } finally {
        setLoading(false);
      }
    }
    if (session && status === "authenticated") {
      fetchSessionDiagnostics();
    }
  }, [session, status, hasAttemptedFetch]);
  async function handleCheckToken() {
    try {
      if (!session?.user) {
        setError("No active session");
        return;
      }
      const tokenToCheck = session.refreshToken || backupToken;
      if (!tokenToCheck) {
        setError("No refresh token available in session or backup");
        return;
      }
      setLoading(true);
      const status2 = await checkRefreshToken(tokenToCheck);
      setTokenStatus(status2);
      setError(null);
    } catch (err) {
      setError(err.message || "Failed to check token");
    } finally {
      setLoading(false);
    }
  }
  async function handleCheckCustomToken() {
    try {
      if (!customToken.trim()) {
        setError("Please enter a token to check");
        return;
      }
      setLoading(true);
      const status2 = await checkRefreshToken(customToken);
      setTokenStatus(status2);
      setError(null);
    } catch (err) {
      setError(err.message || "Failed to check custom token");
    } finally {
      setLoading(false);
    }
  }
  async function handleCleanupSessions() {
    try {
      if (!session?.user) {
        setError("No active session");
        return;
      }
      setLoading(true);
      const result = await cleanupSessions();
      setCleanupResult(result);
      setHasAttemptedFetch(false);
      try {
        const data = await getSessionDiagnostics();
        setSessionInfo(data);
      } catch (refreshErr) {
        console.error("Error refreshing session info:", refreshErr);
      }
      setError(null);
    } catch (err) {
      setError(err.message || "Failed to clean up sessions");
    } finally {
      setLoading(false);
    }
  }
  function handleSignOut() {
    signOut({
      redirect: true,
      callbackUrl: "/login"
    });
  }
  function handleForceSignOut() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("debug_refresh_token");
    }
    signOut({
      redirect: true,
      callbackUrl: "/login"
    });
  }
  function handleResetAuth() {
    resetAuthState();
  }
  if (status === "loading") {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto px-4 py-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold mb-6", children: "Auth Diagnostics" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Loading session information..." })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto px-4 py-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold mb-6", children: "Auth Diagnostics" }),
    error && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4", children: error }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-lg shadow p-6 mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-semibold mb-4", children: "Session Information" }),
      session ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "User ID:" }),
          " ",
          session.user?.id || "N/A"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Email:" }),
          " ",
          session.user?.email || "N/A"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Role:" }),
          " ",
          session.user?.role || "N/A"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Has Access Token:" }),
          " ",
          session.accessToken ? "Yes" : "No"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Has Refresh Token:" }),
          " ",
          session.refreshToken ? "Yes" : "No"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Has Backup Token:" }),
          " ",
          backupToken ? "Yes" : "No"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Session Status:" }),
          " ",
          status
        ] }),
        session.error && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-red-600", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Session Error:" }),
          " ",
          session.error
        ] })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "No active session" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-semibold mb-4", children: "Check Custom Token" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex space-x-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: customToken, onChange: (e) => setCustomToken(e.target.value), placeholder: "Paste refresh token here", className: "flex-1 border rounded px-4 py-2" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: handleCheckCustomToken, className: "bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded", disabled: loading || !customToken, children: "Check Custom Token" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-4 mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: handleCheckToken, className: "bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded", disabled: loading, children: loading ? "Loading..." : "Check Session Token" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: handleCleanupSessions, className: "bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded", disabled: loading, children: loading ? "Loading..." : "Clean Up Expired Sessions" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: handleSignOut, className: "bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded", children: "Sign Out" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: handleForceSignOut, className: "bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded", children: "Force Sign Out & Clear" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: handleResetAuth, className: "bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded", children: "Reset Auth State" })
    ] }),
    cleanupResult && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-lg shadow p-6 mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-semibold mb-4", children: "Cleanup Result" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("pre", { className: "bg-gray-100 p-4 rounded overflow-auto", children: JSON.stringify(cleanupResult, null, 2) })
    ] }),
    tokenStatus && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-lg shadow p-6 mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-semibold mb-4", children: "Token Status" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("pre", { className: "bg-gray-100 p-4 rounded overflow-auto", children: JSON.stringify(tokenStatus, null, 2) })
    ] }),
    sessionInfo && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-lg shadow p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-semibold mb-4", children: "Session Diagnostics" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("pre", { className: "bg-gray-100 p-4 rounded overflow-auto", children: JSON.stringify(sessionInfo, null, 2) })
    ] })
  ] });
};

export { SplitComponent as component };
