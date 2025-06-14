import React, { useEffect, useState } from "react";
import { KPI } from "../components/Metric/KPI.jsx";
import { Table } from "../components/Table/index.jsx";

export const Dashboard = () => {
  const header = [
    {
      key: "product",
      name: "Product",
    },
    {
      key: "barcode",
      name: "Barcode",
    },
    {
      key: "sold",
      name: "Sold",
    },
    {
      key: "revenue",
      name: "Revenue",
    },
    {
      key: "profit",
      name: "Profit",
    },
    {
      key: "profitMargin",
      name: "Profit Margin",
      align: true,
    },
  ];

  const stockHeader = [
    {
      key: "product",
      name: "Product",
    },
    {
      key: "barcode",
      name: "Barcode",
    },
    {
      key: "stock",
      name: "Stock",
    },
  ];

  const data = [
    {
      id: 1,
      barcode: "1234567890123",
      product: "Product A",
      sold: 100,
      revenue: "₼ 1,000",
      profit: "₼ 200",
      stock: 4,
      profitMargin: "20%",
    },
    {
      id: 1,
      product: "Product A",
      barcode: "1234567890123",
      sold: 100,
      revenue: "₼ 1,000",
      profit: "₼ 200",
      stock: 4,
      profitMargin: "20%",
    },
    {
      id: 2,
      barcode: "1234567890123",
      product: "Product B",
      sold: 150,
      revenue: "₼ 1,000",
      profit: "₼ 200",
      stock: 4,
      profitMargin: "20%",
    },

    {
      id: 3,
      barcode: "1234567890123",
      product: "Product C",
      sold: 200,
      revenue: "₼ 1,000",
      profit: "₼ 200",
      stock: 4,
      profitMargin: "20%",
    },
    {
      id: 1,
      barcode: "1234567890123",
      product: "Product A",
      sold: 100,
      revenue: "₼ 1,000",
      profit: "₼ 200",
      stock: 4,
      profitMargin: "20%",
    },
    {
      barcode: "1234567890123",
      id: 2,
      product: "Product B",
      sold: 150,
      revenue: "₼ 1,000",
      profit: "₼ 200",
      stock: 4,
      profitMargin: "20%",
    },

    {
      id: 3,
      barcode: "1234567890123",
      product: "Product C",
      sold: 200,
      revenue: "₼ 1,000",
      profit: "₼ 200",
      stock: 4,
      profitMargin: "20%",
    },
    {
      id: 1,
      barcode: "1234567890123",
      product: "Product A",
      sold: 100,
      revenue: "₼ 1,000",
      profit: "₼ 200",
      stock: 4,
      profitMargin: "20%",
    },
    {
      id: 2,
      barcode: "1234567890123",
      product: "Product B",
      sold: 150,
      revenue: "₼ 1,000",
      profit: "₼ 200",
      stock: 4,
      profitMargin: "20%",
    },

    {
      id: 3,
      barcode: "1234567890123",
      product: "Product C",
      sold: 2000,
      revenue: "₼ 1,000",
      profit: "₼ 200",
      stock: 4,
      profitMargin: "20%",
    },
  ];
  return (
    <div className="w-full h-full  flex flex-col gap-2 ">
      <div className="flex items-center gap-2 w-full">
        <KPI
          data={[
            {
              label: "Total Revenue",
              value: "₼ 12,345",
            },
            {
              label: "Total Profit",
              value: "₼ 2,345",
            },
            {
              label: "Total Sales",
              value: "5,456",
            },
            {
              label: "Total Stock Cost",
              value: "₼ 10,000",
            },
          ]}
        />
      </div>
      <div className="flex gap-2">
        <div className="flex flex-col gap-4 flex-5 overflow-hidden bg-white rounded-xl p-4 ">
          <h1 className="text-mainText text-md font-medium">
            10 Best Selling Products
          </h1>
          <Table header={header} data={data} />
        </div>
        <div className="flex flex-col gap-4 flex-2  overflow-hidden bg-white rounded-xl p-4 ">
          <h1 className="text-mainText text-md font-medium">
            Low Stock Overview
          </h1>
          <Table header={stockHeader} data={data} />
        </div>
      </div>
    </div>
  );
};
