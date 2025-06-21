import React, { useState } from "react";
import Calendar from "../../assets/Calendar";
import { KPI } from "../../components/Metric/KPI";
import { Filters } from "../../assets/Filters";
import { FiltersModal } from "../../components/Filters/FiltersModal";
import { SearchIcon } from "../../assets/SearchIcon";
import { Table } from "../../components/Table";
import { createColumnHelper } from "@tanstack/react-table";
import { Details } from "../../assets/Details";
import { useGetAllSalesQuery } from "../../redux/slices/ApiSlice";
import { SaleDetailsModal } from "../../components/Reports/SaleDetailsModal";
import { DateRange } from "../../components/Date/DateRange";

export const SalesReports = () => {
  const [showFiltersModal, setShowFiltersModal] = useState(false);
  const { data } = useGetAllSalesQuery();
  const [inputValue, setInputValue] = useState("");
  const columnHelper = createColumnHelper();
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedSale, setSelectedSale] = useState(null);
  const columns = [
    columnHelper.accessor("sale_id", {
      header: "ID",
      headerClassName: "text-center rounded-s-lg bg-gray-100",
      cellClassName: "text-center",
    }),
    columnHelper.accessor("date", {
      header: "Date",
      headerClassName: "text-center bg-gray-100",
      cellClassName: "text-center",
    }),
    columnHelper.accessor("total_amount", {
      header: "Total Sale Amount",
      headerClassName: "text-center bg-gray-100",
      cellClassName: "text-center",
      cell: ({ getValue }) => <span>{getValue()} ₼</span>,
    }),
    columnHelper.accessor("payment_method", {
      header: "Payment Method",
      headerClassName: "text-center bg-gray-100",
      cellClassName: "text-center",
    }),
    columnHelper.accessor("profit", {
      header: "Profit",
      headerClassName: "text-center bg-gray-100",
      cellClassName: "text-center",
      cell: ({ getValue }) => <span>{getValue().toFixed(2)} ₼</span>,
    }),
    columnHelper.accessor("details", {
      header: "Details",
      headerClassName: "text-center bg-gray-100 rounded-e-lg",
      cell: ({ row }) => (
        <button
          onClick={() => handleDetails(row?.original?.sale_id)}
          className="text-mainText hover:underline"
        >
          <Details />
        </button>
      ),
      cellClassName: "text-center",
    }),
  ];
  const handleDetails = (id) => {
    if (!id) return;
    setSelectedSale(id);
    setShowDetailsModal(true);
  };

  return (
    <div className="flex flex-col gap-2  w-full h-full relative">
      <DateRange />
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
      {showDetailsModal && (
        <SaleDetailsModal
          saleId={selectedSale}
          handleClose={setShowDetailsModal}
        />
      )}
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

        <div className="min-h-0 w-full h-full px-2 relative">
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
