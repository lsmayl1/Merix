import React, { useEffect, useState } from "react";
import { CreditCard } from "../../assets/CreditCard";
import { Cash } from "../../assets/Cash";
import CloseSquare from "../../assets/Navigation/CloseSquare";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import TrashBin from "../../assets/TrashBin";
import { BarcodeField } from "../BarcodeField";
import {
  useGetProductByIdQuery,
  useGetProductsByQueryQuery,
  useLazyGetProductByIdQuery,
} from "../../redux/slices/ApiSlice";
import { SearchModal } from "../Pos/SearchModal";
import { Plus } from "../../assets/Plus";

export const TransactionModal = ({ handleClose, onSubmit }) => {
  const { t } = useTranslation();
  const [transactionType, setTransactionType] = useState("purchase");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [date, setDate] = useState(null);
  const [columns, setColumns] = useState([
    { label: "Name", key: "name" },
    { label: "Barcode", key: "barcode" },
    { label: "Buy Price", key: "buyPrice" },
    { label: "Quantity", key: "quantity" },
    { label: "Amount", key: "amount" },
    { label: "Delete", key: "delete" },
  ]);
  const [query, setQuery] = useState("");
  const { data } = useGetProductsByQueryQuery(query, {
    skip: !query,
  });
  const [productList, setProductList] = useState([]);
  const [trigger] = useLazyGetProductByIdQuery();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    defaultValues: {
      amount: "0",
      description: "",
    },
  });
  //   const handleTransactionTypeChange = (method) => {
  //     setTransactionType(method);
  //   };

  //   const handlePaymentMethodChange = (method) => {
  //     setPaymentMethod(method);
  //   };

  //   const validateSubmit = (data) => {
  //     onSubmit({
  //       ...data,
  //       type: transactionType,
  //       payment_method: paymentMethod,
  //       date,
  //     });
  //   };

  const handleBarcode = async (barcode) => {
    if (!barcode) {
      return;
    }
    const exist = productList.find(
      (x) => String(x.barcode) === String(x.barcode)
    );
    if (exist) {
      return;
    }
    try {
      const product = await trigger(barcode).unwrap();
      setProductList([
        ...productList,
        {
          name: product.name,
          barcode: product.barcode,
          buyPrice: product.buyPrice,
          quantity: 1,
        },
      ]);
      console.log(product);
    } catch (error) {
      console.log(error);
    }
  };

  const updateProduct = (index, key, value) => {
    const updated = [...productList];
    updated[index][key] = value === "" ? "" : parseFloat(value) || 0;

    // amount hesapla:
    updated[index].amount = Number(
      ((updated[index].buyPrice || 0) * (updated[index].quantity || 0)).toFixed(
        4
      )
    );

    setProductList(updated);
  };
  const AddProductFromSearch = async (barcode) => {
    console.log(barcode);

    // Önce mevcut listeyi kontrol et
    if (!barcode) {
      return;
    }
    const exist = productList.find(
      (x) => String(x.barcode) === String(barcode)
    );

    if (exist) {
      console.log("Product exists already");
      console.log(exist);

      return;
    }

    try {
      const newProduct = await trigger(barcode).unwrap();
      if (newProduct) {
        setProductList((prev) => [
          ...prev,
          {
            barcode: newProduct.barcode,
            name: newProduct.name,
            quantity: 1,
            buyPrice: newProduct.buyPrice || 0,
            amount: newProduct.buyPrice || 0,
          },
        ]);
      }
    } catch (error) {
      console.log("Ürün getirilirken hata:", error);
    }
  };

  const addProduct = () => {
    setProductList([
      ...productList,
      { name: "", barcode: "", buyPrice: 0, quantity: 0, amount: 0 },
    ]);
  };

  const removeProduct = (index) => {
    const updated = productList.filter((_, i) => i !== index);
    setProductList(updated);
  };
  return (
    <div className="absolute right-0 top-0 w-full flex-col gap-4 h-full flex  ">
      <div className="absolute right-0 top-0"></div>
      <div className="flex gap-4 overflow-auto flex-col  bg-white  w-full h-full border border-mainBorder  rounded-lg  p-4">
        <div className="flex justify-between items-center">
          <SearchModal
            query={query}
            setQuery={setQuery}
            data={data}
            handleAdd={AddProductFromSearch}
          />
          {/* Toplam */}
          <div className=" flex gap-2 items-center text-mainText font-semibold">
            Toplam:{" "}
            <span className="text-black text-xl">
              {productList
                ?.reduce(
                  (total, p) => total + (p.buyPrice || 0) * (p.quantity || 0),
                  0
                )
                .toFixed(2)}
            </span>
          </div>
          <div className="flex gap-4">
            <button
              //  onClick={() => setShowProductModal(true)}
              className="border bg-white border-red-500 rounded-xl text-nowrap px-4 cursor-pointer max-md:px-2 max-md:text-xs flex items-center text-red-500 gap-2 py-1 max-md:py-0"
            >
              {t("cancel")}
            </button>
            <button
              //  onClick={() => setShowProductModal(true)}
              className="border bg-white border-gray-200 rounded-xl text-nowrap px-4 cursor-pointer max-md:px-2 max-md:text-xs flex items-center gap-2 py-1 max-md:py-0"
            >
              {t("create")}
            </button>

            <BarcodeField handleBarcode={handleBarcode} />
          </div>
        </div>{" "}
        <div className="w-full">
          {/* Tablo Başlıkları */}
          <div className="grid grid-cols-6 font-bold text-sm bg-gray-100 ">
            {columns.map((col, idx) => (
              <div key={idx} className="p-2">
                {col.label}
              </div>
            ))}
          </div>

          {/* Ürün Satırları */}
          {productList?.map((product, index) => (
            <div key={index} className="grid grid-cols-6 w-full">
              <input
                className="p-2 border border-mainBorder"
                placeholder="Product Name"
                value={product.name}
                onChange={(e) => updateProduct(index, "name", e.target.value)}
              />
              <input
                className="p-2 border border-mainBorder"
                placeholder="Barcode"
                value={product.barcode}
                onChange={(e) =>
                  updateProduct(index, "barcode", e.target.value)
                }
              />
              <input
                type="number"
                step="0.01"
                className="p-2 border border-mainBorder"
                placeholder="Alış fiyatı (ör: 12.34)"
                value={
                  product.buyPrice !== undefined && product.buyPrice !== null
                    ? product?.buyPrice
                    : ""
                }
                onChange={(e) => {
                  const value = e.target.value;
                  updateProduct(
                    index,
                    "buyPrice",
                    value === "" ? "" : parseFloat(value) || 0
                  );
                }}
              />
              <input
                type="number"
                step={0.001}
                className="p-2 border border-mainBorder"
                placeholder="Miktar"
                value={
                  product.quantity !== undefined && product.quantity !== null
                    ? product.quantity
                    : ""
                }
                onChange={(e) =>
                  updateProduct(
                    index,
                    "quantity",
                    parseFloat(e.target.value).toFixed(2) || "0"
                  )
                }
              />
              <div className="p-2 border border-mainBorder ">
                {(product.quantity * product.buyPrice).toFixed(2)}
              </div>
              <button
                className="p-2 border border-mainBorder text-red-500"
                onClick={() => removeProduct(index)}
              >
                <TrashBin />
              </button>
            </div>
          ))}

          {/* Satır Ekle Butonu */}
          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={addProduct}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg"
            >
              + Add Product
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
