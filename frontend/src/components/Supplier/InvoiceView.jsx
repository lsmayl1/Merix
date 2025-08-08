import { createColumnHelper } from "@tanstack/react-table";
import React from "react";
import { Table } from "../Table";

export const InvoiceView = () => {
  const data = [];
  const columnHelper = createColumnHelper();
  const columns = [
    columnHelper.accessor("name", {
      header: "Name",
    }),
    columnHelper.accessor("unit", {
      header: "Unit",
    }),
    columnHelper.accessor("quantity", {
      header: "Quantity",
    }),
    columnHelper.accessor("buyPrice", {
      header: "Buy Price",
    }),
    columnHelper.accessor("amount", {
      header: "amount",
    }),
  ];
  return (
    <div className="flex absolute  w-full h-full   items-center justify-center z-50">
      <div className="flex bg-white min-w-1/2 h-full justify-between rounded-lg shadow-lg flex-col gap-6 p-6">
        <h1 className="w-full text-center font-semibold text-2xl">
          Invoice Details
        </h1>
        <div className="flex justify-between pb-4 border-b border-mainBorder ">
          <div className="flex flex-col ">
            <h1 className="text-lg font-semibold text-mainText">Sale ID</h1>
            <span className="text-lg  ">#{data?.saleId}</span>
          </div>
          <div className="flex flex-col ">
            <h1 className="text-lg font-semibold text-end text-mainText">
              Date
            </h1>
            <span className="text-lg">{data?.date || 21}</span>
          </div>
        </div>
        <div className="min-h-0 h-full max-h-[400px] overflow-auto ">
          <Table columns={columns} data={data?.details} pagination={false} />
        </div>
        <div className="flex justify-between items-center">
          <span className="text-2xl font-semibold">Total</span>
          <span className="text-2xl font-semibold">
            {data?.totalAmount || 0.0}
          </span>
        </div>
        <div className="flex gap-2 justify-end">
          <button
            // onClick={() => handleClose(false)}
            className="px-4 py-2 border-red-500 border text-red-500  font-semibold rounded-lg"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
};
