import { createApi } from "@reduxjs/toolkit/query/react";

import { baseQuery } from "../baseQuery";

export const SupplierSlice = createApi({
  reducerPath: "supplier",
  baseQuery,
  endpoints: (build) => ({
    getSuppliers: build.query({
      query: () => `/suppliers/`,
    }),
    createSupplier: build.mutation({
      query: (newSupplier) => ({
        url: `/suppliers/`,
        method: "POST",
        body: newSupplier,
      }),
    }),
    deleteSupplier: build.mutation({
      query: (id) => ({
        url: `/suppliers/${id}`,
        method: "DELETE",
      }),
    }),
    getSupplierById: build.query({
      query: (id) => `/suppliers/${id}`,
    }),
    getSupplierByQuery: build.query({
      query: (query) => ({
        url: `/suppliers/query?query=${query}`,
      }),
    }),
    getSupplierTransactionsById: build.query({
      query: (supplierId) => `/supplier-transactions/${supplierId}`,
    }),
    createSupplierTransaction: build.mutation({
      query: (transaction) => ({
        url: `/supplier-transactions/`,
        method: "POST",
        body: transaction,
      }),
    }),
    getTotalPaymentsMetric: build.query({
      query: () => "/metrics/payments-total",
    }),
    deleteSupplierTransaction: build.mutation({
      query: (id) => ({
        url: `/supplier-transactions/${id}`,
        method: "DELETE",
      }),
    }),
    createSupplierInvoice: build.mutation({
      query: (data) => ({
        url: `supplier-transactions/v2/`,
        method: "POST",
        body: data,
      }),
    }),
    getSupplierInvoice: build.query({
      query: ({ supplier_id, transaction_id }) =>
        `/supplier-transactions/v2/${supplier_id}/${transaction_id}`,
    }),
  }),
});

export const {
  useGetSuppliersQuery,
  useCreateSupplierMutation,
  useDeleteSupplierMutation,
  useGetSupplierByIdQuery,
  useGetSupplierTransactionsByIdQuery,
  useCreateSupplierTransactionMutation,

  useGetTotalPaymentsMetricQuery,

  useCreateSupplierInvoiceMutation,
  useDeleteSupplierTransactionMutation,

  useGetSupplierInvoiceQuery,
  useGetSupplierByQueryQuery,
} = SupplierSlice;
