import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { Confirm } from "../Confirm";
import { useApi } from "../Context/useApiContext";
import { useMediaQuery } from "react-responsive";
import { BarcodeReader } from "../BarcodeReader";
export const AddProduct = ({ handleClose, isEditMode }) => {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const {
    PutSuccess,
    form,
    setForm,
    FetchById,
    generateBarcode,
    DeleteProduct,
    refetch,
    NewProduct,
    FetchData,
    PostError,
    PostProduct,
    API,
  } = useApi();
  const nameInputRef = useRef(null);
  // Generate barcode based on unit
  const handleBarcode = async () => {
    try {
      const res = await generateBarcode(form.unit);
      setForm({ ...form, barcode: res });
    } catch (error) {
      console.error("Barcode generation failed:", error);
    }
  };
  const [showConfirim, setShowConfirm] = useState(false);
  const [showBarcode, setShowBarcode] = useState(false);

  // Handle input changes
  const handleInputChange = (field) => (e) => {
    let value = e.target.value;
    setForm({ ...form, [field]: value });
  };

  // Handle unit toggle
  const handleUnitChange = (unit) => () => {
    setForm({ ...form, unit });
  };

  const handleConfirm = async (option) => {
    if (!option) {
      return setShowConfirm(false);
    } else {
      handleClose();
      await DeleteProduct(form.product_id);
      await refetch();
    }
  };

  const handleEdit = async (id) => {
    try {
      const res = await axios.put(`${API}/products/${id}`, form);
      FetchData();
      handleClose();
      toast.success(`${res.data.name} melumatlari deyisdirildi`);
    } catch (err) {
      toast.error(`Xeta ${err?.response.data.error}`);
      console.log(err);
    }
  };

  const handleAddProduct = async () => {
    try {
      await axios.post(`${API}/products`, form);
      handleClose();
      FetchData();
      toast.success(`${form?.name || "Mehsul"} Elave olundu}`);
    } catch (err) {
      toast.error(`Xeta ${err?.response.data.error}`);
      console.log(err);
    }
  };

  // const handleCloseReader = () => {
  //   setShowBarcode(false);
  // };
  // const handleBarcodeReader = (barcode) => {
  //   setForm({ ...form, barcode });
  //   setShowBarcode(false);
  // };

  return (
    <div className="absolute inset-0 backdrop-blur-lg   z-50 flex h-screen w-full drop-shadow-md">
      <ToastContainer />
      {showConfirim && (
        <Confirm
          name={form.name + "  Silinsin ?"}
          handleOption={handleConfirm}
        />
      )}
      {/* {showBarcode && (
        <BarcodeReader
          handleCloseReader={handleCloseReader}
          handleBarcodeReader={handleBarcodeReader}
        />
      )} */}
      {/* Barcode Reader Component */}
      <div
        className={`flex w-full justify-center ${
          isMobile ? "py-2 px-2 h-full" : "py-16"
        }`}
      >
        <div
          className={`flex  ${
            isMobile ? "w-full  h-[90%] justify-between" : "w-1/2 gap-32 h-fit"
          } flex-col  rounded-xl border border-newborder bg-white px-4 py-6`}
        >
          {/* Form Fields */}
          <div className={`flex flex-col  ${isMobile ? "gap-16" : "gap-12"}`}>
            {/* Product Name */}
            <div className="w-full flex justify-between items-end gap-16">
              <div className="flex flex-col w-full">
                <label htmlFor="name" className="text-xl max-lg:text-md">
                  Mehsulun adı
                </label>
                <input
                  ref={nameInputRef}
                  id="name"
                  type="text"
                  value={form.name || ""}
                  onChange={handleInputChange("name")}
                  className="rounded w-full border py-2 border-newborder px-4 focus:outline-none"
                />
              </div>
            </div>

            {/* Unit Selection */}
            <div className="flex flex-col">
              <label className="text-xl max-lg:text-md">Vahid</label>
              <div className="flex w-1/2">
                <button
                  onClick={handleUnitChange("piece")}
                  className={`rounded-l-lg cursor-pointer border border-newborder px-4 py-1 ${
                    form.unit === "piece" ? "bg-gray-400" : ""
                  }`}
                >
                  Ədəd
                </button>
                <button
                  onClick={handleUnitChange("kg")}
                  className={`rounded-r-lg border border-newborder cursor-pointer px-4 py-1 ${
                    form.unit === "kg" ? "bg-gray-400" : ""
                  }`}
                >
                  Kg
                </button>
              </div>
            </div>

            {/* Barcode */}
            <div className="flex w-1/2 flex-col max-lg:w-full">
              <label className="text-xl max-lg:text-md">Barkod</label>
              <div className="flex items-center gap-2 max-lg:justify-between">
                <input
                  type="text" // Changed to text to avoid number overflow
                  value={form.barcode || ""}
                  onChange={handleInputChange("barcode")}
                  className="w-9/12 rounded border border-newborder px-4 focus:outline-none"
                />
                <button
                  onClick={handleBarcode}
                  className="w-1/6 cursor-pointer px-2 rounded bg-gray-500  text-white"
                >
                  {">>>"}
                </button>
                {isMobile && (
                  <button
                    onClick={() => setShowBarcode(true)}
                    className="px-2 truncate rounded border border-newborder"
                  >
                    Barkod oxu
                  </button>
                )}
              </div>
            </div>

            {/* Prices */}
            <div className="flex flex-col gap-2">
              <div className="flex w-9/12 max-lg:w-full items-center justify-between rounded-lg border border-newborder">
                <span className="w-2/5 border-r border-newborder px-4 max-lg:text-md truncate">
                  Alis Qiymeti
                </span>
                <div className="flex w-3/5 items-center gap-2  ">
                  <input
                    type="number"
                    value={
                      typeof form?.buyPrice === "number"
                        ? form?.buyPrice.toFixed(2)
                        : form?.buyPrice
                    }
                    onChange={handleInputChange("buyPrice")}
                    className="w-full text-right text-xl focus:outline-none"
                  />
                  <span className="px-2 text-xl">₼</span>
                </div>
              </div>
              <div className="flex w-9/12 max-lg:w-full items-center justify-between rounded-lg border border-newborder">
                <span className="w-2/5 border-r border-newborder px-4 max-lg:text-md truncate">
                  Satis Qiymeti
                </span>
                <div className="flex w-3/5 items-center gap-2">
                  <input
                    type="number"
                    value={
                      typeof form?.sellPrice === "number"
                        ? form?.sellPrice.toFixed(2)
                        : form?.sellPrice
                    }
                    onChange={handleInputChange("sellPrice")}
                    className="w-full text-xl text-right focus:outline-none"
                  />
                  <span className="px-2 text-xl">₼</span>
                </div>
              </div>
            </div>
            {/* Stok */}
            <div className="flex justify-between items-center w-full ">
              {isEditMode && (
                <div className="flex gap-2 items-center text-xl  w-full">
                  <label htmlFor="" className="max-lg:text-md">
                    Stok da
                  </label>
                  <span className="max-lg:text-md"> {form.stock | 0}</span>
                  <span className="max-lg:text-md">
                    {form.unit === "piece" ? "ədəd" : "kg"}
                  </span>
                </div>
              )}
              <div className="w-full justify-end items-center gap-4 flex">
                <label
                  htmlFor=""
                  className="truncate text-nowrap text-xl max-lg:text-md"
                >
                  Stok əlavə
                </label>
                <input
                  type="number"
                  onChange={handleInputChange("newStock")}
                  className="border focus:outline-none rounded text-center px-1 text-xl border-newborder w-1/6 "
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between gap-4">
            <button className="rounded-xl cursor-pointer bg-white border border-newborder w-1/4 py-1 px-4     font-semibold max-lg:text-md max-lg:font-normal truncate ">
              Cap et
            </button>
            <div className="flex items-center gap-4 justify-end w-full">
              {isEditMode && (
                <button
                  onClick={() => {
                    setShowConfirm(true);
                  }}
                  className="rounded-xl max-lg:text-md cursor-pointer bg-red-500 px-4 py-1 font-semibold text-white"
                >
                  Sil
                </button>
              )}
              <button
                onClick={handleClose}
                className="rounded-xl truncate  max-lg:text-md cursor-pointer bg-red-700 px-4 py-1 font-semibold text-white"
              >
                Legv et
              </button>

              {isEditMode ? (
                <button
                  onClick={() => handleEdit(form.product_id)}
                  className="rounded-xl cursor-pointer max-lg:text-md bg-green-700 px-4 py-1 font-semibold text-white"
                >
                  Deyis
                </button>
              ) : (
                <button
                  onClick={handleAddProduct}
                  className="rounded-xl max-lg:text-md cursor-pointer bg-green-700 px-4 py-1 font-semibold text-white"
                >
                  Elave et
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
