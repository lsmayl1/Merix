import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../../baseQuery.tsx";

export const AuthApi = createApi({
  reducerPath: "AuthApi",
  baseQuery: baseQuery,
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: "/auth/login",
        method: "POST",
        body: data,
      }),
    }),
    register: builder.mutation({
      query: (data) => ({
        url: "/auth/register",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

