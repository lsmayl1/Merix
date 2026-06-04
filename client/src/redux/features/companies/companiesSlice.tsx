import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../../baseQuery.tsx";

export const CompaniesApi = createApi({
  reducerPath: "CompaniesApi",
  baseQuery,
  tagTypes: ["Companies"],
  endpoints: (builder) => ({
    getCompanies: builder.query({
      query: () => "/companies",
      providesTags: ["Companies"],
    }),
    getCompanyById: builder.query({
      query: (id: string) => `/companies/${id}`,
    }),
    updateCompany: builder.mutation({
      query: ({ id, ...data }) => ({ url: `/companies/${id}`, method: "PATCH", body: data }),
      invalidatesTags: ["Companies"],
    }),
  }),
});

export const {
  useGetCompaniesQuery,
  useGetCompanyByIdQuery,
  useUpdateCompanyMutation,
} = CompaniesApi;
