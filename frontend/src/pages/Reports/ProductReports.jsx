import React, { useEffect, useState } from "react";
import Calendar from "../../assets/Calendar";
import { KPI } from "../../components/Metric/KPI";
import { Filters } from "../../assets/Filters";
import { FiltersModal } from "../../components/Filters/FiltersModal";
import { SearchIcon } from "../../assets/SearchIcon";
import { Table } from "../../components/Table";
import { createColumnHelper } from "@tanstack/react-table";
import { Details } from "../../assets/Details";
import { DateRange } from "../../components/Date/DateRange";
import {
  useGetProductsMetricsQuery,
  useGetProductSoldMetricsMutation,
  useGetProductsReportMutation,
} from "../../redux/slices/ApiSlice";

export const ProductReports = () => {
  const [getProductMetric] = useGetProductSoldMetricsMutation();
  const [metricData, setMetricData] = useState({});
  const [data, setData] = useState([]);
  const [showFiltersModal, setShowFiltersModal] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const columnHelper = createColumnHelper();
  const [range, setRange] = useState({
    from: "",
    to: "",
  });
  const [getProductsReport] = useGetProductsReportMutation();
  const columns = [
    columnHelper.accessor("productName", {
      header: "Product",
      headerClassName: "text-start rounded-s-lg bg-gray-100",
      cellClassName: "text-start",
    }),

    columnHelper.accessor("totalSold", {
      header: "Units Sold",
      headerClassName: "text-center bg-gray-100",
      cellClassName: "text-center",
    }),
    columnHelper.accessor("unit", {
      header: "Unit",
      headerClassName: "text-center bg-gray-100",
      cellClassName: "text-center",
    }),
    columnHelper.accessor("totalRevenue", {
      header: "Total Revenue",
      headerClassName: "text-center bg-gray-100",
      cellClassName: "text-center",
    }),
    columnHelper.accessor("profit", {
      header: "Total Profit",
      headerClassName: "text-center bg-gray-100",
      cellClassName: "text-center",
    }),
  ];

  const getReports = async () => {
    try {
      const res = await getProductsReport(range).unwrap();
      if (res) {
        setData(res);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const getProductsReports = async () => {
    try {
      const res = await getProductMetric(range).unwrap();
      if (res) {
        setMetricData(res);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (range.from && range.to) {
      getReports(range);
      getProductsReports(range);
    }
  }, [range]);

  return (
    <div className="flex flex-col gap-2  w-full h-full">
      <DateRange handleRange={setRange} />
      <KPI
        data={[
          {
            label: "Total Stock Cost",
            value: metricData?.totalStockCost,
          },
          {
            label: "Quantity Sold",
            value: metricData?.quantitySold,
          },
        ]}
      />
      <div className="flex flex-col gap-2 w-full h-full min-h-0  bg-white rounded-lg px-4 py-2 relative">
        <div className="flex gap-2 items-center justify-end">
          <div className="flex  relative ">
            <button
              onClick={() => setShowFiltersModal(!showFiltersModal)}
              className="border bg-white border-gray-200 rounded-xl text-nowrap px-4 cursor-pointer flex items-center gap-2 py-1"
            >
              <Filters />
              Filters
            </button>
            {showFiltersModal && (
              <FiltersModal handleClose={setShowFiltersModal} />
            )}
          </div>
        </div>

        <div className="min-h-0 w-full px-2">
          <Table
            columns={columns}
            data={data?.products}
            // isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
};
