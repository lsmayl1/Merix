import { createSlice } from "@reduxjs/toolkit";
import { getCookie, setCookie, deleteCookie } from "./tokenService";

const authService = createSlice({
  name: "authService",
  initialState: {
    token: getCookie("token") || null,
    refreshToken: getCookie("refreshToken") || null,
    isAuthenticated: !!getCookie("token"),
    role: getCookie("role") || null,
    clientId: getCookie("clientId") || null,
  },
  reducers: {
    setCredentials: (state, action) => {
      const { token, refreshToken, role, clientId } = action.payload;
      state.token           = token;
      state.isAuthenticated = true;
      setCookie("token", token, 1);
      if (refreshToken) {
        state.refreshToken = refreshToken;
        setCookie("refreshToken", refreshToken, 7);
      }
      if (role) {
        state.role = role;
        setCookie("role", role, 7);
      }
      if (clientId) {
        state.clientId = clientId;
        setCookie("clientId", clientId, 7);
      }
    },
    logout: (state) => {
      state.token = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.role = null;
      state.clientId = null;
      deleteCookie("token");
      deleteCookie("refreshToken");
      deleteCookie("role");
      deleteCookie("clientId");
    },
  },
});

export const { setCredentials, logout } = authService.actions;

export default authService.reducer;
