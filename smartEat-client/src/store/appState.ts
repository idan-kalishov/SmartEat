import { configureStore, createSlice } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage

// Types
import { UserModel } from "../intefaces/User";
import { UserProfile } from "@/types/userTypes";

// Reducers
import userReducer from "./userSlice";

// Define AppState interface
interface AppState {
  user: UserModel | null;
  isAuthenticated: boolean;
  userProfile: UserProfile | null;
}

// Initial State
const initialState: AppState = {
  user: null,
  isAuthenticated: false,
  userProfile: null,
};

// Slice for appState
const appStateSlice = createSlice({
  name: "appState",
  initialState,
  reducers: {
    setUser: (state, action) => {
      const userData = action.payload;
      state.user = userData;
      state.isAuthenticated = true;
      state.userProfile = userData?.userProfile || null;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.userProfile = null;
    },
  },
});

export const { setUser, logout } = appStateSlice.actions;

// Persist Config
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["appState", "user"],
};

// Combine Reducers
const rootReducer = combineReducers({
  appState: appStateSlice.reducer,
  user: userReducer,
});

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  devTools: import.meta.env.NODE_ENV !== "production",
});

// Export types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Create persistor
export const persistor = persistStore(store);

// Default export (if needed)
export default store;
