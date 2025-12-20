import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { login, register, verifyOtp, getCurrentUser } from '../../api/auth';
import type { User } from '../../api/auth';
import type { RootState } from '../../app/store';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('auth_token'),
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// Async thunks
export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ emailOrPhone, password }: { emailOrPhone: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await login(emailOrPhone, password);
      localStorage.setItem('auth_token', response.access_token);
      const user = await getCurrentUser();
      return { token: response.access_token, user };
    } catch (error) {
      // Extract error message from API response
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { detail?: string | Array<{ msg: string }> } } };
        const detail = axiosError.response?.data?.detail;

        if (detail) {
          if (Array.isArray(detail)) {
            // Handle validation errors (422) where detail is an array of objects
            return rejectWithValue(
              detail.map((err) => err.msg).join(', ')
            );
          }
          // Handle standard string errors
          return rejectWithValue(detail);
        }
      }
      return rejectWithValue('Login failed');
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData: Parameters<typeof register>[0], { rejectWithValue }) => {
    try {
      return await register(userData);
    } catch (error) {
      // Extract error message from API response
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { detail?: string | Array<{ msg: string }> } } };
        const detail = axiosError.response?.data?.detail;

        if (detail) {
          if (Array.isArray(detail)) {
            // Handle validation errors (422) where detail is an array of objects
            return rejectWithValue(
              detail.map((err) => err.msg).join(', ')
            );
          }
          // Handle standard string errors
          return rejectWithValue(detail);
        }
      }
      return rejectWithValue('Registration failed');
    }
  }
);

export const verifyOtpUser = createAsyncThunk(
  'auth/verifyOtp',
  async ({ userId, code }: { userId: string; code: string }, { rejectWithValue }) => {
    try {
      const response = await verifyOtp(userId, code);
      localStorage.setItem('auth_token', response.access_token);
      const user = await getCurrentUser();
      return { token: response.access_token, user };
    } catch (error) {
      // Extract error message from API response
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { detail?: string | Array<{ msg: string }> } } };
        const detail = axiosError.response?.data?.detail;

        if (detail) {
          if (Array.isArray(detail)) {
            // Handle validation errors (422) where detail is an array of objects
            return rejectWithValue(
              detail.map((err) => err.msg).join(', ')
            );
          }
          // Handle standard string errors
          return rejectWithValue(detail);
        }
      }
      return rejectWithValue('OTP verification failed');
    }
  }
);

export const fetchCurrentUser = createAsyncThunk('auth/fetchCurrentUser', async () => {
  return await getCurrentUser();
});

export const logoutUser = createAsyncThunk('auth/logout', async () => {
  localStorage.removeItem('auth_token');
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || action.error.message || 'Login failed';
        state.isAuthenticated = false;
      });

    // Register
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || action.error.message || 'Registration failed';
      });

    // Verify OTP
    builder
      .addCase(verifyOtpUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyOtpUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(verifyOtpUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || action.error.message || 'OTP verification failed';
      });

    // Fetch current user
    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.token = null;
        localStorage.removeItem('auth_token');
      });

    // Logout
    builder
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = null;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;

// Selectors
export const selectAuth = (state: RootState) => state.auth;
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
export const selectUser = (state: RootState) => state.auth.user;

