// src/store/slices/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "../../services/authService";
import Cookies from "js-cookie";

// Export the googleLogin function as a thunk
export const googleLogin = createAsyncThunk("auth/googleLogin", async () => {
  return await authService.googleLogin();
});

// Initial state based on persisted data
const initialState = {
  isLoggedIn: false,
  user: null,
  token: null,
  isLoading: false,
  error: null,
  registrationSuccess: false,
  sessionExpired: false,
};

// Check if token exists and initialize state
try {
  const token = localStorage.getItem("access_token");
  const email = localStorage.getItem("user_email");

  if (token && email) {
    initialState.isLoggedIn = true;
    initialState.token = token;
    initialState.user = { email };
  }
} catch (error) {
  console.error("Error initializing auth state:", error);
}

// Async thunks for authentication actions
export const register = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await authService.register(userData);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Registration failed"
      );
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password, rememberMe = false }, { rejectWithValue }) => {
    try {
      const response = await authService.login({
        email,
        password,
        remember_me: rememberMe,
      });

      return {
        token: response.access_token,
        email,
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);

export const logout = createAsyncThunk("auth/logout", async () => {
  authService.logout();
});

export const refreshToken = createAsyncThunk(
  "auth/refreshToken",
  async (_, { rejectWithValue }) => {
    try {
      const newToken = await authService.refreshToken();
      return { token: newToken };
    } catch (error) {
      return rejectWithValue("Failed to refresh token");
    }
  }
);

export const checkAuth = createAsyncThunk(
  "auth/checkAuth",
  async (_, { dispatch }) => {
    const isAuth = await authService.isAuthenticated();

    if (!isAuth) {
      dispatch(logout());
      return false;
    }

    return true;
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    resetAuthState: (state) => {
      state.error = null;
      state.isLoading = false;
      state.sessionExpired = false;
    },
    clearRegistrationSuccess: (state) => {
      state.registrationSuccess = false;
    },
    setSessionExpired: (state, action) => {
      state.sessionExpired = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register cases
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state) => {
        state.isLoading = false;
        state.registrationSuccess = true;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Login cases
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isLoggedIn = true;
        state.token = action.payload.token;
        state.user = { email: action.payload.email };
        state.sessionExpired = false;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Logout cases
      .addCase(logout.fulfilled, (state) => {
        state.isLoggedIn = false;
        state.user = null;
        state.token = null;
        state.sessionExpired = false;
      })

      // Refresh token cases
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.isLoggedIn = true;
        state.sessionExpired = false;
      })
      .addCase(refreshToken.rejected, (state) => {
        state.isLoggedIn = false;
        state.user = null;
        state.token = null;
        state.sessionExpired = true;
      })

      // Check auth cases
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isLoggedIn = action.payload;
        if (!action.payload) {
          state.user = null;
          state.token = null;
        }
      });
  },
});

export const { resetAuthState, clearRegistrationSuccess, setSessionExpired } =
  authSlice.actions;

export default authSlice.reducer;
