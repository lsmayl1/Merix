import React from "react";
import "../../style/index.css";
import { KPI } from "../../components/metrics/kpi";
import { Table } from "../../components/metrics/table";
import { createColumnHelper } from "@tanstack/react-table";
import Cash from "../../assets/Icons/Cash";
import CreditCard from "../../assets/Icons/CreditCard";
import { PrimaryButton } from "../../components/buttons/primaryButton";
export const Transactions = () => {
  const columnHelper = createColumnHelper();

  const columns = [
    columnHelper.accessor("transactionId", {
      header: "Transaction ID",
      cellClassName: "text-center",
      headerClassName: "text-center",
    }),
    columnHelper.accessor("cashierName", {
      header: "Cashier Name",
      cellClassName: "text-center",
      headerClassName: "text-center",
    }),
    columnHelper.accessor("paymentDescription", {
      header: "Payment Description",
      cellClassName: "text-center",
      headerClassName: "text-center",
    }),
    columnHelper.accessor("amount", {
      header: "Amount",
      cellClassName: "text-center",
      headerClassName: "text-center",
      cell: (info) => (
        <span
          className={
            info.row.original.type === "Income"
              ? "text-green-500 font-bold"
              : "text-red-500 font-bold"
          }
        >
          {info.row.original.type === "Income" ? "+" : "-"}{" "}
          {info.getValue() || 0}
        </span>
      ),
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
    const type = ["Income", "Expense"];

    const paymentDescription = [
      "Bill Payment",
      "Purchase",
      "Refund",
      "Sale Payment",
    ];
    const amount = `${Math.floor(50 + Math.random() * 950)} ₼`; // 50 - 999 ₼
    const daysAgo = Math.floor(Math.random() * 30); // within last 30 days
    const date = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0];

    return {
      transactionId: id,
      paymentDescription:
        paymentDescription[
          Math.floor(Math.random() * paymentDescription.length)
        ],
      cashierName: cashiers[Math.floor(Math.random() * cashiers.length)],
      amount,
      type: type[Math.floor(Math.random() * type.length)],
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
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Transactions</h1>

        <PrimaryButton label="Add Transaction" />
      </div>
      <KPI
        className="border border-gray-200"
        data={[
          { label: "Total Balance", value: "15,000 ₼" },
          { label: "Income", value: "23,500 ₼" },
          { label: "Expense", value: "6,500 ₼" },
        ]}
      />
      <div className="border-gray-200 border rounded-lg p-2 overflow-auto flex flex-col ">
        <div className="flex gap-4 p-4 justify-end">
          <div className="flex gap-2 items-center">
            <h2>
              <Cash />
            </h2>
            <span className="text-xl font-semibold">8,500 ₼</span>
          </div>
          <div className="flex gap-2 items-center">
            <h2>
              <CreditCard />
            </h2>
            <span className="text-xl font-semibold">8,500 ₼</span>
          </div>
        </div>
        <Table columns={columns} data={data} />
      </div>
    </div>
  );
};
