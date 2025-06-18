import React, { useEffect, useState } from "react";
import { Minus } from "../../assets/Minus";
import { Plus } from "../../assets/Plus";
import {
  useGetBulkProductMutation,
  useGetProductsByQueryQuery,
} from "../../redux/slices/ApiSlice";
import { SearchIcon } from "../../assets/SearchIcon";
import { Xcircle } from "../../assets/Xcircle";
import { Table } from "../Table";
import { createColumnHelper } from "@tanstack/react-table";
import TrashBin from "../../assets/TrashBin";

export const ProductShortcuts = ({
  products = [],
  data = [],
  handleChangeQunatity,
}) => {
  const columnHelper = createColumnHelper();
  const [showAddModal, setShowAddModal] = useState(false);
  const [openContext, setOpenContext] = useState(null);
  const colums = [
    columnHelper.accessor("name", {
      header: "Name",
      headerClassName: "text-start rounded-s-lg bg-gray-100",
      cellClassName: "text-start",
    }),
    columnHelper.accessor("sellPrice", {
      header: "Price",
      headerClassName: "text-center  bg-gray-100",
      cellClassName: "text-center",
    }),
    columnHelper.accessor("action", {
      header: "Add",
      headerClassName: "text-center rounded-e-lg bg-gray-100",
      cellClassName: "text-center",
      cell: ({ row }) => (
        <button
          onClick={() => handleIdentifiers(row.original.barcode)}
          className=" p-1  bg-white border border-mainBorder rounded-lg"
        >
          <Plus className="size-6" />
        </button>
      ),
    }),
  ];
  const [getShortCuts, { isLoading }] = useGetBulkProductMutation();
  const [query, setQuery] = useState("");
  const { data: searchData } = useGetProductsByQueryQuery(query, {
    skip: !query || query.length < 3,
  });
  const [identifiers, setIdentifiers] = useState(() => {
    try {
      const raw = localStorage.getItem("identifiers");
      const data = raw && raw !== "undefined" ? JSON.parse(raw) : null;
      return data;
    } catch (err) {
      console.error("Invalid JSON in localStorage:", err);
      return [];
    }
  });
  const [shortCuts, setShortCuts] = useState([]);

  useEffect(() => {
    const handleData = async () => {
      if (identifiers && identifiers.length > 0) {
        try {
          const shortcuts = await getShortCuts({
            identifiers: identifiers,
          }).unwrap();
          setShortCuts(shortcuts);
          console.log(shortcuts);
        } catch (error) {
          console.log(error);
        }
      }
    };
    handleData();
  }, []);

  const deleteIdentifiers = async (id) => {
    const updatedIds = identifiers.filter((x) => x != id);
    setIdentifiers(updatedIds);
    localStorage.setItem("identifiers", JSON.stringify(updatedIds || []));
    try {
      const data = await getShortCuts({ identifiers: updatedIds }).unwrap();
      setShortCuts(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleIdentifiers = async (id) => {
    const updatedIds = [...new Set([...(identifiers || []), id])]; // tekrarları önler
    setIdentifiers(updatedIds);
    localStorage.setItem("identifiers", JSON.stringify(updatedIds || []));

    try {
      const data = await getShortCuts({ identifiers: updatedIds }).unwrap();
      setShortCuts(data);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="flex-1 min-h-0 overflow-auto relative">
      {showAddModal && (
        <div className="w-full h-full absolute z-50  flex items-center justify-center ">
          <div className="bg-white flex flex-col ounded-lg p-5 gap-2 w-9/12 h-2/3 min-h-0 shadow-2xl border border-mainBorder rounded-lg">
            <h1 className="text-xl font-semibold ">Add Product</h1>
            <div className="flex items-center  relative w-full">
              <input
                type="text"
                placeholder="Search for products"
                className="border border-mainBorder rounded-lg py-2 px-10 w-full"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if ((e.key = "Enter")) {
                    setQuery(e.target.value);
                  }
                }}
              />
              <SearchIcon className="absolute left-2" />
              <button
                onClick={() => {
                  setQuery("");
                  setShowAddModal(false);
                }}
                className="absolute right-2"
              >
                <Xcircle />
              </button>
            </div>
            <div className="overflow-auto ">
              <Table
                columns={colums}
                data={searchData || shortCuts}
                pagination={false}
              />
            </div>
          </div>
        </div>
      )}

      <ul className="grid grid-cols-3 gap-2 p-4 overflow-auto min-h-0">
        {shortCuts?.map((item, index) => (
          <li
            key={index}
            onContextMenu={(e) => {
              e.preventDefault();
              if (openContext == item.barcode) {
                setOpenContext(null);
              } else {
                setOpenContext(item.barcode);
              }
            }}
            className={`flex flex-col relative px-4 py-2 justify-between  rounded-lg  border border-mainBorder ${
              data?.find((x) => x.barcode == item.barcode)
                ? "bg-blue-600 text-white"
                : "bg-white"
            }`}
          >
            <span className="text-lg font-medium">{item.name}</span>
            <span className="text-md ">{item.sellPrice?.toFixed(2)} ₼</span>
            <div className="flex items-center gap-2 justify-end">
              <button
                onClick={() => handleChangeQunatity(item.barcode, "decrase")}
                className="bg-white border border-mainBorder rounded-lg p-1"
              >
                <Minus className="size-4 text-black" />
              </button>
              <span className={"text-xl w-6 max-w-6 text-center"}>
                {data?.find((x) => x.barcode == item.barcode)?.quantity || 0}
              </span>
              <button
                onClick={() => handleChangeQunatity(item.barcode, "increase")}
                className="bg-white border border-mainBorder rounded-lg p-1"
              >
                <Plus className="size-4 text-black" />
              </button>
            </div>
            {openContext === item.barcode && (
              <button
                onClick={() => deleteIdentifiers(item.barcode)}
                className="absolute w-full  h-full flex items-center justify-center right-0 top-0 rounded-lg bg-blur-xs bg-white gap-2"
              >
                <TrashBin className="size-8" />
                <span className="text-xl text-black">Delete</span>
              </button>
            )}
          </li>
        ))}
        <li className=" px-6 py-8 border-dashed flex items-center justify-center  rounded-lg  border border-mainBorder bg-white">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 "
          >
            <Plus />
            Add Product
          </button>
        </li>
      </ul>
    </div>
  );
};
