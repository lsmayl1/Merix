import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../../baseQuery.tsx";

export const OwnerApi = createApi({
  reducerPath: "OwnerApi",
  baseQuery,
  endpoints: (builder) => ({
    getOwnerMe:           builder.query({ query: () => "/owner/me" }),
    getOwnerReports:      builder.query({ query: () => "/owner/reports" }),
    getOwnerSales:        builder.query({ query: (params?: any) => ({ url: "/owner/sales", params }) }),
    getOwnerProducts:     builder.query({ query: () => "/owner/products" }),
    getOwnerTransactions: builder.query({ query: () => "/owner/transactions" }),
    getOwnerCustomers:    builder.query({ query: () => "/owner/customers" }),
    getOwnerSuppliers:    builder.query({ query: () => "/owner/suppliers" }),
  }),
});

export const {
  useGetOwnerMeQuery,
  useGetOwnerReportsQuery,
  useGetOwnerSalesQuery,
  useGetOwnerProductsQuery,
  useGetOwnerTransactionsQuery,
  useGetOwnerCustomersQuery,
  useGetOwnerSuppliersQuery,
} = OwnerApi;
