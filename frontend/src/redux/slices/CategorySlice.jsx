import { createApi } from "@reduxjs/toolkit/query/react";

import { baseQuery } from "../baseQuery";

export const CategorySlice = createApi({
  reducerPath: "category",
  baseQuery,
  endpoints: (build) => ({
    getCategoryById: build.query({
      query: (id) => `/category/${id}`,
    }),
  }),
});

export const { useGetCategoryByIdQuery } = CategorySlice;
