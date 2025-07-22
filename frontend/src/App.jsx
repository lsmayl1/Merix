import React from "react";
import "./style/index.css";
import { Navigate, Route, Router, Routes } from "react-router-dom";
import { Dashboard } from "./pages/Dashboard";
import { Layout } from "./components/layout/Layout";
import { SalesReports } from "./pages/Reports/SalesReports";
import { Products } from "./pages/Products/Products";
import { ProductReports } from "./pages/Reports/ProductReports";
import { ReportsLayout } from "./components/layout/ReportsLayout";
import { Pos } from "./pages/Pos";
import { DailyCashMovements } from "./pages/Reports/DailyCashMovements";
import { StockMovements } from "./pages/Stock/StockMovements";
import { ProductDetails } from "./pages/Products/ProductDetails";
export const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="products" element={<Products />} />
        <Route path="products/:id" element={<ProductDetails />} />

        <Route path="stock-movements" element={<StockMovements />} />

        <Route path="reports" element={<ReportsLayout />}>
          <Route index element={<Navigate to="sale" replace />} />
          <Route index path="sale" element={<SalesReports />} />
          <Route path="products" element={<ProductReports />} />
          <Route path="cash-movements" element={<DailyCashMovements />} />
        </Route>
      </Route>
      <Route path="pos" element={<Pos />} />
    </Routes>
  );
};
