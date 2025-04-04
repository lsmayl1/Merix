import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo,
} from "react";
import debounce from "lodash/debounce";
import { SearchIcon } from "../assets/SearchIcon";
import Fuse from "fuse.js";
import { AddProduct } from "../components/Products/AddProduct";
import { ToastContainer, toast } from "react-toastify";
import { useApi } from "../components/Context/useApiContext";
import { LabelPrint } from "../components/LabelPrinting/LabelPrint";
import { FilterIcon } from "../assets/filterIcon";
import { API } from "../components/Context/ApiContex";
import axios from "axios";
export const Products = () => {
  const {
    form,
    setForm,
    PutSuccess,
    NewProduct,
    FetchById,
    PostError,
    PostSuccess,
  } = useApi();

  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [barcode, setBarcode] = useState("");
  const [showNewProduct, setShowNewProduct] = useState(false);
  const [showLabelPrinter, setshowLabelPrinter] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState(null);
  const filterRef = useRef(null);
  const searchInput = useRef(null);
  const [selectedProduct, setSelectedProduct] = useState();
  const [filteredProducts, setFilteredProduct] = useState([]);
  const [query, setQuery] = useState("");
  const barkodInput = useRef(null);

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

  useEffect(() => {
    const handleClickOutside = (event) => {
      // 1. Div görünür değilse işlem yapma
      if (!showFilters) return;

      // 2. Tıklanan eleman div'in içinde mi kontrol et
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setShowFilters(false); // Dışarı tıklandı, div'i kapat
      }
    };

    // Event listener'ı ekle
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup: Component kaldırıldığında listener'ı temizle
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showFilters]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey && event.key === "e") {
        event.preventDefault(); // Tarayıcı varsayılanını engelle
        searchInput.current?.focus(); // Inputa odaklan
      } else if (event.key === "F1") {
        event.preventDefault();
      } else if (event.altKey && event.key === "x") {
        event.preventDefault();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const FetchData = async () => {
    try {
      const res = await axios.get(`${API}/products?page=${page}&limit=50`);
      if (page === 1) {
        // İlk sayfa yüklendiğinde sadece yeni verileri ayarla
        setData(res.data);
        setFilteredProduct(res.data);
      } else {
        // Sonraki sayfalarda mevcut verilere ekle
        setData((prevData) => [...prevData, ...res.data]);
        setFilteredProduct((prevFiltered) => [...prevFiltered, ...res.data]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    FetchData();
  }, [page]);

  const getProductsByQuery = async (search) => {
    try {
      const res = await axios.get(`${API}/products/search?query=${search}`);
      setFilteredProduct(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  const handleInputChange = (e) => {
    const value = e.target.value; // Trim işlemini burada yapmayın, çünkü kullanıcı yazarken boşluk bırakabilir
    setQuery(value); // Kullanıcının yazdığı değeri state'e kaydedin
  };

  const handleKeyDown = (e) => {
    if (query.trim() === "" && e.key === "Enter") {
      setFilteredProduct(data);
      barkodInput.current.focus();
      return;
    } else if (e.key === "Enter" && query.trim()) {
      getProductsByQuery(query.trim());
    }
  };

  useEffect(() => {
    if (data) {
      setFilteredProduct(data);
    }
  }, [data]);

  const filterData = useCallback(() => {
    let newData;
    let weight;
    switch (selectedFilter) {
      case "name":
        newData = [...data].sort((a, b) => a.name.trim().localeCompare(b.name));
        break;
      case "kg":
      case "piece":
        weight = data.filter((item) => item.unit === selectedFilter);
        newData = [...weight].sort((a, b) =>
          a.name.trim().localeCompare(b.name)
        );
        break;
      case "id":
        newData = [...data].sort((a, b) => b.product_id - a.product_id);
        break;
      case "stock":
        newData = [...data].sort((a, b) => b.stock - a.stock);
        break;
      default:
        newData = data;
    }

    setFilteredProduct(newData);
  }, [selectedFilter, data]);

  const selectProduct = (product) => {
    if (selectedProduct?.product_id === product.product_id) {
      setSelectedProduct(null);
    } else {
      setSelectedProduct(product);
    }
  };

  const handleCloseNewProducts = async () => {
    setBarcode("");
    setForm({
      name: "",
      category: "mehsul",
      barcode: "",
      buyPrice: 0.0,
      sellPrice: 0.0,
      unit: "piece",
    });
    setShowNewProduct(false);
  };

  const handleBarcodeChange = useCallback(async (e) => {
    const value = e.target.value.trim(); // Boşlukları temizle
    setBarcode(value);
    if (
      typeof value === "string" &&
      value.length > 0 &&
      [...value].every((char) => char >= "0" && char <= "9")
    ) {
      if (e.key === "Enter" && value) {
        try {
          const product = await FetchById(value);
          setForm(product);
          setShowNewProduct(true);
        } catch (error) {
          console.log(error);
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
    } else {
      setBarcode("");
      return;
    }
  }, []);

  const handleProductById = (product) => {
    setForm(product);
    setShowNewProduct(true);
  };
  const handleShowLabelPrinter = () => {
    if (selectedProduct) {
      setshowLabelPrinter(true);
    } else {
      toast.error("Secilen Mal yoxdur");
    }
  };
  const handleCloseLabelPrinting = () => {
    setshowLabelPrinter(false);
  };

  const handleFilterSelection = (option) => {
    if (selectedFilter === option) {
      setSelectedFilter(null);
    } else {
      setSelectedFilter(option);
    }
  };

  const handleAddProduct = async () => {
    try {
      await NewProduct(form);
    } catch (error) {
      toast.error("Server Xetasi");
      console.log(error);
    }
  };

  return (
    <div
      className={`flex   flex-col w-full items-center px-4 gap-4  relative h-screen`}
    >
      <ToastContainer />
      {showNewProduct && (
        <AddProduct
          handleClose={handleCloseNewProducts}
          handleAddProduct={handleAddProduct}
        />
      )}
      {showLabelPrinter && (
        <LabelPrint
          product={selectedProduct}
          handleClose={handleCloseLabelPrinting}
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
            ref={searchInput}
            placeholder="Məhsul axtar..."
            value={query}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onBlur={() => {
              if (query === "") {
                setFilteredProduct(data);
              }
            }}
            className="w-full border h-10 text-2xl px-12 border-newborder rounded-lg focus:outline-none"
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
          {/* <div className="relative">
            <button
              onClick={() => setShowFilters((prev) => !prev)}
              className="flex items-center justify-center hover:bg-gray-300 cursor-pointer bg-white px-2 py-1 border border-newborder rounded"
            >
              <FilterIcon className={"size-8"} />
            </button>

            {showFilters && (
              <div
                ref={filterRef}
                className="absolute px-4 py-4 top-12 bg-white size-[300px] border border-newborder right-0 items-center flex flex-col justify-between "
              >
                <ul className="flex flex-col gap-4 w-full">
                  <li className="flex gap-4">
                    <button
                      onClick={() => handleFilterSelection("name")}
                      className={`rounded-full cursor-pointer transition duration-300 size-6 flex items-center justify-center border-2 ${
                        selectedFilter === "name"
                          ? "border-blue-500"
                          : "border-gray-500"
                      }   overflow-hidden p-1`}
                    >
                      <span
                        className={`${
                          selectedFilter === "name" ? "bg-blue-400" : ""
                        } w-full h-full rounded-full`}
                      ></span>
                    </button>
                    Ad
                  </li>
                  <li className="flex gap-4">
                    <button
                      onClick={() => handleFilterSelection("stock")}
                      className={`rounded-full cursor-pointer transition duration-300 size-6 flex items-center justify-center border-2 ${
                        selectedFilter === "stock"
                          ? "border-blue-500"
                          : "border-gray-500"
                      }   overflow-hidden p-1`}
                    >
                      <span
                        className={`${
                          selectedFilter === "stock" ? "bg-blue-400" : ""
                        } w-full h-full rounded-full`}
                      ></span>
                    </button>
                    Stok
                  </li>
                  <span className="text-xl">Vahid</span>
                  <li className="flex gap-4">
                    <button
                      onClick={() => handleFilterSelection("kg")}
                      className={`rounded-full cursor-pointer transition duration-300 size-6 flex items-center justify-center border-2 ${
                        selectedFilter === "kg"
                          ? "border-blue-500"
                          : "border-gray-500"
                      }   overflow-hidden p-1`}
                    >
                      <span
                        className={`${
                          selectedFilter === "kg" ? "bg-blue-400" : ""
                        } w-full h-full rounded-full`}
                      ></span>
                    </button>
                    KG
                  </li>
                  <li className="flex gap-4">
                    <button
                      onClick={() => handleFilterSelection("piece")}
                      className={`rounded-full cursor-pointer transition duration-300 size-6 flex items-center justify-center border-2 ${
                        selectedFilter === "piece"
                          ? "border-blue-500"
                          : "border-gray-500"
                      }   overflow-hidden p-1`}
                    >
                      <span
                        className={`${
                          selectedFilter === "piece" ? "bg-blue-400" : ""
                        } w-full h-full rounded-full`}
                      ></span>
                    </button>
                    Eded
                  </li>
                  <li className="flex gap-4">
                    <button
                      onClick={() => handleFilterSelection("id")}
                      className={`rounded-full cursor-pointer transition duration-300 size-6 flex items-center justify-center border-2 ${
                        selectedFilter === "id"
                          ? "border-blue-500"
                          : "border-gray-500"
                      }   overflow-hidden p-1`}
                    >
                      <span
                        className={`${
                          selectedFilter === "id" ? "bg-blue-400" : ""
                        } w-full h-full rounded-full`}
                      ></span>
                    </button>
                    Siralama
                  </li>
                </ul>
                <button
                  onClick={filterData}
                  className=" cursor-pointer border px-2 py-1 rounded w-1/2 "
                >
                  Tedbiq et
                </button>
              </div>
            )}
          </div> */}

          <button
            onClick={handleShowLabelPrinter}
            className="py-2 px-4 cursor-pointer border hover:bg-gray-300 border-newborder rounded"
          >
            Etiket Cap
          </button>

          <button
            onClick={() => setShowNewProduct(true)}
            className="py-2 px-4 border border-newborder rounded  hover:bg-gray-300 cursor-pointer"
          >
            Məhsul Əlavə Et
          </button>
        </div>
      </div>
      <div className=" w-full flex justify-center rounded-xs border border-[#ADA3A3]   bg-white  overflow-auto max-h-[80%]">
        <table className="w-full ">
          <thead className="border border-newborder">
            <tr className=" text-center h-10 bg-white">
              <td style={{ width: "2%" }}></td>
              <td
                className=" border-l border-newborder"
                style={{ width: "2%" }}
              >
                ID
              </td>
              <td className="border  border-newborder" style={{ width: "18%" }}>
                MƏHSUL
              </td>
              <td className="border border-newborder" style={{ width: "10%" }}>
                BARKOD
              </td>
              <td className="border-l border-newborder" style={{ width: "5%" }}>
                VAHİD
              </td>
              <td className="border-l border-newborder" style={{ width: "8%" }}>
                ALIŞ QİYMƏTİ
              </td>
              <td className="border-l border-newborder" style={{ width: "8%" }}>
                SATIŞ QİYMƏTİ
              </td>
              <td className="border-l border-newborder" style={{ width: "5%" }}>
                STOK
              </td>
            </tr>
          </thead>
          <tbody className="">
            {!data && (
              <tr>
                <td
                  colSpan={8}
                  className="text-3xl border=bordercolor text-center py-14"
                >
                  Yuklenir{" "}
                </td>
              </tr>
            )}
            {filteredProducts?.map((product) => (
              <tr
                key={product.product_id}
                className=" border-b border-[#ADA3A3] hover:bg-gray-300"
              >
                <td>
                  <div className="flex w-full items-center justify-center">
                    <div
                      onClick={() => selectProduct(product)}
                      className={`border size-4 rounded border-newborder ${
                        selectedProduct?.product_id === product?.product_id
                          ? "bg-blue-600"
                          : ""
                      } `}
                    ></div>
                  </div>
                </td>
                <td className=" border-l border-b text-center border-newborder">
                  <span> {product.product_id}</span>
                </td>
                <td
                  onDoubleClick={() => handleProductById(product)}
                  className="px-4 border-l border-b  border-newborder cursor-pointer"
                >
                  <span> {product.name}</span>
                </td>
                <td className="border-l border-b  border-newborder px-4">
                  {product.barcode}
                </td>
                <td className="border-l border-b  border-newborder px-4 text-center">
                  {product.unit === "piece" ? "əd" : "kg"}
                </td>
                <td className="text-center border-l border-b  border-newborder ">
                  <div className="w-full flex items-center">
                    <span
                      className={`${
                        product.buyPrice === 0 ? "text-red-400" : "text-black"
                      } w-7/12 text-end tracking-widest font-medium`}
                    >
                      {product?.buyPrice?.toFixed(2) || "0.00"}
                    </span>{" "}
                  </div>
                </td>
                <td className="text-center border-l border-b  border-newborder">
                  <div className="w-full flex items-center">
                    <span className="w-7/12 text-end tracking-widest font-medium">
                      {product?.sellPrice?.toFixed(2) || "0.00"}
                    </span>{" "}
                  </div>
                </td>
                <td className="text-center border-l border-b  border-newborder">
                  <span
                    className={`${product.stock < 0 ? "text-red-400" : ""}`}
                  >
                    {product?.stock}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {query === "" && (
        <div className="flex pb-4 items-center justify-center ">
          <button
            onClick={() => setPage((prev) => prev + 1)}
            className="border cursor-pointer px-4 py-2 rounded bg-white border-newborder"
          >
            <span>Daha cox</span>
          </button>
        </div>
      )}
    </div>
  );
};
