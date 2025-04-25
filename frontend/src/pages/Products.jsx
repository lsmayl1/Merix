import React, { useEffect, useState, useRef, useCallback } from "react";

import { SearchIcon } from "../assets/SearchIcon";
import { AddProduct } from "../components/Products/AddProduct";
import { ToastContainer, toast } from "react-toastify";
import { useApi } from "../components/Context/useApiContext";
import { LabelPrint } from "../components/LabelPrinting/LabelPrint";
import { FilterIcon } from "../assets/filterIcon";
import { API } from "../components/Context/ApiContex";
import axios from "axios";
import { useMediaQuery } from "react-responsive";
import { BarcodeReader } from "../components/BarcodeReader";
export const Products = () => {
  const tableHeaders = [
    "ID",
    "MƏHSUL",
    "BARKOD",
    "VAHİD",
    "ALIŞ QİYMƏTİ",
    "SATIŞ QİYMƏTİ",
    "STOK",
  ];
  const {
    form,
    setForm,
    PutSuccess,
    NewProduct,
    FetchById,
    PostError,
    PostSuccess,
  } = useApi();
  const isMobile = useMediaQuery({ maxWidth: 768 });
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
  const [showBarcodeReader, setShowBarcodeReader] = useState(false);
  const [editableProduct, setEditableProduct] = useState(false);
  useEffect(() => {
    if (barkodInput.current) {
      barkodInput.current.focus();
    }
    const handleClick = (event) => {
      // Eğer tıklanan element bir input veya buton değilse, barkod inputuna odaklan
      if (!event.target.matches("input, button, li")) {
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

  const selectProduct = (product) => {
    if (selectedProduct?.product_id === product.product_id) {
      setSelectedProduct(null);
    } else {
      setSelectedProduct(product);
    }
  };

  const handleCloseNewProducts = () => {
    setShowNewProduct(false);
    setSelectedProduct(null);
    setBarcode("");
    setForm({
      name: "",
      category: "mehsul",
      barcode: "",
      buyPrice: 0.0,
      sellPrice: 0.0,
      unit: "piece",
    });
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
          if (!product) {
            setForm((prev) => ({
              ...prev,
              barcode: value,
              // Diğer alanları resetle
              name: "",
              category: "mehsul",
              buyPrice: 0.0,
            }));
            setEditableProduct(false);
          } else {
            setSelectedProduct(product);
            setForm(product);
            setEditableProduct(true);
          }
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

  const editProduct = () => {
    setForm(selectedProduct);
    setShowNewProduct(true);
  };

  const handleCloseBarcodeReader = () => {
    setShowBarcodeReader(false);
    barkodInput?.current?.focus();
  };

  const handleBarcodeReader = async () => {
    setShowBarcodeReader(false);
    try {
      const data = await axios.get(`${API}/products/${barcode}`);
      const product = data.data;
      setSelectedProduct(product);
      setForm(product);
      setEditableProduct(true);
      setShowNewProduct(true);
    } catch (error) {
      console.log(error);
      setForm((prev) => ({
        ...prev,
        barcode: barcode,
        name: "",
        category: "mehsul",
        buyPrice: 0.0,
        sellPrice: 0.0,
        unit: "piece",
      }));
      setShowNewProduct(true);
      setEditableProduct(false);
    }
  };

  useEffect(() => {
    if (barcode && barcode.trim().length > 0) {
      handleBarcodeReader();
    }
  }, [barcode]);

  return (
    <div
      className={`flex   flex-col w-full items-center px-4 gap-4  relative h-screen`}
    >
      <ToastContainer />
      {showNewProduct && (
        <AddProduct
          handleClose={handleCloseNewProducts}
          isEditMode={editableProduct}
        />
      )}
      {showBarcodeReader && (
        <BarcodeReader
          handleCloseReader={handleCloseBarcodeReader}
          setBarcode={setBarcode}
        />
      )}
      {showLabelPrinter && (
        <LabelPrint
          product={selectedProduct}
          handleClose={handleCloseLabelPrinting}
        />
      )}
      {!isMobile && (
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
      )}

      <div className="relative   w-full gap-16 flex items-center max-lg:flex-col-reverse max-lg:gap-4 max-lg:items-end ">
        <div className="relative flex-1 flex items-center h-20 w-full">
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
            className="w-full border h-10 text-2xl px-12 max-lg:h-8 max-lg:text-sm border-newborder rounded-lg focus:outline-none max-lg:w-full"
          />
          <SearchIcon className={"absolute ml-2 max-lg:size-5"} />
          <div className="absolute w-20 right-0 items-center justify-center flex px-1 py-3 cursor-pointer rounded-full  ">
            {isMobile && (
              <button
                onClick={() => setShowBarcodeReader(true)}
                className="truncate border"
              >
                Barkod oxu
              </button>
            )}
            <button
              onClick={() => {
                setQuery("");
                barkodInput.current.focus();
              }}
              className="size-10 cursor-pointer"
            >
              X
            </button>
          </div>
        </div>
        <div className="flex gap-4 max-lg:justify-end  max-lg:items-end">
          <button
            onClick={handleShowLabelPrinter}
            className="py-2 px-4 max-lg:py-1 max-lg:px-2 max-lg:text-xs cursor-pointer border hover:bg-gray-300 border-newborder rounded"
          >
            Etiket Cap
          </button>

          <button
            onClick={() => setShowNewProduct(true)}
            className="py-2 px-4 max-lg:py-1 max-lg:px-2 max-lg:text-xs border border-newborder rounded  hover:bg-gray-300 cursor-pointer"
          >
            Məhsul Əlavə Et
          </button>
          {isMobile && selectedProduct && (
            <button
              onClick={editProduct}
              className="py-2 px-4 max-lg:py-1 max-lg:px-2 max-lg:text-xs border border-newborder rounded  hover:bg-gray-300 cursor-pointer"
            >
              Duzelis Et
            </button>
          )}
        </div>
      </div>
      {isMobile ? (
        <div className="flex flex-col gap-2 w-full overflow-auto h-full max-h-[80%]">
          <ul className="flex gap-2 w-full  max-lg:gap-1  flex-col overflow-auto h-full pr-2">
            {filteredProducts?.map((product) => (
              <li
                key={product.product_id}
                onClick={() => selectProduct(product)}
                className={`flex flex-col bg-white border  rounded-lg px-4 py-4  w-full ${
                  selectedProduct?.product_id === product.product_id
                    ? " border-blue-600"
                    : "border-newborder"
                }`}
              >
                <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                  <span className="text-xs font-medium"> {product.name}</span>
                  <span className="text-gray-400 text-xs">
                    ID : {product.product_id}
                  </span>
                </div>
                <div className="flex gap-2 items-center justify-between border-b border-gray-100 py-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">ALIŞ QİYMƏTİ</span>
                    <span> {product?.buyPrice?.toFixed(2) || "0.00"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">SATIŞ QİYMƏTİ</span>
                    <span> {product?.sellPrice?.toFixed(2) || "0.00"}</span>
                  </div>
                </div>
                <div className="flex gap-2 items-center justify-between pt-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">BARKOD</span>
                    <span className="text-xs font-medium">
                      {product?.barcode}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">STOK</span>
                    <span className="text-xs font-medium">
                      {product?.stock}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className=" w-full flex justify-center rounded-xs border border-[#ADA3A3]   bg-white  overflow-auto max-h-[80%]">
          <table className="w-full ">
            <colgroup>
              <col className="max-xs:w-1/8 "></col>
              <col className="max-xs:w-1/8 "></col>
              <col className="max-xs:w-1/8 "></col>
              <col className="max-xs:w-1/8 "></col>
              <col className="max-xs:w-1/8 "></col>
              <col className="max-xs:w-1/8 "></col>
              <col className="max-xs:w-2"></col>
            </colgroup>
            <thead className="border border-newborder">
              <tr className=" text-center h-10 bg-white truncate max-md:text-[10px] max-sm:text-[8px] max-xs:text-fxs ">
                <td className="max-xs:hidden"></td>
                {tableHeaders.map((header, index) => (
                  <td
                    key={index}
                    className={`border-l border-b text-center border-newborder max-xs:px-2 max-xs:text-fxs`}
                  >
                    {header}
                  </td>
                ))}
              </tr>
            </thead>
            <tbody className="">
              {!data && (
                <tr>
                  <td
                    colSpan={8}
                    className="text-3xl border-newborder text-center py-14"
                  >
                    Yuklenir{" "}
                  </td>
                </tr>
              )}
              {filteredProducts?.map((product) => (
                <tr
                  key={product.product_id}
                  className=" border-b border-newborder hover:bg-gray-300 "
                >
                  <td className="max-xs:hidden">
                    <div className="flex w-full items-center justify-center ">
                      <div
                        onClick={() => selectProduct(product)}
                        className={`border size-4 max-lg:size-3 max-sm:size-2 max-md:size-3 rounded border-newborder ${
                          selectedProduct?.product_id === product?.product_id
                            ? "bg-blue-600"
                            : ""
                        } `}
                      ></div>
                    </div>
                  </td>
                  <td className=" border-l border-b text-center border-newborder max-xs:px-1">
                    <span className="max-lg:text-flg max-sm:text-fsm max-xs:text-fxs ">
                      {" "}
                      {product.product_id}
                    </span>
                  </td>
                  <td
                    onDoubleClick={() => handleProductById(product)}
                    className="px-4 border-l border-b  border-newborder cursor-pointer max-sm:px-2 max-xs:px-1"
                  >
                    <span className=" max-lg:text-flg max-md:text-[10px] truncate max-sm:text-fsm max-xs:text-fxs">
                      {" "}
                      {product.name}
                    </span>
                  </td>
                  <td className="border-l border-b  border-newborder px-4 max-sm:px-2 max-xs:px-1 ">
                    <span className=" max-lg:text-flg max-md:text-xs max-sm:text-fsm max-xs:text-fxs">
                      {product.barcode}
                    </span>
                  </td>
                  <td className="border-l border-b  border-newborder px-4 max-sm:px-2 max-xs:px-1 text-center max-lg:text-flg  max-md:text-xs max-sm:text-fsm max-xs:text-fxs">
                    {product.unit === "piece" ? "əd" : "kg"}
                  </td>
                  <td className="text-center border-l border-b  border-newborder ">
                    <div className="w-full flex items-center">
                      <span
                        className={`${
                          product.buyPrice === 0 ? "text-red-400" : "text-black"
                        } w-7/12 text-end tracking-widest font-medium max-lg:text-flg max-md:text-xs max-sm:text-fsm max-sm:w-8/12 max-xs:text-fxs`}
                      >
                        {product?.buyPrice?.toFixed(2) || "0.00"}
                      </span>{" "}
                    </div>
                  </td>
                  <td className="text-center border-l border-b  border-newborder">
                    <div className="w-full flex items-center">
                      <span className="w-7/12 text-end tracking-widest max-lg:text-flg font-medium max-md:text-xs max-sm:text-fsm max-sm:w-8/12 max-xs:text-fxs">
                        {product?.sellPrice?.toFixed(2) || "0.00"}
                      </span>{" "}
                    </div>
                  </td>
                  <td className="text-center border-l border-b  border-newborder">
                    <span
                      className={` max-lg:text-flg max-md:text-xs max-sm:text-fsm max-xs:text-fxs ${
                        product.stock < 0 ? "text-red-400" : ""
                      }`}
                    >
                      {product?.stock}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {query === "" && (
        <div className="flex pb-4 items-center justify-center ">
          <button
            onClick={() => setPage((prev) => prev + 1)}
            className="border cursor-pointer max-lg:px-2 max-lg:py-0  px-4 py-2 rounded bg-white border-newborder"
          >
            <span className="max-lg:text-xs">Daha cox</span>
          </button>
        </div>
      )}
    </div>
  );
};
