import { configureStore } from "@reduxjs/toolkit";
import { ApiSlice } from "./slices/ApiSlice";
import { CashMovementSlice } from "./slices/CashMovementSlice";
import { StockMovementsSlice } from "./slices/StockMovementsSlice";
import { SupplierSlice } from "./slices/SupplierSlice";
export const store = configureStore({
  reducer: {
    [ApiSlice.reducerPath]: ApiSlice.reducer,
    [CashMovementSlice.reducerPath]: CashMovementSlice.reducer,
    [StockMovementsSlice.reducerPath]: StockMovementsSlice.reducer,
    [SupplierSlice.reducerPath]: SupplierSlice.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      ApiSlice.middleware,
      CashMovementSlice.middleware,
      StockMovementsSlice.middleware,
      SupplierSlice.middleware
    ),
});
