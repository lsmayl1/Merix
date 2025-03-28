import React from "react";
import "./style/index.css";
import { Route, Router, Routes } from "react-router-dom";
import { Dashboard } from "./components/dashboard";
import { Products } from "./components/Products/Products";
import { Layout } from "./components/layout/Layout";
export const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Products />} />
      </Route>
      <Route path="pos" element={<Dashboard />} />
    </Routes>
  );
};
