import React, { useState } from "react";
import Calendar from "../../assets/Calendar";
import { KPI } from "../../components/Metric/KPI";
import { Filters } from "../../assets/Filters";
import { FiltersModal } from "../../components/Filters/FiltersModal";
import { SearchIcon } from "../../assets/SearchIcon";
import { Table } from "../../components/Table";
import { createColumnHelper } from "@tanstack/react-table";
import { Details } from "../../assets/Details";

export const ProductReports = () => {
  const [showFiltersModal, setShowFiltersModal] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const columnHelper = createColumnHelper();

  const columns = [
    columnHelper.accessor("name", {
      header: "Name",
      headerClassName: "text-start rounded-s-lg bg-gray-100",
      cellClassName: "text-start",
    }),
    columnHelper.accessor("barcode", {
      header: "Barcode",
      headerClassName: "text-start bg-gray-100",
      cellClassName: "text-start",
    }),
    columnHelper.accessor("unitsSold", {
      header: "Units Sold",
      headerClassName: "text-center bg-gray-100",
      cellClassName: "text-center",
    }),
    columnHelper.accessor("totalRevenue", {
      header: "Total Revenue",
      headerClassName: "text-center bg-gray-100",
      cellClassName: "text-center",
    }),
    columnHelper.accessor("totalProfit", {
      header: "Total Profit",
      headerClassName: "text-center bg-gray-100",
      cellClassName: "text-center",
    }),
    columnHelper.accessor("profitMargin", {
      header: "Profit Margin",
      headerClassName: "text-center bg-gray-100 rounded-e-lg",
      cellClassName: "text-center",
    }),
  ];

  const data = [
    {
      name: "Apple",
      barcode: "5566545454654",
      unitsSold: "1,200",
      totalRevenue: "300.00 ₼",
      totalProfit: "300.00 ₼",
      profitMargin: "20%",
    },
    {
      name: "Apple",
      barcode: "5566545454654",
      unitsSold: "1,200",
      totalRevenue: "300.00 ₼",
      totalProfit: "300.00 ₼",
      profitMargin: "20%",
    },
    {
      name: "Apple",
      barcode: "5566545454654",
      unitsSold: "1,200",
      totalRevenue: "300.00 ₼",
      totalProfit: "300.00 ₼",
      profitMargin: "20%",
    },
  ];

  return (
    <div className="flex flex-col gap-2  w-full h-full">
      <div className="flex w-full justify-between p-4 items-center">
        <h1 className="text-3xl font-semibold ">
          May 23 - May 30 <span className="text-xs text-gray-500"> 2025</span>
        </h1>
        <div className="flex items-center ">
          <button className="flex gap-4 items-center bg-white py-2 px-4 rounded-lg border border-mainBorder text-xl">
            <Calendar />
            This Week
          </button>
        </div>
      </div>
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
      <div className="flex flex-col gap-2 w-full h-full min-h-0  bg-white rounded-lg px-4 py-2 relative">
        <div className="flex gap-2 items-center">
          <div className="flex items-center gap-2 w-full relative">
            <input
              type="text"
              placeholder="Search by name or barcode"
              // value={inputValue}
              // onChange={(e) => setInputValue(e.target.value)}
              // onKeyDown={handleInputKeyDown}
              className="px-12 w-full  py-2 rounded-lg bg-white focus:outline-blue-500 "
            />
            <SearchIcon className="absolute left-2" />
          </div>
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
            data={data}
            // isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
};
