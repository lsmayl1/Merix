import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const ApiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3000" }),
  endpoints: (build) => ({
    getProducts: build.query({
      query: (page = 1) => `/products?page=${page}`,
      keepUnusedDataFor: 0,
    }),

    getProductById: build.query({
      query: (id) => ({
        url: `/products/${id}`,
      }),
    }),
    postProduct: build.mutation({
      query: (newProduct) => ({
        url: "products",
        method: "POST",
        body: newProduct,
      }),
    }),
    putProductById: build.mutation({
      query: (updatedProduct) => ({
        url: `/products/${updatedProduct.product_id}`,
        method: "PUT",
        body: updatedProduct,
      }),
    }),
    getBarcode: build.mutation({
      query: (unit) => ({
        url: "/products/generate-barcode",
        method: "POST",
        body: unit,
      }),
    }),
    getProductsByQuery: build.query({
      query: (query) => ({
        url: `/products/search/?query=${query}`,
      }),
    }),
    deleteProductById: build.mutation({
      query: (id) => ({
        url: `/products/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetProductsQuery,
  usePostProductMutation,
  useGetBarcodeMutation,
  useGetProductsByQueryQuery,
  useGetProductByIdQuery,
  usePutProductByIdMutation,
  useDeleteProductByIdMutation,
} = ApiSlice;
