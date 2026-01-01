import React, { useEffect } from "react";
import "../../style/index.css";
import { KPI } from "../../components/metrics/kpi";
import { Table } from "../../components/metrics/table";
import { createColumnHelper } from "@tanstack/react-table";
import { useGetSalesByUserIdQuery } from "../../redux/features/sales/salesHook";
export const Sales = () => {
  const { data } = useGetSalesByUserIdQuery();

  const columnHelper = createColumnHelper();
  const columns = [
    columnHelper.accessor("id", {
      header: "Sale ID",
      cellClassName: "text-center",
      headerClassName: "text-center",
    }),
    // columnHelper.accessor("userId", {
    //   header: "Cashier Name",
    //   cellClassName: "text-center",
    //   headerClassName: "text-center",
    // }),
    columnHelper.accessor("subtotal_amount", {
      header: "Subtotal Amount",
      cellClassName: "text-center",
      headerClassName: "text-center",
    }),
    columnHelper.accessor("discounted_amount", {
      header: "Discount Amount",
      cellClassName: "text-center",
      headerClassName: "text-center",
    }),
    columnHelper.accessor("total_amount", {
      header: "Total Amount",
      cellClassName: "text-center",
      headerClassName: "text-center",
    }),

    columnHelper.accessor("type", {
      header: "Type",
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

  return (
    <div className="bg-white rounded-lg p-4  my-container flex flex-col gap-2 h-full">
      <h1 className="text-2xl font-semibold">Sales</h1>
      <KPI
        className="border border-gray-200"
        data={[
          { label: "Total Sales", value: data?.summary.totalSales },
          { label: "Card Sales", value: data?.summary.totalCard },
          { label: "Cash Sales", value: data?.summary.totalCash },
          { label: "Revenue", value: data?.summary.totalRevenue },
        ]}
      />
      <div className="border-gray-200 border rounded-lg p-2 overflow-auto h-full">
        <Table columns={columns} data={data?.sales} />
      </div>
    </div>
  );
};
