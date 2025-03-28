import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo,
} from "react";
import debounce from "lodash/debounce";
import axios from "axios";
import { SearchIcon } from "../../assets/SearchIcon";
import Fuse from "fuse.js";
import { AddProduct } from "./AddProduct";
import { ToastContainer, toast } from "react-toastify";
import { useApi } from "../Context/useApiContext";

export const Products = () => {
  const {
    data,
    isSuccess,
    isLoading,
    refetch,
    form,
    setForm,
    PutSuccess,
    NewProduct,
    FetchById,
    queryClient,
  } = useApi();

  const [barcode, setBarcode] = useState("");
  const [showNewProduct, setShowNewProduct] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState();
  const [filteredProducts, setFilteredProduct] = useState([]);
  const [query, setQuery] = useState("");
  const barkodInput = useRef(null);

  const fuse = useMemo(() => {
    if (!isSuccess || !data) return null; // Return null until data is ready
    return new Fuse(data, {
      keys: ["name", "barcode"], // Adjust based on your data structure
      threshold: 0.5,
      minMatchCharLength: 2,
      includeScore: true,
      shouldSort: true,
    });
  }, [data, isSuccess]);

  useMemo(() => {
    if (isSuccess && data) {
      setFilteredProduct(data); // Initialize with full dataset
    }
  }, [data, isSuccess]);

  const handleInputChange = useCallback(
    (e) => {
      const value = e.target.value;
      setQuery(value);

      if (!fuse || !isSuccess) return; // Skip if fuse or data isn't ready

      const debouncedSearch = debounce((searchQuery) => {
        if (!searchQuery || searchQuery.length < 2) {
          setFilteredProduct(data); // Reset to full dataset
          return;
        }

        const results = fuse.search(searchQuery, { limit: 50 });
        setFilteredProduct(results.map((result) => result.item));
      }, 300);

      debouncedSearch(value);

      return () => debouncedSearch.cancel();
    },
    [fuse, data, isSuccess, setFilteredProduct, setQuery]
  );
  const selectProduct = (id) => {
    if (selectedProduct === id) {
      setSelectedProduct(null);
    } else {
      setSelectedProduct(id);
    }
  };

  const handleCloseNewProducts = () => {
    setQuery("");
    setForm((prev) => ({ ...prev, barcode: "" }));
    setBarcode("");
    refetch();

    setShowNewProduct(false);
    setForm({
      name: "",
      category: "mehsul",
      barcode: "",
      buyPrice: 0.0,
      sellPrice: 0.0,
      unit: "piece",
    });
    if (barkodInput.current) {
      barkodInput.current.focus();
    }
  };

  const handleBarcodeChange = useCallback(
    async (e) => {
      const value = e.target.value.trim(); // Boşlukları temizle
      setBarcode(value);

      if (e.key === "Enter" && value) {
        try {
          const product = await FetchById(value);
          setForm(product);
          setShowNewProduct(true);
          toast.success(`${product.name} bulundu!`);
        } catch (error) {
          // Error handling
          setForm((prev) => ({
            ...prev,
            barcode: value,
            // Diğer alanları resetle
            name: "",
            category: "mehsul",
            buyPrice: 0.0,
          }));

          setShowNewProduct(true);
        }
      }
    },
    [FetchById] // Bağımlılıkları minimize et
  );

  const handleAddProduct = async () => {
    try {
      await NewProduct(form);
      handleCloseNewProducts();
    } catch (error) {
      toast.error(JSON.stringify(error.response.data.message));
      console.log(error);
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/products/${id}`);
      setForm({
        ...form,
        name: "",
        barcode: "",
        buyPrice: 0.0,
        sellPrice: 0.0,
      });
      toast.success("Mehsul Silindi", {
        autoClose: 1000,
        onClose: () => {
          refetch();
          setShowNewProduct(false);
        },
      });
    } catch (err) {
      toast.error("Xeta bas verdi");
      console.log(err);
    }
  };
  const handleProductById = (product) => {
    setForm(product);
    setShowNewProduct(true);
  };

  useEffect(() => {
    if (barkodInput.current) {
      barkodInput.current.focus();
    }
    const handleClick = (event) => {
      // Eğer tıklanan element bir input veya buton değilse, barkod inputuna odaklan
      if (!event.target.matches("input, button")) {
        if (barkodInput.current) {
          barkodInput.current.focus();
        }
      }
    };

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [showNewProduct]);

  return (
    <div
      className={`flex  flex-col w-full items-center px-4 gap-4 overflow-auto`}
    >
      <ToastContainer />
      {showNewProduct && (
        <AddProduct
          handleClose={handleCloseNewProducts}
          form={form}
          setForm={setForm}
          handleAddProduct={handleAddProduct}
          handleDelete={handleDeleteProduct}
        />
      )}
      <input
        type="text"
        ref={barkodInput}
        onChange={handleBarcodeChange}
        onKeyPress={handleBarcodeChange}
        value={barcode}
        style={{
          position: "absolute",
          opacity: 0,
          width: 0,
          height: 0,
          padding: 0,
          border: 0,
          margin: 0,
        }}
      />
      <div className="relative   w-full gap-16 flex items-center ">
        <div className="relative flex-1 flex items-center h-20">
          <input
            type="text"
            placeholder="Məhsul axtar..."
            value={query}
            onChange={handleInputChange}
            className="w-full border h-10 text-2xl px-12 border-[#ADA3A3] rounded-lg focus:outline-none"
          />
          <SearchIcon className={"absolute ml-2"} />
          <div
            onClick={() => {
              setQuery("");
              barkodInput.current.focus();
            }}
            className="absolute w-10 right-0 items-center justify-center flex px-1 py-3 cursor-pointer rounded-full "
          >
            <button className="size-10 cursor-pointer">X</button>
          </div>
        </div>
        <div className="flex gap-4">
          <div
            onClick={() => refetch()}
            className="py-2 px-4 border rounded  hover:bg-gray-300 cursor-pointer"
          >
            Yenile
          </div>
          <div className="py-2 px-4 border rounded">Etiket Cap</div>

          <div
            onClick={() => setShowNewProduct(true)}
            className="py-2 px-4 border rounded  hover:bg-gray-300 cursor-pointer"
          >
            Məhsul Əlavə Et
          </div>
        </div>
      </div>
      <div className=" w-full rounded-lg border-[#ADA3A3] p-4   bg-white  ">
        <table style={{ tableLayout: "auto" }} className="w-full overflow-auto">
          <thead>
            <tr className=" text-center border-[#ADA3A3] border h-10">
              <td style={{ width: "2%" }}></td>
              <td className="border border-[#ADA3A3]" style={{ width: "2%" }}>
                ID
              </td>
              <td className="border border-[#ADA3A3]" style={{ width: "15%" }}>
                MƏHSUL
              </td>
              <td className="border border-[#ADA3A3]" style={{ width: "2%" }}>
                BARKOD
              </td>
              <td className="border border-[#ADA3A3]" style={{ width: "2%" }}>
                VAHİD
              </td>
              <td className="border border-[#ADA3A3]" style={{ width: "5%" }}>
                ALIŞ QİYMƏTİ
              </td>
              <td className="border border-[#ADA3A3]" style={{ width: "5%" }}>
                SATIŞ QİYMƏTİ
              </td>
            </tr>
          </thead>
          <tbody className="">
            {isLoading && (
              <tr>
                <td
                  colSpan={7}
                  className="text-3xl border=bordercolor text-center py-14"
                >
                  Yuklenir{" "}
                </td>
              </tr>
            )}
            {filteredProducts?.map((product) => (
              <tr
                key={product.product_id}
                className="  border-b border-[#ADA3A3]"
              >
                <td className="border-[#ADA3A3] border">
                  <div className="flex w-full items-center justify-center">
                    <div
                      onClick={() => selectProduct(product.product_id)}
                      className={`border size-4 rounded border-[#ADA3A3] ${
                        selectedProduct === product?.product_id
                          ? "bg-blue-600"
                          : ""
                      } `}
                    ></div>
                  </div>
                </td>
                <td className="border text-center border-[#ADA3A3]">
                  {product.product_id}
                </td>
                <td
                  onDoubleClick={() => handleProductById(product)}
                  className="px-4 border border-[#ADA3A3] cursor-pointer"
                >
                  {product.name}
                </td>
                <td className="border-[#ADA3A3] border px-4">
                  {product.barcode}
                </td>
                <td className="border-[#ADA3A3] border px-4 text-center">
                  {product.unit === "piece" ? "əd" : "kg"}
                </td>
                <td className="text-center border-[#ADA3A3] border ">
                  {product.buyPrice?.toFixed(2) + "  ₼"}
                </td>
                <td className="text-center border-[#ADA3A3] border ">
                  {product.sellPrice?.toFixed(2) + "  ₼"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
