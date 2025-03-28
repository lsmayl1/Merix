import axios from "axios";
import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { Confirm } from "../Confirm";
import { useApi } from "../Context/useApiContext";

export const AddProduct = ({
  handleClose,

  handleAddProduct,
}) => {
  const {
    PutSuccess,
    form,
    setForm,
    FetchById,
    updateProduct,
    generateBarcode,
    DeleteProduct,
  } = useApi();

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

  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    const findProdutcByid = async () => {
      if (!form.product_id) {
        return;
      }
      try {
        await FetchById(form.product_id);
        setIsEditMode(true);
      } catch (error) {
        console.log(error);
      }
    };
    findProdutcByid();
  }, []);

  // Handle input changes
  const handleInputChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
  };

  // Handle unit toggle
  const handleUnitChange = (unit) => () => {
    setForm({ ...form, unit });
  };

  const handleConfirm = (option) => {
    if (!option) {
      return setShowConfirm(false);
    } else {
      handleClose();
      DeleteProduct(form.product_id);
    }
  };

  const handleEdit = async (product) => {
    try {
      await updateProduct(product);
      handleClose();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="absolute inset-0  z-50 flex h-screen w-full drop-shadow-md">
      <ToastContainer />
      {showConfirim && (
        <Confirm
          name={form.name + "  Silinsin ?"}
          handleOption={handleConfirm}
        />
      )}
      <div className="flex w-full justify-center py-32">
        <div className="flex h-fit w-1/3 flex-col gap-32 rounded-xl border border-[#ADA3A3] bg-white px-4 py-6">
          {/* Form Fields */}
          <div className="flex flex-col gap-12">
            {/* Product Name */}
            <div className="flex flex-col">
              <label htmlFor="name">Mehsulun adi</label>
              <input
                type="text"
                value={form.name || ""}
                onChange={handleInputChange("name")}
                className="w-1/2 rounded border border-[#ADA3A3] px-4 focus:outline-none"
              />
            </div>

            {/* Unit Selection */}
            <div className="flex flex-col">
              <label>Vahid</label>
              <div className="flex w-1/2">
                <button
                  onClick={handleUnitChange("piece")}
                  className={`rounded-l-lg border border-[#ADA3A3] px-4 py-1 ${
                    form.unit === "piece" ? "bg-gray-400" : ""
                  }`}
                >
                  Ədəd
                </button>
                <button
                  onClick={handleUnitChange("kg")}
                  className={`rounded-r-lg border border-[#ADA3A3] px-4 py-1 ${
                    form.unit === "kg" ? "bg-gray-400" : ""
                  }`}
                >
                  Kg
                </button>
              </div>
            </div>

            {/* Barcode */}
            <div className="flex w-1/2 flex-col">
              <label>Barkod</label>
              <div className="flex items-center gap-2">
                <input
                  type="text" // Changed to text to avoid number overflow
                  value={form.barcode || ""}
                  onChange={handleInputChange("barcode")}
                  className="w-9/12 rounded border border-[#ADA3A3] px-4 focus:outline-none"
                />
                <button
                  onClick={handleBarcode}
                  className="w-1/6 cursor-pointer px-2 rounded bg-gray-500  text-white"
                >
                  {">>>"}
                </button>
              </div>
            </div>

            {/* Prices */}
            <div className="flex flex-col gap-2">
              <div className="flex w-9/12 items-center justify-between rounded-lg border">
                <span className="w-2/5 border-r px-4">Alis Qiymeti</span>
                <div className="flex w-3/5 items-center gap-2">
                  <input
                    type="text"
                    value={form.buyPrice || "0.0000"}
                    onChange={handleInputChange("buyPrice")}
                    className="w-full text-right focus:outline-none"
                  />
                  <span className="px-2">₼</span>
                </div>
              </div>
              <div className="flex w-9/12 items-center justify-between rounded-lg border">
                <span className="w-2/5 border-r px-4">Satis Qiymeti</span>
                <div className="flex w-3/5 items-center gap-2">
                  <input
                    type="text"
                    value={form.sellPrice || "0.0000"}
                    onChange={handleInputChange("sellPrice")}
                    className="w-full text-right focus:outline-none"
                  />
                  <span className="px-2">₼</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-4">
            {isEditMode && (
              <button
                onClick={() => {
                  setShowConfirm(true);
                }}
                className="rounded-xl cursor-pointer bg-red-500 px-4 py-1 font-semibold text-white"
              >
                Sil
              </button>
            )}
            <button
              onClick={handleClose}
              className="rounded-xl cursor-pointer bg-red-700 px-4 py-1 font-semibold text-white"
            >
              Legv et
            </button>
            <button
              onClick={isEditMode ? () => handleEdit(form) : handleAddProduct}
              className="rounded-xl cursor-pointer bg-green-700 px-4 py-1 font-semibold text-white"
            >
              {isEditMode ? "Deyis" : "Elave et"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
