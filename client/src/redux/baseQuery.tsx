import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const API = "http://localhost:3000";
export const baseQuery = fetchBaseQuery({
  baseUrl: API,
});