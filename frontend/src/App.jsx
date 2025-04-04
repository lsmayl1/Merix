import React from "react";
import "./style/index.css";
import { Route, Router, Routes } from "react-router-dom";
import { Dashboard } from "./pages/Dashboard";
import { Products } from "./pages/Products";
import { Layout } from "./components/layout/Layout";
import { Pos } from "./pages/Pos";
import { SalesReports } from "./pages/Reports/SalesReports";
import { SoldProductsReports } from "./pages/Reports/SoldProductsReports";
import { Scale } from "./pages/Scale";
export const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="mallar" element={<Products />} />
        <Route path="satis-hesabati" element={<SalesReports />} />
        <Route
          path="satilmis-mehsul-hesabati"
          element={<SoldProductsReports />}
        />
        <Route path="terezi" element={<Scale />} />
      </Route>
      <Route path="/kassa" element={<Pos />} />
    </Routes>
  );
};
