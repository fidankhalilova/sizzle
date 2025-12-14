// src/Components/AuthProvider.tsx
import React, { useEffect, useState } from "react";
import { useAppDispatch } from "../Store/hooks";
import { setUser } from "../Store/Slices/authSlice";
import {
  initializeCart,
  setUserCart,
  clearUserCart,
} from "../Store/Slices/cartSlice";
import { supabase } from "../Lib/supabase";

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    console.log("🔐 AuthProvider: Initializing...");

    // Initialize auth state
    const initializeAuth = async () => {
      try {
        console.log("🔐 Checking for existing session...");

        // Get current session
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) {
          console.error("❌ Session error:", sessionError);
          setIsInitialized(true);
          // Initialize cart without user
          dispatch(initializeCart({ userId: null }));
          return;
        }

        console.log("🔐 Session found?", !!session);

        if (session?.user) {
          console.log("✅ Session found, updating Redux...");

          // Build user object directly
          const userData = {
            id: session.user.id,
            email: session.user.email!,
            name:
              session.user.user_metadata?.name ||
              session.user.user_metadata?.full_name ||
              session.user.email?.split("@")[0] ||
              "User",
            avatar_url: session.user.user_metadata?.avatar_url || "",
          };

          // Set user directly in Redux
          dispatch(setUser(userData));
          console.log("✅ User set in Redux:", userData.email);

          // Initialize cart with user ID
          dispatch(setUserCart({ userId: session.user.id }));
        } else {
          console.log("📭 No session found");
          dispatch(setUser(null));
          // Initialize cart without user
          dispatch(initializeCart({ userId: null }));
        }
      } catch (error) {
        console.error("❌ Auth initialization error:", error);
        dispatch(setUser(null));
        dispatch(initializeCart({ userId: null }));
      } finally {
        setIsInitialized(true);
        console.log("✅ AuthProvider: Initialization complete");
      }
    };

    initializeAuth();

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log(
        "🔔 Auth event:",
        event,
        session ? "with session" : "no session"
      );

      if (event === "SIGNED_IN" && session?.user) {
        console.log("✅ User signed in");
        const userData = {
          id: session.user.id,
          email: session.user.email!,
          name:
            session.user.user_metadata?.name ||
            session.user.user_metadata?.full_name ||
            session.user.email?.split("@")[0] ||
            "User",
          avatar_url: session.user.user_metadata?.avatar_url || "",
        };
        dispatch(setUser(userData));

        // Set user cart and merge pending items
        dispatch(setUserCart({ userId: session.user.id }));

        // Check for redirect URL
        const redirectUrl = sessionStorage.getItem("redirectAfterLogin");
        if (redirectUrl) {
          sessionStorage.removeItem("redirectAfterLogin");
          window.location.href = redirectUrl;
        }
      } else if (event === "SIGNED_OUT") {
        console.log("🚪 User signed out");
        dispatch(setUser(null));

        // Clear user cart but keep items as pending
        dispatch(clearUserCart());
      } else if (event === "TOKEN_REFRESHED" && session?.user) {
        console.log("🔄 Token refreshed");
        const userData = {
          id: session.user.id,
          email: session.user.email!,
          name:
            session.user.user_metadata?.name ||
            session.user.user_metadata?.full_name ||
            session.user.email?.split("@")[0] ||
            "User",
          avatar_url: session.user.user_metadata?.avatar_url || "",
        };
        dispatch(setUser(userData));
      }
    });

    return () => {
      console.log("🔌 AuthProvider: Unsubscribing from auth changes");
      subscription.unsubscribe();
    };
  }, [dispatch]);

  // Optional: Show loading state
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return <>{children}</>;
};
