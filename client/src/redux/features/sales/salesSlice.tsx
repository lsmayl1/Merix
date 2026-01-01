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
      // keepUnusedDataFor is seconds to keep cached data after there are no subscribers
      // set to 0 to evict immediately when unused
      keepUnusedDataFor: 0,
    }),
  }),
});
