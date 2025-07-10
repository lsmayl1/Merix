import React, { useEffect, useRef, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useMediaQuery } from "react-responsive";
import { useForm } from "react-hook-form";
import {
  useGetBarcodeMutation,
  useGetProductsQuery,
  usePostProductMutation,
  usePutProductByIdMutation,
} from "../../redux/slices/ApiSlice";
import Generate from "../../assets/Generate";
import { Html5QrcodeScanner } from "html5-qrcode";
import { useTranslation } from "react-i18next";
export const ProductModal = ({
  handleClose,
  isEditMode,
  editForm,
  handleDelete,
  handleUpdateProduct,
  handleAddProduct,
}) => {
  const { t } = useTranslation();
  const isMobile = useMediaQuery({ maxWidth: 768 });

  const [getBarcode, { isLoading: barcodeLoading, isError: barcodeError }] =
    useGetBarcodeMutation();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      product_id: editForm?.product_id,
      name: editForm?.name || "",
      unit: editForm?.unit || "piece",
      barcode: editForm?.barcode || null,
      buyPrice: editForm?.buyPrice || 0.0,
      sellPrice: editForm?.sellPrice || 0.0,
      stock: editForm?.stock || 0,
      category: "Product",
      newStock: 0,
    },
  });
  const nameInputRef = useRef(null);
  const handleProductCrud = async (data) => {
    if (isEditMode) {
      handleUpdateProduct(data);
    } else {
      handleAddProduct(data);
    }
  };
  const handleBarcode = async () => {
    try {
      const res = await getBarcode({ unit: watch("unit") }).unwrap();
      setValue("barcode", res.barcode);
    } catch (error) {
      console.error("Barcode generation failed:", error);
    }
  };
  useEffect(() => {
    if (editForm) {
      setValue("product_id", editForm.product_id);
      setValue("name", editForm.name);
      setValue("unit", editForm.unit);
      setValue("barcode", editForm.barcode);
      setValue("buyPrice", editForm.buyPrice);
      setValue("sellPrice", editForm.sellPrice);
      setValue("stock", editForm.stock);
    }
  }, [editForm]);

  return (
    <div className="absolute inset-0 z-50 flex max-md:-top-54  h-screen w-full drop-shadow-lg">
      <ToastContainer />

      <div
        className={`flex w-full  justify-center max-md:p-0 ${
          isMobile ? "py-2 px-2 h-full" : ""
        }`}
      >
        <div
          className={`flex  ${
            isMobile
              ? "w-full max-md:h-full  h-[90%] justify-between"
              : " gap-32 h-fit"
          } flex-col  rounded-xl border border-gray-200 bg-white px-4 py-6 `}
        >
          {/* Form Fields */}
          <form
            onSubmit={handleSubmit(handleProductCrud)}
            className={`flex flex-col w-full  max-md:gap-8 ${
              isMobile ? "gap-16" : "gap-10"
            }`}
          >
            {/* Product Name */}
            <div className="flex justify-between items-end ">
              <div className="flex flex-col w-full ">
                <label htmlFor="name" className="text-md max-lg:text-md">
                  {t("name")}
                </label>
                <input
                  ref={nameInputRef}
                  id="name"
                  placeholder={t("name")}
                  {...register("name", { required: "Name Required" })}
                  className="rounded-lg focus:outline-blue-500  border py-1 border-mainBorder px-2"
                />
                <p className="text-red-500 text-sm">{errors?.name?.message}</p>
              </div>
            </div>
            <div className="flex max-md:flex-col  gap-4">
              {/* Unit Selection */}
              <div className="flex flex-col">
                <label className="text-md max-lg:text-md">{t("unit")}</label>
                <div className="flex bg-white rounded-lg border w-fit border-mainBorder ">
                  <button
                    type="button"
                    onClick={() => setValue("unit", "piece")}
                    className={`px-2 py-1 cursor-pointer   ${
                      watch("unit") === "piece"
                        ? "bg-blue-500 text-white rounded-lg"
                        : ""
                    }`}
                  >
                    {t("piece")}
                  </button>
                  <button
                    type="button"
                    onClick={() => setValue("unit", "kg")}
                    className={` px-4 py-1 cursor-pointer ${
                      watch("unit") === "kg"
                        ? "bg-blue-500 text-white rounded-lg"
                        : ""
                    }`}
                  >
                    Kg
                  </button>
                </div>
              </div>

              {/* Barcode */}
              <div className="flex  w-full flex-col max-lg:w-full">
                <label className="text-md max-lg:text-md">{t("barcode")}</label>
                <div className="flex items-center gap-1 max-lg:justify-between w-full">
                  <input
                    type="text"
                    placeholder="Enter Barcode or Generate"
                    {...register("barcode")}
                    className=" rounded-lg border w-full border-mainBorder py-1 px-2 focus:outline-blue-500"
                  />
                  <button
                    type={"button"}
                    onClick={handleBarcode}
                    className="cursor-pointer py-1 px-2 rounded-lg bg-blue-500  text-white"
                  >
                    <Generate className={"size-6"} />
                  </button>
                </div>
              </div>
            </div>
            {/* Prices */}
            <div className="flex  gap-2 max-md:flex-col">
              <div className="flex    rounded-lg flex-col">
                <label className="text-md">{t("buyPrice")}</label>
                <div className="flex w-fit gap-2 relative ">
                  <input
                    type="number"
                    step={0.01}
                    {...register("buyPrice")}
                    className=" border  border-mainBorder rounded-lg px-2 py-1 focus:outline-blue-500"
                  />
                  <span className="px-2 text-xl absolute right-0">₼</span>
                </div>
              </div>
              <div className="flex    rounded-lg flex-col">
                <label className="text-md">{t("sellPrice")}</label>
                <div className="flex w-fit gap-2 relative ">
                  <input
                    type="number"
                    step="0.01"
                    {...register("sellPrice")}
                    className=" border  border-mainBorder rounded-lg px-2 py-1 focus:outline-blue-500"
                  />
                  <span className="px-2 text-xl absolute right-0">₼</span>
                </div>
              </div>
            </div>
            {/* Stok */}

            {isEditMode ? (
              <div className="flex gap-2  ">
                <div className="flex-col flex">
                  <label
                    htmlFor=""
                    className="truncate text-nowrap text-md max-lg:text-md"
                  >
                    {t("stock")}
                  </label>
                  <input
                    type="number"
                    value={watch("stock")}
                    className="border focus:outline-none rounded-lg w-1/2  px-2 py-1  border-mainBorder  "
                  />
                </div>
                <div className="flex-col flex">
                  <label
                    htmlFor=""
                    className="truncate text-nowrap text-md max-lg:text-md"
                  >
                    {t("addStock")}
                  </label>
                  <input
                    type="number"
                    step={0.01}
                    min={-999999999}
                    {...register("newStock")}
                    className="border focus:outline-none rounded-lg w-1/2  px-2 py-1  border-mainBorder  "
                  />
                </div>
              </div>
            ) : (
              <div className="flex-col flex">
                <label
                  htmlFor=""
                  className="truncate text-nowrap text-md max-lg:text-md"
                >
                  {t("stock")}
                </label>
                <input
                  type="number"
                  step={0.01}
                  {...register("stock")}
                  className="border focus:outline-none rounded-lg w-1/2  px-2 py-1  border-mainBorder  "
                />
              </div>
            )}
            {/* Action Buttons */}
            <div className="flex items-center justify-between gap-4">
              {/* <button className="rounded-xl cursor-pointer bg-white border border-mainBorder w-1/4 py-1 px-4     font-semibold max-lg:text-md max-lg:font-normal truncate ">
                Cap et
              </button> */}
              <div className="flex items-center gap-4 justify-end w-full">
                {isEditMode && (
                  <button
                    type="button"
                    onClick={() => handleDelete(watch("product_id"))}
                    className="rounded-xl max-lg:text-md cursor-pointer bg-red-500 px-4 py-1 font-semibold text-white"
                  >
                    {t("delete")}
                  </button>
                )}
                <button
                  onClick={() => {
                    reset();
                    handleClose();
                  }}
                  className="rounded-xl truncate  max-lg:text-md cursor-pointer border border-red-700 px-4 py-1 font-semibold text-red-700"
                >
                  {t("cancel")}
                </button>

                {isEditMode ? (
                  <button className="rounded-xl cursor-pointer max-lg:text-md border border-blue-700 px-4 py-1 font-semibold text-blue-700">
                    {t("update")}
                  </button>
                ) : (
                  <button className="rounded-xl max-lg:text-md cursor-pointer border border-blue-700 px-4 py-1 font-semibold text-blue-700">
                    {t("add")}
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
