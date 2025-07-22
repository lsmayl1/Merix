import React, { useEffect, useState } from "react";
import { KPI } from "../components/Metric/KPI.jsx";
import { Table } from "../components/Table/index.jsx";
import { createColumnHelper } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import { DateRange } from "../components/Date/DateRange.jsx";
import {
  useGetDailyRevenueQuery,
  useGetDashboardMetricsMutation,
  useGetHourlyRevenueQuery,
} from "../redux/slices/ApiSlice.jsx";
import { Line } from "react-chartjs-2";
import { LineChart } from "../components/Charts/LineChart.jsx";
import { StockOverview } from "../components/Products/StockOverview.jsx";

export const Dashboard = () => {
  const { t } = useTranslation();
  const { data: dailyRevenue } = useGetDailyRevenueQuery();
  const { data: hourlyRevenue } = useGetHourlyRevenueQuery();
  const [getMetrics] = useGetDashboardMetricsMutation();
  const [metricData, setMetricData] = useState({});
  const [timeFrame, setTimeFrame] = useState("daily");
  const [range, setRange] = useState({
    from: "",
    to: "",
  });
  const columnHelper = createColumnHelper();
  const ProductsColumn = [
    columnHelper.accessor("product", {
      header: "Product",
      cell: (info) => info.getValue(),
      headerClassName: "text-start bg-gray-100 rounded-s-lg",
      cellClassName: "text-start ",
    }),

    columnHelper.accessor("barcode", {
      header: "Barcode",
      cell: (info) => info.getValue(),
      headerClassName: "text-start bg-gray-100",
      cellClassName: "text-start",
    }),
    columnHelper.accessor("sold", {
      header: "Sold",
      cell: (info) => info.getValue(),
      headerClassName: "text-center bg-gray-100",
      cellClassName: "text-center",
    }),
    columnHelper.accessor("revenue", {
      header: "Revenue",
      cell: (info) => info.getValue(),
      headerClassName: "text-start bg-gray-100",
      cellClassName: "text-start",
    }),
    columnHelper.accessor("profit", {
      header: "profit",
      cell: (info) => info.getValue(),
      headerClassName: "text-start bg-gray-100",
      cellClassName: "text-start",
    }),
    columnHelper.accessor("profitMargin", {
      header: "Profit Margin",
      cell: (info) => info.getValue(),
      headerClassName: "text-center bg-gray-100 rounded-e-lg",
      cellClassName: "text-center",
    }),
  ];
  const getDashboardMetrics = async () => {
    try {
      const res = await getMetrics(range).unwrap();
      if (res) setMetricData(res);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (range.to && range.from) getDashboardMetrics();
  }, [range]);

  return (
    <div className="w-full h-full  flex flex-col pr-2 gap-4 overflow-auto ">
      <DateRange handleRange={setRange} />
      <div className="flex items-center gap-2 w-full">
        <KPI
          data={[
            {
              label: t("revenue"),
              value: metricData?.totalRevenue,
            },
            {
              label: t("profit"),
              value: metricData?.totalProfit,
            },
            {
              label: t("sale"),
              value: metricData?.totalSales,
            },
            {
              label: t("stockCost"),
              value: metricData?.totalStockCost,
            },
          ]}
        />
      </div>
      <div className="flex flex-col bg-white w-full justify-end  p-4 h-full  rounded-lg  ">
        <div className="flex justify-end gap-12 items-center mb-4">
          <button className={`border border-mainBorder px-4 py-1 rounded-lg *:`}>
            Daily
          </button>
          <button>Weekly</button>
          <button>Monthly</button>
        </div>
        <LineChart data={dailyRevenue} />
      </div>
      <div className="flex  flex-col bg-white w-full p-4 h-full  rounded-lg  ">
        <h1 className="text-xl text-mainText">Saatliq</h1>
        <LineChart data={hourlyRevenue} />
      </div>

      <div className="w-full flex flex-col gap-4 rounded-lg p-4 bg-white h-1/2">
        <h1 className="text-2xl">En cox satilanlar</h1>
        <div className="px-48 overflow-auto">
          <StockOverview />
        </div>
      </div>
    </div>
  );
};
