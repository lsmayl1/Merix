import React, { useState } from "react";
import { KPI } from "../../components/Metric/KPI";
import { t } from "i18next";
import { NavLink } from "react-router-dom";
import {
  useCreateSupplierMutation,
  useGetSuppliersQuery,
  useGetTotalPaymentsMetricQuery,
} from "../../redux/slices/SupplierSlice";
import { Modal } from "../../components/Supplier/Modal";
import { Plus } from "../../assets/Plus";

export const Suppliers = () => {
  const { data, refetch } = useGetSuppliersQuery();
  const [showModal, setShowModal] = useState(false);
  const [createSupplier] = useCreateSupplierMutation();
  const { data: metric } = useGetTotalPaymentsMetricQuery();

  const onSubmit = async (data) => {
    try {
      await createSupplier(data).unwrap();
      setShowModal(false);
      refetch();
    } catch (error) {
      console.error("Failed to create supplier:", error);
    }
  };
  return (
    <div className="w-full flex flex-col gap-2 h-full py-2 ">
      <div className="flex items-center gap-2 w-full">
        <KPI
          data={[
            {
              label: t("Cemi Borc"),
              value: metric?.total,
            },
            {
              label: "Teskilatci Sayi",
              value: metric?.supplierCount,
            },
          ]}
        />
      </div>
      <div className="bg-white w-full h-full rounded-lg overflow-auto p-4 gap-4 flex flex-col relative">
        {showModal && (
          <Modal onSubmit={onSubmit} handleClose={() => setShowModal(false)} />
        )}
        <div className="flex items-center justify-between ">
          <h1 className="text-2xl font-semibold text-gray-800">
            {t("supplier")}
          </h1>

          <button
            onClick={() => setShowModal(true)}
            className="border bg-white border-gray-200 rounded-xl text-nowrap px-4 cursor-pointer max-md:px-2 max-md:text-xs flex items-center gap-2 py-1 max-md:py-0"
          >
            <Plus className="max-md:size-5" />
            {t("Add Supplier")}
          </button>
        </div>
        <div className="grid grid-cols-1 gap-4 pr-4 overflow-auto">
          {data?.map((supplier) => (
            <NavLink
              key={supplier.id}
              to={`/suppliers/${supplier.id}`}
              className="bg-white rounded-lg hover:shadow-lg transition-shadow duration-300 p-6 flex items-center justify-between border border-gray-200"
            >
              <div className="flex flex-col gap-2	">
                {/* Header Section - Now just name and contact person */}
                <div className="">
                  <h3 className="text-2xl font-semibold text-gray-800">
                    {supplier.name}
                  </h3>
                </div>
              </div>

              {/* Borrow Balance */}
              <div className="">
                <p className="text-lg text-gray-600 font-medium">Borc:</p>
                <p
                  className={`text-xl font-semibold ${
                    supplier.totalDebt > 0 ? "text-red-600" : "text-green-600"
                  }`}
                >
                  {supplier.totalDebt || "0.00 ₼"}
                </p>
              </div>
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  );
};
