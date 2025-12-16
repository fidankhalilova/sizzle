// src/Store/Slices/authSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "../../Auth/supabase";
import type { AuthState, User } from "../../Types/types";

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// IMPROVED checkAuth - handles all cases properly
export const checkAuth = createAsyncThunk(
  "auth/checkAuth",
  async (_, { rejectWithValue }) => {
    console.log("🔄 checkAuth: Starting...");

    try {
      // Get current session
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) {
        console.error("❌ Session error:", sessionError);
        return rejectWithValue("Session error");
      }

      console.log("🔄 Session exists?", !!session);

      if (session?.user) {
        console.log("✅ User found:", session.user.email);

        // Build user object from session
        const userData: User = {
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

      console.log("❌ No session found");
      return rejectWithValue("No session");
    } catch (error: any) {
      console.error("❌ checkAuth error:", error);
      return rejectWithValue(error.message || "Auth check failed");
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
      console.log("🔐 Attempting login for:", email);

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("❌ Login error:", error);
        let errorMessage = error.message;

        if (error.message.includes("Invalid login credentials")) {
          errorMessage = "Invalid email or password";
        } else if (error.message.includes("Email not confirmed")) {
          errorMessage = "Please confirm your email first";
        }

        return rejectWithValue(errorMessage);
      }

      if (data.user) {
        console.log("✅ Login successful:", data.user.email);

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
      console.error("❌ Login exception:", error);
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
      console.log("📝 Attempting registration for:", email);

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
            full_name: name,
          },
        },
      });

      if (error) {
        console.error("❌ Registration error:", error);
        let errorMessage = error.message;

        if (error.message.includes("already registered")) {
          errorMessage = "Email already registered";
        } else if (error.message.includes("password")) {
          errorMessage = "Password is too weak";
        }

        return rejectWithValue(errorMessage);
      }

      if (data.user) {
        console.log("✅ Registration successful, auto-logging in...");

        // Auto login after registration
        const { data: loginData, error: loginError } =
          await supabase.auth.signInWithPassword({
            email,
            password,
          });

        if (loginError) {
          console.error("❌ Auto-login failed:", loginError);
          return rejectWithValue(
            "Registration successful. Please login manually."
          );
        }

        if (loginData.user) {
          console.log("✅ Auto-login successful");

          const userData: User = {
            id: loginData.user.id,
            email: loginData.user.email!,
            name: name,
            avatar_url: loginData.user.user_metadata?.avatar_url,
          };

          return { user: userData };
        }
      }

      return rejectWithValue("Registration failed");
    } catch (error: any) {
      console.error("❌ Registration exception:", error);
      return rejectWithValue(error.message || "Registration failed");
    }
  }
);

// Logout
export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      console.log("🚪 Logging out...");
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("❌ Logout error:", error);
        return rejectWithValue(error.message);
      }
      console.log("✅ Logout successful");
      return null;
    } catch (error: any) {
      console.error("❌ Logout exception:", error);
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
    // Add this to manually set auth state
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
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
      console.log("✅ Redux: User authenticated:", action.payload.user.email);
    });
    builder.addCase(checkAuth.rejected, (state) => {
      state.isLoading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.error = null; // Don't set error for rejected auth checks
      console.log("❌ Redux: Auth check rejected");
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
      console.log("✅ Redux: Login successful:", action.payload.user.email);
    });
    builder.addCase(loginWithEmail.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
      console.log("❌ Redux: Login failed:", action.payload);
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
      console.log(
        "✅ Redux: Registration successful:",
        action.payload.user.email
      );
    });
    builder.addCase(registerWithEmail.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
      console.log("❌ Redux: Registration failed:", action.payload);
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
      console.log("✅ Redux: Logout successful");
    });
    builder.addCase(logoutUser.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
      console.log("❌ Redux: Logout failed:", action.payload);
    });
  },
});

export const { clearError, setUser } = authSlice.actions;
export default authSlice.reducer;
