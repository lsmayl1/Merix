import { createApi } from "@reduxjs/toolkit/query/react";

import { baseQuery } from "../baseQuery";

export const CashMovementSlice = createApi({
  reducerPath: "cashMovement",
  baseQuery,
  endpoints: (build) => ({
    getCashMovements: build.query({
      query: () => `/cash-transactions/`,
      keepUnusedDataFor: 0,
    }),
    createCashMovement: build.mutation({
      query: (newTransaction) => ({
        url: `/cash-transactions/create-transaction/`,
        method: "POST",
        body: newTransaction,
      }),
    }),
    deleteCashMovement: build.mutation({
      query: (id) => ({
        url: `/cash-transactions/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetCashMovementsQuery,
  useCreateCashMovementMutation,
  useDeleteCashMovementMutation,
} = CashMovementSlice;
