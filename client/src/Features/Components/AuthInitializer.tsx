// src/Components/AuthInitializer.tsx
import { useEffect } from "react";
import { useAppDispatch } from "../../Store/hooks";
import { checkAuth } from "../../Store/Slices/authSlice";
import { supabase } from "../../Lib/supabase";

const AuthInitializer = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    console.log("🔐 AuthInitializer: Starting...");

    const initializeAuth = async () => {
      try {
        console.log("🔐 Checking session from localStorage...");

        // First, check localStorage directly
        const token = localStorage.getItem("sb-auth-token");
        console.log("🔐 LocalStorage token exists:", !!token);

        // Then check Supabase session
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) {
          console.error("🔐 Session error:", sessionError);
          return;
        }

        console.log("🔐 Supabase session exists:", !!session);

        if (session) {
          console.log("🔐 Found user:", session.user.email);
          console.log("🔐 User ID:", session.user.id);

          // Dispatch checkAuth - don't wait for it
          dispatch(checkAuth())
            .then((result) => {
              if (checkAuth.fulfilled.match(result)) {
                console.log("✅ Auth initialized successfully");
              } else {
                console.log("❌ Auth check rejected:", result.payload);
              }
            })
            .catch((error) => {
              console.error("🔐 Auth check error:", error);
            });
        } else {
          console.log("🔐 No session found");
        }
      } catch (error) {
        console.error("🔐 Initialization error:", error);
      }
    };

    // Initialize immediately
    initializeAuth();

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("🔐 Auth state change:", event);

      if (event === "SIGNED_IN" && session) {
        console.log("🔐 User signed in, updating auth");
        dispatch(checkAuth());
      } else if (event === "SIGNED_OUT") {
        console.log("🔐 User signed out");
        // The logout action will handle clearing state
      } else if (event === "TOKEN_REFRESHED") {
        console.log("🔐 Token refreshed");
      }
    });

    return () => {
      subscription.unsubscribe();
      console.log("🔐 AuthInitializer cleanup");
    };
  }, [dispatch]);

  return null;
};

export default AuthInitializer;
