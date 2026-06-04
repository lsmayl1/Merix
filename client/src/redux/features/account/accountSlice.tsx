import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../../baseQuery.tsx";

export const AccountApi = createApi({
  reducerPath: "AccountApi",
  baseQuery,
  tagTypes: ["Account"],
  endpoints: (builder) => ({
    getMe: builder.query({
      query: () => "/account/me",
      providesTags: ["Account"],
    }),
    updateMe: builder.mutation({
      query: (data) => ({ url: "/account/me", method: "PATCH", body: data }),
      invalidatesTags: ["Account"],
    }),
    changePassword: builder.mutation({
      query: (data) => ({ url: "/account/password", method: "PATCH", body: data }),
    }),
  }),
});

export const { useGetMeQuery, useUpdateMeMutation, useChangePasswordMutation } = AccountApi;
