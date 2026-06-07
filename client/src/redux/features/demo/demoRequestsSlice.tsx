import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../../baseQuery.tsx";

export const DemoRequestsApi = createApi({
  reducerPath: "DemoRequestsApi",
  baseQuery,
  tagTypes: ["DemoRequests"],
  endpoints: (builder) => ({
    getDemoRequests: builder.query({
      query: ({ status, page = 1 }: { status?: string; page?: number } = {}) => {
        let url = `/demo-requests?page=${page}`;
        if (status) url += `&status=${status}`;
        return url;
      },
      providesTags: ["DemoRequests"],
    }),
    updateDemoRequest: builder.mutation({
      query: ({ id, ...data }: { id: string; status: string }) => ({
        url: `/demo-requests/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["DemoRequests"],
    }),
  }),
});

export const { useGetDemoRequestsQuery, useUpdateDemoRequestMutation } = DemoRequestsApi;
