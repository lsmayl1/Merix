import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { AuthApi }      from "./features/auth/authSlice";
import authService      from "./services/authService.tsx";
import { SalesApi }     from "./features/sales/salesSlice.tsx";
import { ClientsApi }   from "./features/clients/clientsSlice.tsx";
import { CompaniesApi } from "./features/companies/companiesSlice.tsx";
import { DatabaseApi }  from "./features/database/databaseSlice.tsx";
import { AccountApi }   from "./features/account/accountSlice.tsx";

export const store = configureStore({
  reducer: {
    [AuthApi.reducerPath]:      AuthApi.reducer,
    [SalesApi.reducerPath]:     SalesApi.reducer,
    [ClientsApi.reducerPath]:   ClientsApi.reducer,
    [CompaniesApi.reducerPath]: CompaniesApi.reducer,
    [DatabaseApi.reducerPath]:  DatabaseApi.reducer,
    [AccountApi.reducerPath]:   AccountApi.reducer,
    authService,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      AuthApi.middleware,
      SalesApi.middleware,
      ClientsApi.middleware,
      CompaniesApi.middleware,
      DatabaseApi.middleware,
      AccountApi.middleware,
    ),
});

setupListeners(store.dispatch);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
