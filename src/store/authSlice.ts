import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { z } from 'zod';

// Validation schemas
const emailSchema = z.string().email('Invalid email format');
const passwordSchema = z.string().min(8, 'Password must be at least 8 characters');
const usernameSchema = z.string().min(3, 'Username must be at least 3 characters');

export const userSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

interface AuthState {
  user: { 
    email: string;
    username?: string;
    avatar?: string;
  } | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  rateLimitCounter: number;
  lastAttempt: number;
}

const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  rateLimitCounter: 0,
  lastAttempt: 0,
};

// Simulated API calls
const simulateAuth = async (email: string, password: string, delay = 1000) => {
  await new Promise(resolve => setTimeout(resolve, delay));
  if (password.length < 8) {
    throw new Error('Invalid credentials');
  }
  return { email };
};

export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { auth: AuthState };
      const now = Date.now();
      
      if (state.auth.rateLimitCounter >= RATE_LIMIT_MAX && 
          now - state.auth.lastAttempt < RATE_LIMIT_WINDOW) {
        throw new Error('Too many attempts. Please try again later.');
      }

      userSchema.parse({ email, password });
      const user = await simulateAuth(email, password);
      localStorage.setItem('user', JSON.stringify(user));
      return user;
    } catch (error) {
      if (error instanceof z.ZodError) {
        return rejectWithValue(error.errors[0].message);
      }
      return rejectWithValue(error instanceof Error ? error.message : 'Authentication failed');
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      userSchema.parse({ email, password });
      const user = await simulateAuth(email, password, 1500);
      localStorage.setItem('user', JSON.stringify(user));
      return user;
    } catch (error) {
      if (error instanceof z.ZodError) {
        return rejectWithValue(error.errors[0].message);
      }
      return rejectWithValue(error instanceof Error ? error.message : 'Registration failed');
    }
  }
);

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async ({ username, email, avatar }: { username: string; email: string, avatar: string }, { rejectWithValue }) => {
    try {
      // Validate input
      usernameSchema.parse(username);
      emailSchema.parse(email);
      // usernameSchema.parse(email);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return { username, email, avatar };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return rejectWithValue(error.errors[0].message);
      }
      return rejectWithValue(error instanceof Error ? error.message : 'Profile update failed');
    }
  }
);

export const updatePassword = createAsyncThunk(
  'auth/updatePassword',
  async ({ currentPassword, newPassword }: { currentPassword: string; newPassword: string }, { rejectWithValue }) => {
    try {
      // Validate input
      passwordSchema.parse(currentPassword);
      passwordSchema.parse(newPassword);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        return rejectWithValue(error.errors[0].message);
      }
      return rejectWithValue(error instanceof Error ? error.message : 'Password update failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem('user');
    },
    clearError: (state) => {
      state.error = null;
    },
    restoreUser: (state) => {
      const stored = localStorage.getItem('user');
      if (stored) {
        state.user = JSON.parse(stored);
        state.isAuthenticated = true;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.rateLimitCounter++;
        state.lastAttempt = Date.now();
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        state.error = null;
        state.rateLimitCounter = 0;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Register
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Update Profile
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = { ...state.user, ...action.payload };
        localStorage.setItem('user', JSON.stringify(state.user));
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Update Password
      .addCase(updatePassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updatePassword.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(updatePassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout, clearError, restoreUser } = authSlice.actions;
export default authSlice.reducer;