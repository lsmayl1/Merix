import { useState } from "react";
import "./style/index.css";
import { Route, Routes } from "react-router-dom";
import { Login } from "./pages/auth/Login";
import { AuthLayout } from "./Layout/AuthLayout";

export const App = () => {
  return (
    <Routes>
      <Route path="/" element={<AuthLayout />}>
        <Route index element={<Login />} />
      </Route>
    </Routes>
  );
};
