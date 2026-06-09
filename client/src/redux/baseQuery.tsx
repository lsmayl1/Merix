import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { getCookie, setCookie } from "./services/tokenService";
import { setCredentials, logout } from "./services/authService";

const API = import.meta.env.VITE_API_URL;

const rawBaseQuery = fetchBaseQuery({
  baseUrl: API,
  prepareHeaders: (headers, { getState }) => {
    const state: any = getState();
    const token = state?.authService?.token || getCookie("token") || null;
    if (token) headers.set("authorization", `Bearer ${token}`);
    return headers;
  },
});

// Wraps rawBaseQuery with automatic token refresh on 401
export const baseQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  if (result.error?.status === 401) {
    const state: any = api.getState();
    const refreshToken =
      state?.authService?.refreshToken || getCookie("refreshToken") || null;

    if (refreshToken) {
      const refreshResult = await rawBaseQuery(
        { url: "/auth/refresh", method: "POST", body: { refreshToken } },
        api,
        extraOptions,
      );

      if (refreshResult.data) {
        const { token } = refreshResult.data as { token: string };
        setCookie("token", token, 1);
        api.dispatch(
          setCredentials({
            token,
            refreshToken,
          }),
        );
        // Retry original request with new token
        result = await rawBaseQuery(args, api, extraOptions);
      } else {
        api.dispatch(logout());
      }
    } else {
      api.dispatch(logout());
    }
  }

  return result;
};
