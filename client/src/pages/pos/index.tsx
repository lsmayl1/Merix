import React, { useEffect, useRef, useState } from "react";
import { TrashBin } from "../../assets/Icons/TrashBin";
import { createColumnHelper } from "@tanstack/react-table";
import { Table } from "../../components/table";
// import {
//   useGetProductsByQueryQuery,
//   useLazyGetProductByIdQuery,
//   usePostSaleMutation,
//   usePostSalePreviewMutation,
// } from "../redux/slices/ApiSlice";
import { ProductSide } from "../../components/pointOfSale/productsSide";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { PaymentSide } from "../../components/pointOfSale/paymentSide";
import { QtyInput } from "../../components/pointOfSale/qtyInput";
import { Payment } from "../../assets/Icons/Payment";
export const Pos = () => {
  const { t } = useTranslation();
  const columnHelper = createColumnHelper();
  const [inputData, setInputData] = useState([]);
  const [paymentStage, setPaymentStage] = useState(false);
  const [data, setData] = useState([
    {
      barcode: "1234567890123",
      name: "Sample Product 1",
      sellPrice: 10.0,
	  quantity: 2,
	  subtotal: 20.0,
    },
  ]);
  const [query, setQuery] = useState("");
  //   const [postPreview, { isLoading: previewLoading }] =
  //     usePostSalePreviewMutation();
  //   const { data: searchData } = useGetProductsByQueryQuery(query, {
  //     skip: !query || query.length < 3,
  //   });
  //   const [trigger, { isLoading, isFetching }] = useLazyGetProductByIdQuery();
  const columns = [
    columnHelper.accessor("name", {
      header: t("product"),
      headerClassName: "text-start rounded-s-lg bg-gray-100",
      cellClassName: "text-start",
    }),
    columnHelper.accessor("sellPrice", {
      header: t("price"),
      headerClassName: "text-center  bg-gray-100",
      cellClassName: "text-center",
      cell: ({ row }) => <span>{row.original?.sellPrice?.toFixed(2)} ₼</span>,
    }),
    columnHelper.accessor("quantity", {
      header: t("quantity"),
      cell: ({ row }) => (
        <QtyInput
          qty={row.original.quantity}
          barcode={row.original.barcode}
          handleQty={handleChangeQtyAndFocus}
          allign={"justify-center"}
        />
      ),
      headerClassName: "text-center  bg-gray-100",
      cellClassName: "text-center",
    }),
    columnHelper.accessor("subtotal", {
      header: t("subtotal"),
      headerClassName: "text-center  bg-gray-100",
      cellClassName: "text-center",
      cell: ({ row }) => (
        <div>
          <span>{row.original?.subtotal?.toFixed(2)} ₼</span>
        </div>
      ),
    }),
    columnHelper.accessor("action", {
      header: t("delete"),
      headerClassName: "text-center rounded-e-lg bg-gray-100",
      cellClassName: "text-center",
      cell: ({ row }) => (
        <button onClick={() => handleDeleteProduct(row.original.barcode)}>
          <TrashBin className="size-6 text-red-500" />
        </button>
      ),
    }),
  ];
  const searchInput = useRef();
  const modalRef = useRef();
  const barcodeRef = useRef();

  useEffect(() => {
    document.title = "Kassa";
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key.toLowerCase();

      if (e.ctrlKey && key === "k") {
        e.preventDefault();
        searchInput.current?.focus();
      } else if (key === "/") {
        e.preventDefault();
        receivedInput.current?.select();
      } else if (key === "escape") {
        setQuery("");
        barcodeRef.current?.focus();
      }
    };

    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        setQuery("");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleChangeQty = async (barcode, action, qty) => {
    const existProduct = inputData.find((x) => x.barcode == barcode);

    if (existProduct) {
      // Adet bazlı ürünler için eski davranış
      if (existProduct.unit === "piece") {
        setInputData((prevData) =>
          prevData.map((item) => {
            if (item.barcode === barcode) {
              let newQuantity = item.quantity;

              if (qty !== undefined && qty !== null) {
                newQuantity = Math.max(0.001, Number(qty));
              } else if (action === "increase") {
                newQuantity += 1;
              } else if (action === "deacrese") {
                newQuantity = Math.max(0.001, item.quantity - 1);
              }

              return {
                ...item,
                quantity: newQuantity,
              };
            }
            return item;
          })
        );
        return;
      }

      // KG bazlı ürünler için (direct qty update)
      if (existProduct.unit === "kg") {
        // Eğer qty varsa güncelle, yoksa artırma/azaltma mantığına göre davranabiliriz
        setInputData((prevData) =>
          prevData.map((item) => {
            if (item.barcode === barcode) {
              let newQuantity = item.quantity;

              if (qty !== undefined && qty !== null) {
                newQuantity = Math.max(0.001, parseFloat(qty)); // minimum 1 gram
              } else if (action === "increase") {
                newQuantity += 0.1; // örnek olarak 100 gram artır
              } else if (action === "deacrese") {
                newQuantity = Math.max(0.001, item.quantity - 0.1);
              }

              return {
                ...item,
                quantity: newQuantity,
              };
            }
            return item;
          })
        );
        return;
      }
    }

    // Ürün yoksa ve artırma işlemi ise yeni ürün ekle
    if (action === "increase") {
      if (isFetching) return;
      try {
        const validProduct = await trigger(barcode).unwrap();
        if (!validProduct) return null;

        const existProduct = inputData.find(
          (x) => x.barcode == validProduct.productBarcode
        );

        if (existProduct) {
          // Ürün zaten listede varsa, miktarı artır
          setInputData((prevData) =>
            prevData.map((item) => {
              if (item.barcode === validProduct.productBarcode) {
                let newQuantity = item.quantity;

                if (validProduct.unit === "kg") {
                  // Tartım barkodundan gelen quantity varsa onu ekle
                  if (validProduct.quantity) {
                    newQuantity += validProduct.quantity;
                  } else {
                    newQuantity += 0.1;
                  }
                } else {
                  newQuantity += 1;
                }

                return {
                  ...item,
                  quantity: newQuantity,
                };
              }
              return item;
            })
          );
          return;
        } else
          setInputData((prevData) => [
            ...prevData,
            {
              quantity: validProduct.quantity ? validProduct.quantity : 1, // kg ürün için default 0.1 (100 gram)
              barcode: validProduct.barcode,
              productBarcode: validProduct?.productBarcode,
              unit: validProduct.unit,
            },
          ]);
      } catch (err) {
        toast.error(err.data.error);
        console.log(err);
      }
    }

    barcodeRef.current?.focus();
  };

  const handleDeleteProduct = (id) => {
    const newData = inputData.filter(
      (x) =>
        String(x.barcode) !== String(id) &&
        String(x.productBarcode) !== String(id)
    );
    setInputData(newData);
  };

  //   useEffect(() => {
  //     const handlePreview = async () => {
  //       if (inputData.length == 0) {
  //         setData([]);
  //         return;
  //       }

  //       const response = await postPreview({ items: inputData }).unwrap();
  //       setData(response); // response = { subtotal, total, items }
  //     };

  //     handlePreview();
  //   }, [inputData]);

  const handleChangeQtyAndFocus = (...args) => {
    handleChangeQty(...args);
    barcodeRef.current?.focus();
  };

  return (
    <div className="flex   overflow-hidden  gap-2 w-full  h-full bg-gray-50  rounded-2xl">
      <ProductSide
        data={data?.items}
        // products={products}
        handleChangeQty={handleChangeQtyAndFocus}
      />
      {paymentStage ? (
        <div className="flex-1 px-4">
          <PaymentSide handleBack={() => setPaymentStage(false)} />
        </div>
      ) : (
        <div className="flex-1  px-4 gap-4  flex flex-col bg-white rounded-2xl  justify-between py-4 h-full  ">
          <Table columns={columns} data={data} pagination={false} />
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-end">
              {/* <span className="text-2xl font-medium">{t("Total")}</span> */}
              <span className="text-3xl font-medium">
                {data?.total?.toFixed(2) || "0.00"} ₼
              </span>
            </div>
            <div className="flex items-center gap-2 w-full h-full">
              <button
                // disabled={data.length == 0 || postLoading}
                onClick={() => setPaymentStage(true)}
                className="flex justify-center cursor-pointer text-2xl gap-2 items-center border border-gray-200 px-6 h-16 rounded-lg w-full"
              >
                <Payment className={"size-8 "} />
                <span className=""> {t("Make Payment")}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
