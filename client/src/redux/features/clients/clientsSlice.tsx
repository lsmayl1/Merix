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
    getClientSaleById: builder.query({
      query: ({ id, saleId }: { id: string; saleId: string }) =>
        `/clients/${id}/sales/${saleId}`,
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
    updateClient: builder.mutation({
      query: ({ id, ...data }: { id: string; name?: string; email?: string; phone?: string }) => ({
        url: `/clients/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Clients"],
    }),
    issueLicense: builder.mutation({
      query: ({ clientId, ...data }: { clientId: string; type: string; expiresAt: string; maxDevices?: number; gracePeriodDays?: number; notes?: string }) => ({
        url: `/clients/${clientId}/licenses`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Clients"],
    }),
    updateLicense: builder.mutation({
      query: ({ clientId, licenseId, ...data }: { clientId: string; licenseId: string; [key: string]: any }) => ({
        url: `/clients/${clientId}/licenses/${licenseId}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Clients"],
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
  useGetClientSaleByIdQuery,
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
  useUpdateClientMutation,
  useIssueLicenseMutation,
  useUpdateLicenseMutation,
  useToggleClientStatusMutation,
} = ClientsApi;
