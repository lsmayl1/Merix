import React from "react";
import "../../style/index.css";
import { KPI } from "../../components/metrics/kpi";
import { Table } from "../../components/metrics/table";
import { createColumnHelper } from "@tanstack/react-table";
export const Sales = () => {
  const columnHelper = createColumnHelper();
  const columns = [
    columnHelper.accessor("saleId", {
      header: "Sale ID",
      cellClassName: "text-center",
      headerClassName: "text-center",
    }),
    columnHelper.accessor("cashierName", {
      header: "Cashier Name",
      cellClassName: "text-center",
      headerClassName: "text-center",
    }),
    columnHelper.accessor("amount", {
      header: "Amount",
      cellClassName: "text-center",
      headerClassName: "text-center",
    }),
    columnHelper.accessor("paymentMethod", {
      header: "Payment Method",
      cellClassName: "text-center",
      headerClassName: "text-center",
    }),
    columnHelper.accessor("date", {
      header: "Date",
      cellClassName: "text-center",
      headerClassName: "text-center",
    }),
  ];

  // generate one random sale entry
  const randomSale = () => {
    const id =
      "S" +
      (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
        ? crypto.randomUUID().split("-")[0]
        : Math.random().toString(64).substring(2, 30)); // prefix with "S" and use UUID (or fallback)
    const cashiers = ["Jane Smith", "Alice Brown", "Bob Lee", "Murat Ismayil"];
    const methods = ["Cash", "Card", "Mobile", "Bank Transfer"];
    const amount = `${Math.floor(50 + Math.random() * 950)} ₼`; // 50 - 999 ₼
    const daysAgo = Math.floor(Math.random() * 30); // within last 30 days
    const date = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0];


    return {
      saleId: id,
      cashierName: cashiers[Math.floor(Math.random() * cashiers.length)],
      amount,
      paymentMethod: methods[Math.floor(Math.random() * methods.length)],
      date,
    };
  };

  const data = [
    randomSale(),
    randomSale(),
    randomSale(),
    randomSale(),
    randomSale(),
    randomSale(),
    randomSale(),
    randomSale(),
    randomSale(),
    randomSale(),
    randomSale(),
    randomSale(),
    randomSale(),
    randomSale(),
    randomSale(),
    randomSale(),
    randomSale(),
    randomSale(),
    randomSale(),
    randomSale(),
    randomSale(),
    randomSale(),
    randomSale(),
    randomSale(),
    randomSale(),
    randomSale(),
    randomSale(),
    randomSale(),
    randomSale(),
    randomSale(),
    randomSale(),
    randomSale(),
    randomSale(),
    randomSale(),
    randomSale(),
    randomSale(),
    randomSale(),
    randomSale(),
  ];

  return (
    <div className="bg-white rounded-lg p-4 h-screen my-container flex flex-col gap-2">
      <h1 className="text-2xl font-semibold">Sales</h1>
      <KPI
        className="border border-gray-200"
        data={[
          { label: "Total Sales", value: "15,000 ₼" },
          { label: "Card Sales", value: "8,500 ₼" },
          { label: "Cash Sales", value: "6,500 ₼" },
        ]}
      />
      <div className="border-gray-200 border rounded-lg p-2 overflow-auto">
        <Table columns={columns} data={data} />
      </div>
    </div>
  );
};
