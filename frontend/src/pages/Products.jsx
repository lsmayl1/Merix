import React, { useEffect, useState } from "react";
import {
  useDeleteProductByIdMutation,
  useGetProductByIdQuery,
  useGetProductsByQueryQuery,
  useGetProductsQuery,
} from "../redux/slices/ApiSlice";
import Edit from "../assets/Edit";
import { RecycleBin } from "../assets/recycleBin";
import TrashBin from "../assets/TrashBin";
import { ProductModal } from "../components/Products/ProductModal";
import { BarcodeField } from "../components/BarcodeField";
import { KPI } from "../components/Metric/KPI";
import { SearchIcon } from "../assets/SearchIcon";
import { Filters } from "../assets/Filters";
import { Plus } from "../assets/Plus";
import { FiltersModal } from "../components/Filters/FiltersModal";
import { Table } from "../components/Table";
import { createColumnHelper } from "@tanstack/react-table";

export const Products = () => {
  const columnHelper = createColumnHelper();
  const columns = [
    columnHelper.accessor("product_id", {
      header: "ID",
      headerClassName: "text-center rounded-s-lg bg-gray-100",
      cellClassName: "text-center",
    }),
    columnHelper.accessor("name", {
      header: "Product",
      headerClassName: "text-start bg-gray-100",
      cellClassName: "text-start",
    }),
    columnHelper.accessor("barcode", {
      header: "Barcode",
      headerClassName: "text-start bg-gray-100",
      cellClassName: "text-start",
    }),
    columnHelper.accessor("unit", {
      header: "Unit",
      cell: (info) => (
        <span>{info.getValue() === "piece" ? "eded" : info.getValue()}</span>
      ),
      headerClassName: "text-center bg-gray-100",
      cellClassName: "text-center",
    }),
    columnHelper.accessor("buyPrice", {
      header: "Buy Price",
      cell: (info) => (
        <div className="flex items-center justify-center gap-2">
          <span>{info.getValue().toFixed(2)}</span>₼
        </div>
      ),
      headerClassName: "text-center bg-gray-100",
      cellClassName: "text-center",
    }),
    columnHelper.accessor("sellPrice", {
      header: "Sell Price",
      cell: (info) => (
        <div className="flex items-center justify-center gap-2">
          <span>{info.getValue().toFixed(2)}</span>₼
        </div>
      ),
      headerClassName: "text-center bg-gray-100",
      cellClassName: "text-center",
    }),
    columnHelper.accessor("stock", {
      header: "Stok",
      cell: (info) => (
        <div className="flex items-center justify-center gap-2">
          <span>{info.getValue()}</span>
        </div>
      ),
      headerClassName: "text-center bg-gray-100",
      cellClassName: "text-center",
    }),
    columnHelper.accessor("action", {
      header: "Edit / Delete",
      headerClassName: "text-center rounded-e-lg bg-gray-100",
      cellClassName: "text-center",
      cell: ({ row }) => (
        <div className="flex justify-center  gap-2">
          <button
            className="cursor-pointer"
            onClick={() => handleEditProduct(row.original.product_id)}
          >
            <Edit />
          </button>
          <button
            className="cursor-pointer"
            onClick={() => handleDeleteProduct(row.original.product_id)}
          >
            <TrashBin className="size-5" />
          </button>
        </div>
      ),
      enableSorting: false, // Action sütunu için sıralamayı devre dışı bırak
      enableColumnFilter: false, // Action sütunu için filtrelemeyi devre dışı bırak
    }),
  ];
  const [page, setPage] = useState(1);
  const {
    data,
    isLoading,
    refetch: ProductsRefetch,
  } = useGetProductsQuery(page);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showFiltersModal, setShowFiltersModal] = useState(false);
  const [query, setQuery] = useState("");
  const [editId, setEditId] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [editForm, setEditForm] = useState(null);
  const { data: searchedProducts, isLoading: SearchLoading } =
    useGetProductsByQueryQuery(query, {
      skip: !query || query.length < 3,
    });
  const [filteredProducts, setFilteredProducts] = useState([]);
  const { data: editedProduct, refetch } = useGetProductByIdQuery(editId, {
    skip: !editId,
  });
  const [deleteProduct] = useDeleteProductByIdMutation();
  const handlePage = () => {
    setPage((prev) => (prev += 1));
  };

  const handleClosePopUp = () => {
    setEditForm(null);
    setEditId(null);
    setShowProductModal(false);
  };
  useEffect(() => {
    if (query && query.length > 2) {
      setFilteredProducts(searchedProducts);
    } else if (data && !isLoading) {
      setFilteredProducts((prev) => [...prev, ...data]);
    }
  }, [query, searchedProducts, data, isLoading]);

  useEffect(() => {
    if (editedProduct) {
      setEditForm(editedProduct);
    }
  }, [editedProduct]);

  const handleInputKeyDown = (e) => {
    if (e.key === "Enter") {
      setQuery(inputValue);
    }
  };
  const handleEditProduct = async (id) => {
    try {
      if (editId === id) {
        // Aynı ID için refetch yap
        await refetch(); // Asenkron işlemi bekle
        setShowProductModal(true);
      } else {
        // Yeni ID için edit modunu başlat
        setEditId(id);
        setShowProductModal(true);
      }
    } catch (error) {
      console.error("Refetch hatası:", error);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm("Silinsin ?")) {
      try {
        await deleteProduct(id).unwrap();
        await ProductsRefetch();
        setFilteredProducts(data);
        setShowProductModal(false);
      } catch (error) {
        console.log(error);
      }
    } else {
      return;
    }
  };

  const handleBarcode = async (barcode) => {
    setEditId(barcode);
    setShowProductModal(true);
  };

  return (
    <div className="w-full h-full flex flex-col gap-2 min-h-0 ">
      <BarcodeField
        handleBarcode={handleBarcode}
        shouldFocus={!showProductModal}
      />{" "}
      <KPI
        data={[
          {
            label: "Total Revenue",
            value: "₼ 12,345",
          },
          {
            label: "Total Profit",
            value: "₼ 2,345",
          },
          {
            label: "Total Sales",
            value: "5,456",
          },
          {
            label: "Total Stock Cost",
            value: "₼ 10,000",
          },
        ]}
      />
      <div className="flex flex-col gap-2 w-full h-full min-h-0  bg-white rounded-lg px-4 py-2 relative">
        {showProductModal && (
          <ProductModal
            handleClose={handleClosePopUp}
            editForm={editForm}
            isEditMode={editId ? true : false}
            handleDelete={handleDeleteProduct}
          />
        )}
        <div className="flex gap-2 items-center">
          <div className="flex items-center gap-2 w-full relative">
            <input
              type="text"
              placeholder="Search by name or barcode"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleInputKeyDown}
              className="px-12 w-full  py-2 rounded-lg bg-white focus:outline-blue-500 "
            />
            <SearchIcon className="absolute left-2" />
          </div>
          <div className="flex  relative ">
            <button
              onClick={() => setShowFiltersModal(!showFiltersModal)}
              className="border bg-white border-gray-200 rounded-xl text-nowrap px-4 cursor-pointer flex items-center gap-2 py-1"
            >
              <Filters />
              Filters
            </button>
            {showFiltersModal && (
              <FiltersModal handleClose={setShowFiltersModal} />
            )}
          </div>
          <button
            onClick={() => setShowProductModal(true)}
            className="border bg-white border-gray-200 rounded-xl text-nowrap px-4 cursor-pointer flex items-center gap-2 py-1"
          >
            <Plus />
            Add Product
          </button>
        </div>

        <div className="min-h-0 w-full px-2">
          <Table
            columns={columns}
            data={filteredProducts}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
};
