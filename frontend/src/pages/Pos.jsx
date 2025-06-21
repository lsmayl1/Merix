import React, { useCallback, useEffect, useState } from "react";
import { Plus } from "../assets/Plus";
import { SearchIcon } from "../assets/SearchIcon";
import { Setting } from "../assets/Setting";
import { ChartPie } from "../assets/chart-pie";
import { Logout } from "../assets/Logout";
import { Minus } from "../assets/Minus";
import { createColumnHelper } from "@tanstack/react-table";
import { Table } from "../components/Table";
import TrashBin from "../assets/TrashBin";
import { Cash } from "../assets/Cash";
import { CreditCard } from "../assets/CreditCard";
import Payment from "../assets/Payment";
import {
  useGetProductsByQueryQuery,
  useGetProductsQuery,
  useLazyGetProductByIdQuery,
  usePostSaleMutation,
  usePostSalePreviewMutation,
} from "../redux/slices/ApiSlice";
import { Kart } from "../assets/Sidebar/Kart";
import { BarcodeField } from "../components/BarcodeField";
import { Xcircle } from "../assets/Xcircle";
import { ProductShortcuts } from "../components/Pos/ProductShortcuts";
import { NavLink } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { QtyInput } from "../components/QtyInput";
export const Pos = () => {
  // const { data: products } = useGetProductsQuery();
  const columnHelper = createColumnHelper();
  const [inputData, setInputData] = useState([]);
  const [data, setData] = useState([]);
  const [query, setQuery] = useState("");
  const [postPreview, { isLoading: previewLoading }] =
    usePostSalePreviewMutation();
  const { data: searchData } = useGetProductsByQueryQuery(query, {
    skip: !query || query.length < 3,
  });
  const [editingQuantities, setEditingQuantities] = useState({});
  const [trigger, { isLoading, isFetching }] = useLazyGetProductByIdQuery();
  const columns = [
    columnHelper.accessor("name", {
      header: "Name",
      headerClassName: "text-start rounded-s-lg bg-gray-100",
      cellClassName: "text-start",
    }),
    columnHelper.accessor("sellPrice", {
      header: "Price",
      headerClassName: "text-center  bg-gray-100",
      cellClassName: "text-center",
      cell: ({ row }) => <span>{row.original?.sellPrice?.toFixed(2)} ₼</span>,
    }),
    columnHelper.accessor("quantity", {
      header: "Quantity",
      cell: ({ row }) => (
        <QtyInput
          qty={row.original.quantity}
          barcode={row.original.barcode}
          handleQty={handleChangeQty}
          allign={"justify-center"}
        />
      ),
      headerClassName: "text-center  bg-gray-100",
      cellClassName: "text-center",
    }),
    columnHelper.accessor("subtotal", {
      header: "Subtotal",
      headerClassName: "text-center  bg-gray-100",
      cellClassName: "text-center",
      cell: ({ row }) => (
        <div>
          <span>{row.original?.subtotal?.toFixed(2)} ₼</span>
        </div>
      ),
    }),
    columnHelper.accessor("action", {
      header: "Action",
      headerClassName: "text-center rounded-e-lg bg-gray-100",
      cellClassName: "text-center",
      cell: ({ row }) => (
        <button onClick={() => handleDeleteProduct(row.original.barcode)}>
          <TrashBin className="size-6 text-red-500" />
        </button>
      ),
    }),
  ];
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [postSale, { isLoading: postLoading }] = usePostSaleMutation();

  const handleChangeQty = async (barcode, action, qty) => {
    const existProduct = inputData.find((x) => x.barcode == barcode);

    // Eğer ürün zaten ekliyse
    if (existProduct) {
      setInputData((prevData) =>
        prevData.map((item) => {
          if (item.barcode === barcode) {
            let newQuantity = item.quantity;

            if (qty) {
              newQuantity = Math.max(1, Number(qty));
            } else if (action === "increase") {
              newQuantity += 1;
            } else if (action === "deacrese") {
              newQuantity = Math.max(1, item.quantity - 1);
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

    // Eğer ürün ekli değilse ve "increase" ise yeni ürün ekle
    if (action === "increase") {
      if (isFetching) return;
      try {
        const validProduct = await trigger(barcode).unwrap();
        if (!validProduct) return null;
        setInputData((prevData) => [
          ...prevData,
          {
            quantity: 1,
            barcode: validProduct.barcode,
            unit: validProduct.unit,
          },
        ]);
      } catch (err) {
        toast.error(err.data.error);
        console.log(err);
      }
    }
  };

  const handleDeleteProduct = (id) => {
    console.log("cliced");
    const newData = inputData.filter((x) => String(x.barcode) !== String(id));
    setInputData(newData);
  };

  const handleSubmitSale = async () => {
    try {
      const sale = await postSale({
        payment_method: paymentMethod,
        products: data?.items,
      }).unwrap();

      setData([]);
      setInputData([]);
      console.log(sale);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const handlePreview = async () => {
      if (inputData.length == 0) {
        setData([]);
        return;
      }

      const response = await postPreview({ items: inputData }).unwrap();
      setData(response); // response = { subtotal, total, items }
    };

    handlePreview();
  }, [inputData]);

  return (
    <div className="flex flex-col  overflow-hidden h-screen  gap-2 w-full ">
      <ToastContainer />
      <BarcodeField handleBarcode={(id) => handleChangeQty(id, "increase")} />
      <div className="flex gap-4 items-center justify-between px-8 py-4">
        <div className="flex gap-2 items-center ">
          <button className="border border-mainBorder py-2 px-4 rounded-lg">
            {" "}
            Order 1
          </button>
          <button className="p-2  border border-mainBorder rounded-lg">
            <Plus />
          </button>
        </div>
        <div className="flex flex-col relative w-1/2">
          <div className="flex items-center  relative w-full">
            <input
              type="text"
              placeholder="Search for products"
              className="border border-mainBorder rounded-lg py-2 px-10 w-full"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setQuery(e.target.value);
                }
              }}
            />
            <SearchIcon className="absolute left-2" />
            <button onClick={() => setQuery("")} className="absolute right-2">
              <Xcircle />
            </button>
          </div>
          {searchData?.length > 0 && query && (
            <div className="absolute w-full h-[400px] z-50 top-12 bg-white rounded-lg border border-mainBorder">
              <ul className="overflow-auto h-full px-4 flex flex-col  ">
                {searchData?.map((item) => (
                  <li
                    key={item.product_id}
                    className="flex items-center justify-between hover:bg-gray-100 px-4 py-2"
                  >
                    <span className="w-1/2">{item.name}</span>
                    <span>{item.sellPrice.toFixed(2)} ₼</span>

                    <button
                      onClick={() => handleChangeQty(item.barcode, "increase")}
                      className=" p-1 mr-12 bg-white border border-mainBorder rounded-lg"
                    >
                      <Plus className="size-6" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <div className="flex items-center gap-6">
          <Setting className="size-8" />
          <ChartPie className="size-8" />
          <NavLink to={"/"}>
            <Logout className="size-8" />
          </NavLink>
        </div>
      </div>
      <div className="bg-[#F8F8F8] w-full flex h-full px-4  min-h-0">
        <ProductShortcuts
          data={data?.items}
          // products={products}
          handleChangeQty={handleChangeQty}
        />
        <div className="flex-1 min-h-0  bg-white p-4 gap-4 h-full flex flex-col justify-between ">
          <div className="flex flex-col min-h-0 gap-6 ">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <h1 className="text-xl font-semibold">Order Details</h1>
                {data?.items?.length > 0 && (
                  <div className="bg-blue-500 py-1 px-6 text-white rounded-full">
                    items {data?.items?.length}
                  </div>
                )}
              </div>
              <button onClick={() => setData([])} className="text-red-500">
                {" "}
                Clear All
              </button>
            </div>
            <div className="overflow-y-auto min-h-0 max-h-[400px] ">
              <Table columns={columns} data={data?.items} pagination={false} />
            </div>
          </div>
          <div className="flex flex-col h-fit justify-center gap-4">
            <div className="flex flex-col gap-2">
              <div className="flex flex-col gap-4 border-b border-dashed pb-4 border-gray-300">
                <div className="w-full flex items-center justify-between">
                  <span>Subtotal</span>
                  <span className="text-lg font-medium">
                    {data?.subtotal?.toFixed(2) || "0.00"} ₼
                  </span>
                </div>
                <div className="w-full flex items-center justify-between">
                  <span>Discount (10%)</span>
                  <span className="text-lg font-medium">0.00 ₼</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-medium">Total</span>
                <span className="text-2xl font-medium">
                  {data?.total?.toFixed(2) || "0.00"} ₼
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex gap-2 items-center">
                <button
                  onClick={() => setPaymentMethod("cash")}
                  className={`flex flex-col gap-1 items-center border  px-6 py-1 rounded-lg w-full ${
                    paymentMethod == "cash"
                      ? "border-blue-500 bg-blue-50"
                      : " border-mainBorder"
                  }`}
                >
                  <Cash
                    className={`${
                      paymentMethod == "cash" ? "text-blue-500" : "text-black"
                    }`}
                  />
                  <span
                    className={`${
                      paymentMethod == "cash" ? "text-blue-500" : "text-black"
                    }`}
                  >
                    Cash
                  </span>
                </button>
                <button
                  onClick={() => setPaymentMethod("card")}
                  className={`flex flex-col gap-1 items-center border ${
                    paymentMethod == "card"
                      ? "border-blue-500 bg-blue-50"
                      : " border-mainBorder"
                  }  px-6 py-1 rounded-lg w-full`}
                >
                  <CreditCard
                    className={`${
                      paymentMethod == "card" ? "text-blue-500" : "text-black"
                    }`}
                  />
                  <span
                    className={`${
                      paymentMethod == "card" ? "text-blue-500" : "text-black"
                    }`}
                  >
                    Card
                  </span>
                </button>
              </div>
              <button
                disabled={data.length == 0}
                onClick={handleSubmitSale}
                className="flex justify-center gap-1 items-center border border-mainBorder px-6 py-5 rounded-lg w-full"
              >
                <Payment />
                <span>Make Payment</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
