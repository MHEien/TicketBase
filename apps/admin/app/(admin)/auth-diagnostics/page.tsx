"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { 
  checkRefreshToken, 
  getSessionDiagnostics, 
  cleanupSessions, 
  getRefreshTokenBackup,
  saveRefreshTokenBackup
} from "@/lib/api/auth-api";
import { resetAuthState, shouldResetAuth } from "@/lib/auth-reset";

export default function AuthDiagnosticsPage() {
  const { data: session, status } = useSession();
  const [sessionInfo, setSessionInfo] = useState<any>(null);
  const [tokenStatus, setTokenStatus] = useState<any>(null);
  const [cleanupResult, setCleanupResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasAttemptedFetch, setHasAttemptedFetch] = useState(false);
  const [backupToken, setBackupToken] = useState<string | null>(null);
  const [customToken, setCustomToken] = useState("");

  useEffect(() => {
    // Check if we need to auto-reset due to auth errors
    if (session && shouldResetAuth(session)) {
      console.log("Auto-resetting auth due to error state:", (session as any).error);
      setError(`Authentication error detected: ${(session as any).error}. Auto-resetting...`);
      setTimeout(() => {
        resetAuthState();
      }, 3000);
      return;
    }

    // Save refresh token backup if available
    if (session && (session as any).refreshToken) {
      saveRefreshTokenBackup((session as any).refreshToken);
    }
    
    // Load backup token
    setBackupToken(getRefreshTokenBackup());
  }, [session]);

  useEffect(() => {
    async function fetchSessionDiagnostics() {
      // Prevent infinite loops by only trying once per session change
      if (hasAttemptedFetch) return;
      
      // Don't fetch if session has errors
      if ((session as any)?.error) {
        console.log("Session has error, skipping diagnostics fetch:", (session as any).error);
        setError(`Session error: ${(session as any).error}`);
        return;
      }
      
      setHasAttemptedFetch(true);
      
      try {
        setLoading(true);
        const data = await getSessionDiagnostics();
        setSessionInfo(data);
        setError(null);
      } catch (err: any) {
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

      // Get token from session or backup
      const tokenToCheck = (session as any).refreshToken || backupToken;
      if (!tokenToCheck) {
        setError("No refresh token available in session or backup");
        return;
      }

      setLoading(true);
      const status = await checkRefreshToken(tokenToCheck);
      setTokenStatus(status);
      setError(null);
    } catch (err: any) {
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
      const status = await checkRefreshToken(customToken);
      setTokenStatus(status);
      setError(null);
    } catch (err: any) {
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
      
      // Allow fetching session info again
      setHasAttemptedFetch(false);
      
      // Try to fetch updated session info
      try {
        const data = await getSessionDiagnostics();
        setSessionInfo(data);
      } catch (refreshErr) {
        console.error("Error refreshing session info:", refreshErr);
      }
      
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to clean up sessions");
    } finally {
      setLoading(false);
    }
  }
  
  function handleSignOut() {
    signOut({ redirect: true, callbackUrl: "/login" });
  }
  
  function handleForceSignOut() {
    // Clear all local storage and force sign out
    if (typeof window !== 'undefined') {
      localStorage.removeItem('debug_refresh_token');
    }
    signOut({ redirect: true, callbackUrl: "/login" });
  }

  function handleResetAuth() {
    resetAuthState();
  }

  if (status === "loading") {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Auth Diagnostics</h1>
        <p>Loading session information...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Auth Diagnostics</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Session Information</h2>
        {session ? (
          <div>
            <p>
              <strong>User ID:</strong> {session.user?.id || "N/A"}
            </p>
            <p>
              <strong>Email:</strong> {session.user?.email || "N/A"}
            </p>
            <p>
              <strong>Role:</strong> {session.user?.role || "N/A"}
            </p>
            <p>
              <strong>Has Access Token:</strong>{" "}
              {session.accessToken ? "Yes" : "No"}
            </p>
            <p>
              <strong>Has Refresh Token:</strong>{" "}
              {(session as any).refreshToken ? "Yes" : "No"}
            </p>
            <p>
              <strong>Has Backup Token:</strong>{" "}
              {backupToken ? "Yes" : "No"}
            </p>
            <p>
              <strong>Session Status:</strong> {status}
            </p>
            {(session as any).error && (
              <p className="text-red-600">
                <strong>Session Error:</strong> {(session as any).error}
              </p>
            )}
          </div>
        ) : (
          <p>No active session</p>
        )}
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Check Custom Token</h2>
        <div className="flex space-x-4">
          <input
            type="text"
            value={customToken}
            onChange={(e) => setCustomToken(e.target.value)}
            placeholder="Paste refresh token here"
            className="flex-1 border rounded px-4 py-2"
          />
          <button
            onClick={handleCheckCustomToken}
            className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded"
            disabled={loading || !customToken}
          >
            Check Custom Token
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mb-6">
        <button
          onClick={handleCheckToken}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          {loading ? "Loading..." : "Check Session Token"}
        </button>

        <button
          onClick={handleCleanupSessions}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          {loading ? "Loading..." : "Clean Up Expired Sessions"}
        </button>
        
        <button
          onClick={handleSignOut}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
        >
          Sign Out
        </button>
        
        <button
          onClick={handleForceSignOut}
          className="bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded"
        >
          Force Sign Out & Clear
        </button>
        
        <button
          onClick={handleResetAuth}
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded"
        >
          Reset Auth State
        </button>
      </div>

      {cleanupResult && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Cleanup Result</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto">
            {JSON.stringify(cleanupResult, null, 2)}
          </pre>
        </div>
      )}

      {tokenStatus && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Token Status</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto">
            {JSON.stringify(tokenStatus, null, 2)}
          </pre>
        </div>
      )}

      {sessionInfo && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Session Diagnostics</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto">
            {JSON.stringify(sessionInfo, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
