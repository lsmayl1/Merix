import React, { useState } from "react";
import { KPI } from "../../Components/Metrics/KPI";
import { LineChart } from "../../Components/Metrics/LineChart";
import { PieChartComponent } from "../../Components/Metrics/PieChart/PieChartComponent";
import { Table } from "../../Components/Metrics/Table";
import { createColumnHelper } from "@tanstack/react-table";
import Navigate from "../../assets/Navigation/Navigate";
import { DonutChartComponent } from "../../Components/Metrics/PieChart/DonutChartComponent";

export const Dashboard = () => {
  const [chartData, setChartData] = useState("revenue");
  const columnHelper = createColumnHelper();
  const LastSupplierTransactionsColumn = [
    columnHelper.accessor("SupplierName", {
      header: "Supplier Name",
      headerClassName: "text-start",
    }),
    columnHelper.accessor("TransactionType", {
      header: "Transaction Type",
      cellClassName: "text-center",
    }),
    columnHelper.accessor("Amount", {
      header: "Amount",
      cellClassName: "text-center",
    }),
    // columnHelper.accessor("PaymentMethod", {
    //   header: "Payment Method",
    //   cellClassName: "text-center",
    // }),
    columnHelper.accessor("Date", {
      header: "Date",
      cellClassName: "text-center",
    }),
    columnHelper.accessor("Details", {
      header: "Details",
      cellClassName: "text-center",

      cell: () => (
        <button>
          <Navigate />
        </button>
      ),
    }),
  ];
  const LastSupplierTransactions = [
    {
      SupplierName: "Tesla",
      TransactionType: "Buy",
      Amount: "450 ₼",
      PaymentMethod: "Credit",
      Date: "12-08-25",
    },
    {
      SupplierName: "Tesla",
      TransactionType: "Buy",
      Amount: "450 ₼",
      PaymentMethod: "Credit",
      Date: "12-08-25",
    },
    {
      SupplierName: "Tesla",
      TransactionType: "Buy",
      Amount: "450 ₼",
      PaymentMethod: "Credit",
      Date: "12-08-25",
    },
    {
      SupplierName: "Tesla",
      TransactionType: "Buy",
      Amount: "450 ₼",
      PaymentMethod: "Credit",
      Date: "12-08-25",
    },
    {
      SupplierName: "Tesla",
      TransactionType: "Buy",
      Amount: "450 ₼",
      PaymentMethod: "Credit",
      Date: "12-08-25",
    },
    {
      SupplierName: "Tesla",
      TransactionType: "Buy",
      Amount: "450 ₼",
      PaymentMethod: "Credit",
      Date: "12-08-25",
    },
    {
      SupplierName: "Tesla",
      TransactionType: "Buy",
      Amount: "450 ₼",
      PaymentMethod: "Credit",
      Date: "12-08-25",
    },
    {
      SupplierName: "Tesla",
      TransactionType: "Buy",
      Amount: "450 ₼",
      PaymentMethod: "Credit",
      Date: "12-08-25",
    },
    {
      SupplierName: "Tesla",
      TransactionType: "Buy",
      Amount: "450 ₼",
      PaymentMethod: "Credit",
      Date: "12-08-25",
    },
    {
      SupplierName: "Tesla",
      TransactionType: "Buy",
      Amount: "450 ₼",
      PaymentMethod: "Credit",
      Date: "12-08-25",
    },
    {
      SupplierName: "Tesla",
      TransactionType: "Buy",
      Amount: "450 ₼",
      PaymentMethod: "Credit",
      Date: "12-08-25",
    },
    {
      SupplierName: "Tesla",
      TransactionType: "Buy",
      Amount: "450 ₼",
      PaymentMethod: "Credit",
      Date: "12-08-25",
    },
    {
      SupplierName: "Tesla",
      TransactionType: "Buy",
      Amount: "450 ₼",
      PaymentMethod: "Credit",
      Date: "12-08-25",
    },
    {
      SupplierName: "Tesla",
      TransactionType: "Buy",
      Amount: "450 ₼",
      PaymentMethod: "Credit",
      Date: "12-08-25",
    },
    {
      SupplierName: "Tesla",
      TransactionType: "Buy",
      Amount: "450 ₼",
      PaymentMethod: "Credit",
      Date: "12-08-25",
    },
    {
      SupplierName: "Tesla",
      TransactionType: "Buy",
      Amount: "450 ₼",
      PaymentMethod: "Credit",
      Date: "12-08-25",
    },
  ];
  const [timeframes, setTimeFrames] = useState([
    { tf: "H", key: "hourly" },
    { tf: "D", key: "Daily" },
    { tf: "W", key: "Weakly" },
    { tf: "M", key: "Monthly" },
    { tf: "Y", key: "Yearly" },
  ]);

  const supplierData = [
    { name: "Tesla", value: 6000 },
    { name: "Apple", value: 800 },
    { name: "Micrasoft", value: 800 },
    { name: "Apple", value: 800 },
    { name: "Apple", value: 800 },
    { name: "Apple", value: 800 },
    { name: "Micrasoft", value: 800 },
    { name: "Apple", value: 800 },
    { name: "Apple", value: 800 },
    { name: "Apple", value: 800 },
    { name: "Micrasoft", value: 800 },
    { name: "Apple", value: 800 },
    { name: "Apple", value: 800 },
  ];

  const [selectedTimeFrame, setSelectedTimeFrame] = useState("hourly");
  return (
    <div className="flex flex-col gap-2 h-full">
      <KPI
        data={[
          { label: "Total Sales", value: "15,000 ₼" },
          { label: "Net Profit", value: "8,000 ₼" },
          { label: "Total Expenses", value: "7,000 ₼" },
        ]}
      />
      <div className="flex gap-2">
        <div className="flex flex-col    bg-white p-2 rounded-lg    flex-3">
          <div className="flex flex-col gap-2">
            <div className="flex justify-between">
              <div className="flex items-center text-xs bg-[#D8E2EF] w-fit p-1  rounded-lg">
                <button
                  className={` px-2 p-1 cursor-pointer ${
                    chartData === "revenue" ? "bg-white  rounded-lg " : ""
                  }`}
                  onClick={() => setChartData("revenue")}
                >
                  Revenue
                </button>
                <button
                  className={`  px-2 p-1 cursor-pointer ${
                    chartData === "profit" ? "bg-white  rounded-lg" : ""
                  }`}
                  onClick={() => setChartData("profit")}
                >
                  Profit
                </button>
              </div>
              <div className="flex items-center text-xs bg-[#D8E2EF] w-fit p-1  rounded-lg">
                {timeframes.map((tf) => (
                  <button
                    className={`  px-2 p-1 cursor-pointer ${
                      tf.key === selectedTimeFrame ? "bg-white  rounded-lg" : ""
                    }`}
                    onClick={() => setSelectedTimeFrame(tf.key)}
                  >
                    {tf.tf}
                  </button>
                ))}
              </div>
            </div>
            <h1 className="text-xl font-bold">54,454 ₼</h1>
          </div>
          <div className="w-full h-full  ">
            <LineChart />
          </div>
        </div>

        <PieChartComponent
          title={"Income & Expenses"}
          data={[
            { name: "Income", value: 19, color: "#14B8A6" },
            { name: "Expenses", value: 12, color: "#F63B3E" },
          ]}
          total={{ value: 7, label: "Net Profit" }}
        />
      </div>
      <div className="flex gap-2">
        <DonutChartComponent
          title={"Suppliers Debt"}
          data={supplierData}
          total={{ value: 400, label: "Total Debt" }}
        />
        <div className="flex-2 p-2 flex flex-col gap-2 bg-white rounded-lg">
          <h1 className="font-bold text-[#737373]">
            Last Supplier Transaction
          </h1>
          <div className="overflow-auto overflow-x-hidden min-h-0 max-h-[400px]">
            <Table
              columns={LastSupplierTransactionsColumn}
              data={LastSupplierTransactions}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
