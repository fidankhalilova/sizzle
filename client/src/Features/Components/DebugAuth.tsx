import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../Store/hooks";
import { checkAuth } from "../../Store/Slices/authSlice";
import { supabase } from "../../Lib/supabase";

const DebugAuth: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, user, isLoading, error } = useAppSelector(
    (state) => state.auth
  );

  useEffect(() => {
    console.log("=== DEBUG AUTH START ===");

    const debugAuth = async () => {
      try {
        // 1. Check localStorage
        const token = localStorage.getItem("sb-auth-token");
        console.log("LocalStorage token exists:", !!token);
        console.log("LocalStorage token:", token);

        // 2. Check Supabase session
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();
        console.log("Supabase session exists:", !!session);
        console.log("Session error:", sessionError);

        if (session) {
          console.log("Session user email:", session.user.email);
          console.log("Session user id:", session.user.id);
          console.log("Session metadata:", session.user.user_metadata);
        }

        // 3. Check Redux state
        console.log("Redux auth state:", {
          isAuthenticated,
          user,
          isLoading,
          error,
        });

        // 4. Try to manually dispatch checkAuth
        if (session && !isAuthenticated) {
          console.log(
            "Session exists but Redux not authenticated. Dispatching checkAuth..."
          );
          const result = await dispatch(checkAuth());
          console.log("checkAuth result:", result);
        }
      } catch (error) {
        console.error("Debug error:", error);
      }
    };

    debugAuth();
  }, [dispatch, isAuthenticated, user, isLoading, error]);

  return (
    <div
      style={{
        position: "fixed",
        bottom: "10px",
        right: "10px",
        background: "white",
        padding: "10px",
        border: "1px solid #ccc",
        borderRadius: "5px",
        zIndex: 9999,
        fontSize: "12px",
      }}
    >
      <strong>Auth Debug:</strong>
      <div>Authenticated: {isAuthenticated ? "✅" : "❌"}</div>
      <div>User: {user?.email || "None"}</div>
      <div>Loading: {isLoading ? "Yes" : "No"}</div>
      <button
        onClick={async () => {
          console.log("=== MANUAL REFRESH ===");
          const {
            data: { session },
          } = await supabase.auth.getSession();
          console.log("Session:", session);
          await dispatch(checkAuth());
        }}
        style={{ marginTop: "5px", padding: "2px 5px" }}
      >
        Refresh Auth
      </button>
    </div>
  );
};

export default DebugAuth;
