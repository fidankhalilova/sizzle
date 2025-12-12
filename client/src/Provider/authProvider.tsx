import React, { useEffect, useState } from "react";
import { useAppDispatch } from "../Store/hooks";
import { checkAuth, clearError } from "../Store/Slices/authSlice";
import { supabase } from "../Lib/supabase";

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize auth state
    const initializeAuth = async () => {
      try {
        setIsLoading(true);
        console.log("Initializing auth...");

        // Get current session
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) {
          console.error("Session error:", sessionError);
          dispatch(clearError());
          return;
        }

        console.log("Session found:", session ? "Yes" : "No");

        if (session) {
          // If session exists, dispatch checkAuth to update Redux state
          console.log("Dispatching checkAuth...");
          await dispatch(checkAuth()).unwrap();
          console.log("Auth check completed");
        } else {
          // Clear any existing auth state
          console.log("No session, clearing auth state");
          dispatch(clearError());
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        dispatch(clearError());
      } finally {
        console.log("Setting loading to false");
        setIsLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event);

      if (event === "SIGNED_IN" && session) {
        console.log("User signed in, updating state");
        await dispatch(checkAuth()).unwrap();
      } else if (event === "SIGNED_OUT") {
        console.log("User signed out, clearing state");
        dispatch(clearError());
      } else if (event === "INITIAL_SESSION") {
        console.log("Initial session event");
        if (session) {
          await dispatch(checkAuth()).unwrap();
        }
      } else if (event === "TOKEN_REFRESHED") {
        console.log("Token refreshed");
      }
    });

    return () => {
      subscription.unsubscribe();
      console.log("Auth listener unsubscribed");
    };
  }, [dispatch]);

  // Don't block rendering with loading state
  // Just render children and handle loading in a non-blocking way
  return <>{children}</>;

  // If you really want a loading indicator, use this:
  /*
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#04322f] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading authentication...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
  */
};
