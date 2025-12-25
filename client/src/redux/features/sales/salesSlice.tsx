import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../../baseQuery.tsx";

export const SalesApi = createApi({
  reducerPath: "SalesApi",
  baseQuery: baseQuery,
  endpoints: (builder) => ({
    createSale: builder.mutation({
      query: (data) => ({
        url: "/sale",
        method: "POST",
        body: data,
      }),
    }),
    getSalesByUserId: builder.query({
      query: () => "/sale/user/sales",
    }),
  }),
});
