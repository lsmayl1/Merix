import React, { useEffect, useState } from "react";
import {
  useDeleteProductByIdMutation,
  useGetProductByIdQuery,
  useGetProductsByQueryQuery,
  useGetProductsMetricsQuery,
  useGetProductsQuery,
  useLazyGetProductByIdQuery,
  usePostProductMutation,
  usePutProductByIdMutation,
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
import { useSearchParams } from "react-router-dom";

export const Products = () => {
  const { data: metricData } = useGetProductsMetricsQuery();
  const columnHelper = createColumnHelper();
  const columns = [
    columnHelper.accessor("product_id", {
      header: "ID",
      headerClassName: "text-center",
      cellClassName: "text-center",
    }),
    columnHelper.accessor("name", {
      header: "Product",
      headerClassName: "text-start",
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
  const [searchParams] = useSearchParams();
  const sort = searchParams.get("name");
  const {
    data,
    isLoading,
    refetch: ProductsRefetch,
  } = useGetProductsQuery({ page, sort });
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
  const [trigger] = useLazyGetProductByIdQuery();
  const [deleteProduct] = useDeleteProductByIdMutation();
  const handlePage = () => {
    setPage((prev) => (prev += 1));
  };
  const [putProduct] = usePutProductByIdMutation();
  const [postProduct, { isLoading: postLoading, isError: postError }] =
    usePostProductMutation();

  const handleClosePopUp = () => {
    setEditForm(null);
    setEditId(null);
    setShowProductModal(false);
  };
  useEffect(() => {
    if (query && query.length > 2) {
      setFilteredProducts(searchedProducts);
    } else if (data && !isLoading) {
      setFilteredProducts(data);
    }
  }, [query, searchedProducts, data, isLoading, sort]);

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
    try {
      const res = await trigger(barcode).unwrap();
      console.log(res);
      setEditId(barcode);
      setEditForm(res);
      setShowProductModal(true);
    } catch (error) {
      setEditForm({ barcode: barcode });
      setShowProductModal(true);
    }
  };

  const handleUpdateProduct = async (data) => {
    try {
      await putProduct(data).unwrap();
      setShowProductModal(false);
      setEditId(null);
      setEditForm(null);
      ProductsRefetch();
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddProduct = async (data) => {
    try {
      await postProduct(data).unwrap();
      setShowProductModal(false);
      ProductsRefetch();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-full h-full flex flex-col gap-2 min-h-0 ">
      <div className="max-md:hidden">
        <BarcodeField
          handleBarcode={handleBarcode}
          shouldFocus={!showProductModal}
        />{" "}
      </div>
      <KPI
        data={[
          {
            label: "Total Products",
            value: metricData?.totalProducts,
          },
          {
            label: "Weight-Based Products",
            value: metricData?.kgBasedProducts,
          },
          {
            label: "Unit-Based Productss",
            value: metricData?.pieceBasedProducts,
          },
          {
            label: "Out of Stock Products",
            value: metricData?.zeroOrNegativeStock,
          },
        ]}
      />
      <div className="flex flex-col gap-2 w-full h-full min-h-0  bg-white rounded-lg px-2 py-2 relative">
        {showProductModal && (
          <ProductModal
            handleClose={handleClosePopUp}
            editForm={editForm}
            isEditMode={editId ? true : false}
            handleDelete={handleDeleteProduct}
            handleUpdateProduct={handleUpdateProduct}
            handleAddProduct={handleAddProduct}
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
              className="px-12 w-full max-md:px-8  py-2 rounded-lg bg-white focus:outline-blue-500 "
            />
            <SearchIcon className="absolute left-2 max-md:size-5" />
          </div>
          <div className="flex  relative ">
            <button
              onClick={() => setShowFiltersModal(!showFiltersModal)}
              className="border bg-white border-gray-200 rounded-xl text-nowrap px-4 max-md:px-2 cursor-pointer flex max-md:text-xs items-center gap-2 py-1 max-md:py-0"
            >
              <Filters className="max-md:size-5" />
              Filters
            </button>
            {showFiltersModal && (
              <FiltersModal
                handleClose={setShowFiltersModal}
                // handleFilter={handleFilter}
              />
            )}
          </div>
          <button
            onClick={() => setShowProductModal(true)}
            className="border bg-white border-gray-200 rounded-xl text-nowrap px-4 cursor-pointer max-md:px-2 max-md:text-xs flex items-center gap-2 py-1 max-md:py-0"
          >
            <Plus className="max-md:size-5" />
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
