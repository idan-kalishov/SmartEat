import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserProfile } from "@/types/userTypes";
import api from "@/services/api";

// Define the UserState interface
interface UserState {
  userProfile: UserProfile | null;
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: UserState = {
  userProfile: null,
  loading: true,
  error: null,
};

// Create slice
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    /**
     * Manually set user profile (useful if you already have the data)
     */
    setUserProfile: (state, action: PayloadAction<UserProfile | null>) => {
      state.userProfile = action.payload;
      state.loading = false;
      state.error = null;
    },

    /**
     * Set loading state
     */
    setLoading: (state) => {
      state.loading = true;
      state.error = null;
    },

    /**
     * Set error message
     */
    setError: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle fetchUserProfile.pending
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // Handle fetchUserProfile.fulfilled
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.userProfile = action.payload;
        state.loading = false;
        state.error = null;
      })
      // Handle fetchUserProfile.rejected
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Export actions
export const { setUserProfile, setLoading, setError } = userSlice.actions;

// Async thunk to fetch user profile
export const fetchUserProfile = createAsyncThunk(
  "user/fetchUserProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/auth/me");
      return response.data.user?.userProfile as UserProfile | null;
    } catch (error) {
      return rejectWithValue("Failed to fetch user profile");
    }
  }
);

// Export reducer
export default userSlice.reducer;
