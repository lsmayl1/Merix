import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const API = "http://192.168.1.69:3000/";
// const API = "";

export const ApiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: API }),
  endpoints: (build) => ({
    // Product
    getProducts: build.query({
      query: ({ page = 1, sort = "asc" }) =>
        `/products?page=${page}&sort=${sort}`,
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
    getBulkProduct: build.mutation({
      query: (id) => ({
        url: "products/bulk",
        method: "POST",
        body: id,
      }),
    }),
    // Sales
    getAllSales: build.mutation({
      query: (data) => ({
        url: "sales",
        method: "POST",
        body: data,
      }),
    }),
    getSaleById: build.query({
      query: (id) => `sales/${id}`,
    }),
    postSalePreview: build.mutation({
      query: (data) => ({
        url: "sales/preview",
        method: "POST",
        body: data,
      }),
    }),
    postSale: build.mutation({
      query: (sale) => ({
        url: "sales/create",
        method: "POST",
        body: sale,
      }),
    }),
    getProductsReport: build.mutation({
      query: (data) => ({
        url: "reports/sold-products",
        method: "POST",
        body: data,
      }),
    }),

    // Metrics
    getSaleMetrics: build.mutation({
      query: (data) => ({
        url: "metrics/sale",
        method: "POST",
        body: data,
      }),
    }),
    getProductSoldMetrics: build.mutation({
      query: (data) => ({
        url: "metrics/products-sold",
        method: "POST",
        body: data,
      }),
    }),
    getProductsMetrics: build.query({
      query: () => "metrics/products",
    }),
  }),
});

export const {
  useGetProductsQuery,
  usePostProductMutation,
  useGetBarcodeMutation,
  useGetProductsByQueryQuery,
  useGetProductByIdQuery,
  useLazyGetProductByIdQuery,
  usePutProductByIdMutation,
  useDeleteProductByIdMutation,
  useGetBulkProductMutation,

  useGetAllSalesMutation,
  useGetSaleByIdQuery,
  usePostSalePreviewMutation,
  usePostSaleMutation,
  useGetProductsReportMutation,

  useGetSaleMetricsMutation,
  useGetProductSoldMetricsMutation,
  useGetProductsMetricsQuery,
} = ApiSlice;
