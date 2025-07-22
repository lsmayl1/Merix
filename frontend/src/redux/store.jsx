import { configureStore } from "@reduxjs/toolkit";
import { ApiSlice } from "./slices/ApiSlice";
import { CashMovementSlice } from "./slices/CashMovementSlice";
import { StockMovementsSlice } from "./slices/StockMovementsSlice";
export const store = configureStore({
  reducer: {
    [ApiSlice.reducerPath]: ApiSlice.reducer,
    [CashMovementSlice.reducerPath]: CashMovementSlice.reducer,
    [StockMovementsSlice.reducerPath]: StockMovementsSlice.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      ApiSlice.middleware,
      CashMovementSlice.middleware,
      StockMovementsSlice.middleware
    ),
});
