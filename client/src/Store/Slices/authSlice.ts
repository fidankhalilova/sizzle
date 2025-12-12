// src/Store/Slices/authSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "../../Lib/supabase";
import type { AuthState, User } from "../../Types/types";

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// In authSlice.ts, replace checkAuth thunk with this:
export const checkAuth = createAsyncThunk(
  "auth/checkAuth",
  async (_, { rejectWithValue }) => {
    console.log("🔄 checkAuth: Starting...");

    try {
      // Get current session
      const {
        data: { session },
      } = await supabase.auth.getSession();

      console.log("🔄 Session exists?", !!session);

      if (session?.user) {
        console.log("🔄 User email:", session.user.email);
        console.log("🔄 User metadata:", session.user.user_metadata);

        // Build user object from session (ALWAYS works)
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

        console.log("✅ checkAuth: Returning user:", userData.email);

        return { user: userData };
      }

      console.log("🔄 No session found, returning empty");
      // Return empty instead of rejecting
      return { user: null };
    } catch (error: any) {
      console.error("❌ checkAuth error:", error);
      // Always return empty instead of rejecting
      return { user: null };
    }
  }
);

// Login with email and password
export const loginWithEmail = createAsyncThunk(
  "auth/loginWithEmail",
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        let errorMessage = error.message;

        // User-friendly error messages
        if (error.message.includes("Invalid login credentials")) {
          errorMessage = "Invalid email or password";
        } else if (error.message.includes("Email not confirmed")) {
          errorMessage = "Please confirm your email first";
        }

        return rejectWithValue(errorMessage);
      }

      if (data.user) {
        // Get user data
        const userData: User = {
          id: data.user.id,
          email: data.user.email!,
          name:
            data.user.user_metadata?.name ||
            data.user.user_metadata?.full_name ||
            data.user.email?.split("@")[0] ||
            "User",
          avatar_url: data.user.user_metadata?.avatar_url,
        };

        return { user: userData };
      }

      return rejectWithValue("Login failed");
    } catch (error: any) {
      return rejectWithValue(error.message || "Login failed");
    }
  }
);

// Register with email and password
export const registerWithEmail = createAsyncThunk(
  "auth/registerWithEmail",
  async (
    {
      email,
      password,
      name,
    }: { email: string; password: string; name: string },
    { rejectWithValue }
  ) => {
    try {
      // Disable email confirmation for development
      // In production, remove the emailRedirectTo option
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
            full_name: name,
          },
          // Remove this line in production to enable email confirmation
          // emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        let errorMessage = error.message;

        if (error.message.includes("already registered")) {
          errorMessage = "Email already registered";
        } else if (error.message.includes("password")) {
          errorMessage = "Password is too weak";
        }

        return rejectWithValue(errorMessage);
      }

      if (data.user) {
        // Auto login after registration (for development)
        const { data: loginData, error: loginError } =
          await supabase.auth.signInWithPassword({
            email,
            password,
          });

        if (loginError) {
          return rejectWithValue(
            "Registration successful. Please login manually."
          );
        }

        if (loginData.user) {
          const userData: User = {
            id: loginData.user.id,
            email: loginData.user.email!,
            name: name,
          };

          return { user: userData };
        }
      }

      return rejectWithValue("Registration failed");
    } catch (error: any) {
      return rejectWithValue(error.message || "Registration failed");
    }
  }
);

// Logout
export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        return rejectWithValue(error.message);
      }
      return null;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Check Auth
    builder.addCase(checkAuth.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(checkAuth.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.error = null;
    });
    builder.addCase(checkAuth.rejected, (state) => {
      state.isLoading = false;
      state.isAuthenticated = false;
      state.user = null;
    });

    // Login
    builder.addCase(loginWithEmail.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(loginWithEmail.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.error = null;
    });
    builder.addCase(loginWithEmail.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Register
    builder.addCase(registerWithEmail.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(registerWithEmail.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.error = null;
    });
    builder.addCase(registerWithEmail.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Logout
    builder.addCase(logoutUser.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.isLoading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.error = null;
    });
    builder.addCase(logoutUser.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
