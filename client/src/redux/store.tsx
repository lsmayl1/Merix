import { configureStore } from "@reduxjs/toolkit";
// Or from '@reduxjs/toolkit/query/react'
import { setupListeners } from "@reduxjs/toolkit/query";
import { AuthApi } from "./features/auth/authSlice";
import authService from "./services/authService.tsx";
import { SalesApi } from "./features/sales/salesSlice.tsx";
export const store = configureStore({
  reducer: {
    [AuthApi.reducerPath]: AuthApi.reducer,
    [SalesApi.reducerPath]: SalesApi.reducer,
    authService: authService,
  },
  // Adding the api middleware enables caching, invalidation, polling,
  // and other useful features of `rtk-query`.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(AuthApi.middleware, SalesApi.middleware),
});

// optional, but required for refetchOnFocus/refetchOnReconnect behaviors
// see `setupListeners` docs - takes an optional callback as the 2nd arg for customization
setupListeners(store.dispatch);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
