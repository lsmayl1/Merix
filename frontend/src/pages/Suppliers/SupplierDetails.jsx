import React, { useState } from "react";
import { Table } from "../../components/Table";
import { createColumnHelper } from "@tanstack/react-table";
import { t } from "i18next";
import { useParams } from "react-router-dom";
import {
  useCreateSupplierTransactionMutation,
  useGetSupplierByIdQuery,
  useGetSupplierTransactionsByIdQuery,
} from "../../redux/slices/SupplierSlice";
import { TransactionModal } from "../../components/Supplier/TransactionModal";
import { KPI } from "../../components/Metric/KPI";
import { Plus } from "../../assets/Plus";

export const SupplierDetails = () => {
  const { id } = useParams();
  const { data } = useGetSupplierByIdQuery(id);
  const { data: transactions, refetch } =
    useGetSupplierTransactionsByIdQuery(id);
  const [createTransaction] = useCreateSupplierTransactionMutation();
  const columnHelper = createColumnHelper();
  const columns = [
    columnHelper.accessor("id", {
      header: "ID",
      cellClassName: "text-center",
    }),
    columnHelper.accessor("date", {
      header: t("date"),
      cellClassName: "text-center",
    }),

    columnHelper.accessor("amount", {
      header: t("amount"),
      cellClassName: "text-center",
    }),
    columnHelper.accessor("type", {
      header: t("type"),
      cellClassName: "text-center",
    }),

    columnHelper.accessor("payment_method", {
      header: t("paymentMethod"),
      cellClassName: "text-center",
      cell: ({ getValue }) => (getValue() == "cash" ? t("cash") : t("card")),
    }),
  ];
  const [showModal, setShowModal] = useState(false);

  const handleTransactionSubmit = async (data) => {
    try {
      if (!data.amount || data.amount <= 0) {
        throw new Error("Amount must be greater than 0");
      }
      await createTransaction({
        ...data,
        supplier_id: id,
      });
      setShowModal(false);
      refetch();
    } catch (error) {
      console.error("Error creating transaction:", error);
    }
  };
  return (
    <div className="p-4 flex flex-col gap-4 w-full h-full">
      <div className="items-center flex gap-12  w-full  justify-between ">
        <h1 className="text-3xl font-semibold text-nowrap">{data?.name}</h1>
        <div className="bg-white w-1/5  h-full justify-between px-4 py-4  rounded-lg flex flex-col gap-2">
          <label className="text-mainText text-nowrap max-md:text-xs font-medium capitalize">
            Cemi Borc
          </label>
          <span className="text-3xl font-semibold max-md:text-2xl text-nowrap">
            {transactions?.totalAmount || 0}
          </span>
        </div>
      </div>
      <div className="flex flex-col bg-white w-full h-full  rounded-lg  relative">
        {showModal && (
          <TransactionModal
            handleClose={() => setShowModal(false)}
            onSubmit={handleTransactionSubmit}
          />
        )}
        <div className="py-2 px-4 flex justify-end items-center">
          <button
            onClick={() => setShowModal(true)}
            className="border bg-white border-gray-200 rounded-xl text-nowrap px-4 cursor-pointer max-md:px-2 max-md:text-xs flex items-center gap-2 py-1 max-md:py-0"
          >
            <Plus className="max-md:size-5" />
            {t("createTransaction")}
          </button>
        </div>
        <div className="flex flex-col gap-4 px-4">
          <Table columns={columns} data={transactions?.transactions} />
        </div>
      </div>
    </div>
  );
};
