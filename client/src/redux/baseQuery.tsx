import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getCookie } from "./services/tokenService";
const API = "http://localhost:3000/api";
export const baseQuery = fetchBaseQuery({
  baseUrl: API,
  prepareHeaders: (headers, { getState }) => {
    const state: any = getState();
    const token = state?.authService?.token || getCookie("token") || null;
    if (token) headers.set("authorization", `Bearer ${token}`);
    return headers;
  },
});
