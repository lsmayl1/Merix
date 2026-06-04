import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../../baseQuery.tsx";

export const ClientsApi = createApi({
  reducerPath: "ClientsApi",
  baseQuery,
  tagTypes: ["Clients"],
  endpoints: (builder) => ({
    getClients: builder.query({
      query: () => "/clients",
      providesTags: ["Clients"],
    }),
    getClientById: builder.query({
      query: (id: string) => `/clients/${id}`,
    }),
    getClientSales: builder.query({
      query: ({ id, page = 1, from, to }: { id: string; page?: number; from?: string; to?: string }) => {
        let url = `/clients/${id}/sales?page=${page}`;
        if (from) url += `&from=${from}`;
        if (to) url += `&to=${to}`;
        return url;
      },
    }),
    setupClient: builder.mutation({
      query: (data) => ({ url: "/setup", method: "POST", body: data }),
      invalidatesTags: ["Clients"],
    }),
    createClient: builder.mutation({
      query: (data) => ({ url: "/clients", method: "POST", body: data }),
      invalidatesTags: ["Clients"],
    }),
    addClientUser: builder.mutation({
      query: ({ clientId, ...data }: { clientId: string; [key: string]: any }) => ({
        url: `/clients/${clientId}/users`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Clients"],
    }),
    updateClientUser: builder.mutation({
      query: ({ clientId, userId, ...data }: { clientId: string; userId: string; [key: string]: any }) => ({
        url: `/clients/${clientId}/users/${userId}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Clients"],
    }),
    getClientProducts: builder.query({
      query: (id: string) => `/clients/${id}/products`,
    }),
    getClientTransactions: builder.query({
      query: (id: string) => `/clients/${id}/transactions`,
    }),
    getClientSuppliers: builder.query({
      query: (id: string) => `/clients/${id}/suppliers`,
    }),
    getClientCustomers: builder.query({
      query: (id: string) => `/clients/${id}/customers`,
    }),
    getClientStockMovements: builder.query({
      query: (id: string) => `/clients/${id}/stock-movements`,
    }),
    getClientDevices: builder.query({
      query: (id: string) => `/clients/${id}/devices`,
    }),
    getClientLicenses: builder.query({
      query: (id: string) => `/clients/${id}/licenses`,
    }),
    toggleClientStatus: builder.mutation({
      query: (id: string) => ({ url: `/clients/${id}/status`, method: "PATCH" }),
      invalidatesTags: ["Clients"],
    }),
  }),
});

export const {
  useGetClientsQuery,
  useGetClientByIdQuery,
  useGetClientSalesQuery,
  useSetupClientMutation,
  useCreateClientMutation,
  useAddClientUserMutation,
  useUpdateClientUserMutation,
  useGetClientProductsQuery,
  useGetClientTransactionsQuery,
  useGetClientSuppliersQuery,
  useGetClientCustomersQuery,
  useGetClientStockMovementsQuery,
  useGetClientDevicesQuery,
  useGetClientLicensesQuery,
  useToggleClientStatusMutation,
} = ClientsApi;
