import React, { useEffect, useState } from "react";
import { Table } from "../components/Table";
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

export const Products = () => {
  const header = [
    { key: "product_id", name: "ID" },
    { key: "name", name: "Product" },
    { key: "barcode", name: "Barcode" },
    {
      key: "unit",
      name: "Unit",
      render: (value) => <span>{value === "piece" ? "eded" : value} </span>,
    },
    {
      key: "buyPrice",
      name: "Buy Price",
      // render: (value) => (
      //   <div className="flex items-center justify-center w-1/2 gap-2">
      //     <span>{value} </span>₼
      //   </div>
      // ),
    },
    {
      key: "sellPrice",
      name: "Sell Price",
      // render: (value) => (
      //   <div className="flex items-center justify-center w-1/2 gap-2">
      //     <span>{value} </span>₼
      //   </div>
      // ),
    },
    {
      key: "stock",
      name: "Stok",
      render: (value) => (
        <div className="flex items-center justify-center w-1/2 gap-2">
          <span>{value} </span>
        </div>
      ),
    },
    {
      key: "action",
      name: "Edit / Delete",
      render: (value, row) => (
        <div className="flex  justify-end w-1/2 gap-2 ">
          <button
            className="cursor-pointer"
            onClick={() => handleEditProduct(row.product_id)}
          >
            <Edit />
          </button>
          <button
            className="cursor-pointer"
            onClick={() => handleDeleteProduct(row.product_id)}
          >
            <TrashBin className={"size-5"} />
          </button>
        </div>
      ),
    },
  ];

  const [page, setPage] = useState(1);
  const {
    data,
    isLoading,
    refetch: ProductsRefetch,
  } = useGetProductsQuery(page);
  const [showProductModal, setShowProductModal] = useState(false);
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
      <div className="flex flex-col gap-2 w-full h-full min-h-0  bg-white rounded-lg p-4 relative">
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
              onClick={() => setShowProductModal(true)}
              className="border bg-white border-gray-200 rounded-xl text-nowrap px-4 cursor-pointer flex items-center gap-2 py-1"
            >
              <Filters />
              Filters
            </button>
            <FiltersModal />
          </div>
          <button
            onClick={() => setShowProductModal(true)}
            className="border bg-white border-gray-200 rounded-xl text-nowrap px-4 cursor-pointer flex items-center gap-2 py-1"
          >
            <Plus />
            Add Product
          </button>
        </div>

        <div className="min-h-0  overflow-hidden">
          <Table
            curentPage={page}
            totalPage={data?.totalPage || 50}
            header={header}
            data={filteredProducts}
            loading={isLoading || SearchLoading}
            handlePage={handlePage}
            style={{
              body: "text-black text-[14px] font-medium",
              header: "text-black text-[16px] font-semibold",
            }}
          />{" "}
        </div>
      </div>
    </div>
  );
};
