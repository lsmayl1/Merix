import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from "react";
import { debounce } from "lodash";
import { Xicon } from "../assets/Xicon";
import { AddIcon } from "../assets/AddIcon";
import { SearchIcon } from "../assets/SearchIcon";
import { Basket } from "../assets/Basket";
import { Confirm } from "../components/Confirm";
import { PaymentMethod } from "../components/PaymentMethod";
import { RecycleBin } from "../assets/recycleBin";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import Fuse from "fuse.js";
import { ShortCutEdit } from "../components/ShortCutEdit";
import { PosReports } from "../components/PosReports";
import { useApi } from "../components/Context/useApiContext";
import { FilterIcon } from "../assets/filterIcon";

export const Pos = () => {
  const { data, isSuccess, API, isLoading, error } = useApi();

  const [terminals, setTerminals] = useState(() => {
    const storedTerminals = JSON.parse(localStorage.getItem("terminals"));
    return storedTerminals && storedTerminals.length > 0
      ? storedTerminals
      : [{ id: 1, name: "Kassa 1", products: [] }];
  });

  const [shortCutsProducts] = useState(() => {
    const storedData = localStorage.getItem("shorcuts");
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      return parsedData && Array.isArray(parsedData.products)
        ? parsedData
        : { products: [] };
    }
    return { products: [] };
  });
  const [showReports, setShowReports] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [shortCut, setShortCut] = useState(false);
  const [selectedTerminal, setSelectedTerminal] = useState(1);
  const [total, setTotal] = useState(0);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showPaymentMethod, setShowPaymentMethod] = useState(false);
  const [editProductId, setEditProductId] = useState(null);
  const [query, setQuery] = useState("");
  const barkodInput = useRef(null);
  const searchInput = useRef(null);
  const [barkodFocus] = useState(true);
  const [barcode, setBarcode] = useState();
  const selectedTerminalProducts = terminals.find(
    (terminal) => terminal.id === selectedTerminal
  )?.products;
  const [filteredProducts, setFilteredProducts] = useState(data ? data : []);
  const [freshProducts, setFreshProducts] = useState([]);

  const [form, setForm] = useState({
    payment_method: paymentMethod,
    products: [],
  });
  useEffect(() => {
    const freshData = async () => {
      if (shortCutsProducts?.products?.length === 0) return;
      try {
        const res = await axios.post(`${API}/products/bulk`, {
          identifiers: shortCutsProducts.products,
        });
        setFreshProducts(res.data);
      } catch (error) {
        console.error("Error fetching fresh data:", error);
        // Optionally handle the error in state or UI
      }
    };
    freshData();
  }, [shortCutsProducts]);
  // barkod input focus
  useEffect(() => {
    const handleClick = (event) => {
      // Eğer tıklanan element bir input veya buton değilse, barkod inputuna odaklan
      if (!event.target.matches("input, button,span")) {
        if (barkodInput.current) {
          barkodInput.current.focus();
        }
      }
    };

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);
  // total calculator
  useEffect(() => {
    let sum = 0;
    selectedTerminalProducts.forEach((product) => {
      sum += product.sellPrice * product.quantity;
    });
    setTotal(sum);
  }, [selectedTerminalProducts]);

  // data save to LocalStorage
  useEffect(() => {
    localStorage.setItem("terminals", JSON.stringify(terminals));
  }, [terminals, selectedTerminal]);

  // Create new Terminal
  const NewTerminal = () => {
    if (terminals.length >= 4) return;
    const newTerminal = {
      id: terminals.length + 1,
      name: `Kassa ${terminals.length + 1}`,
      products: [],
    };
    setTerminals([...terminals, newTerminal]);
    setSelectedTerminal(newTerminal.id);
    if (barkodInput?.current) {
      barkodInput.current.focus();
    }
  };
  // Delete Selected Terminal
  const DeleteTerminal = () => {
    if (selectedTerminal === 1) {
      return;
    }
    const newTerminals = terminals.filter(
      (terminal) => terminal.id !== selectedTerminal
    );

    setTerminals(newTerminals);

    if (newTerminals.length > 0) {
      setSelectedTerminal(newTerminals[0].id);
    } else {
      setSelectedTerminal(null);
    }
    if (barkodInput?.current) {
      barkodInput.current.focus();
    }
  };
  // Add Product to Basket
  const AddProductToBasket = (id, quantity) => {
    // Find the product from the products list

    const product = data.find((product) => product.product_id === id);

    if (!product) {
      toast.error("Mehsul yoxdur!");
      return;
    }

    // Check if product exists in selected terminal's products
    const existingProduct = selectedTerminalProducts.find(
      (p) => p.product_id === id
    );

    let newProducts;

    if (existingProduct) {
      // If product exists, increment its quantity
      newProducts = selectedTerminalProducts.map((product) => {
        if (product.product_id === id) {
          const newQuantity = (product.quantity || 0) + (Number(quantity) || 1);
          return {
            ...product,
            quantity: newQuantity,
          };
        }
        return product;
      });
    } else {
      // If product doesn't exist, add it with provided quantity
      newProducts = [
        ...selectedTerminalProducts,
        { ...product, quantity: Number(quantity) || 1 },
      ];
    }

    // Update the terminals array with new products
    const newTerminals = terminals.map((terminal) => {
      if (terminal.id === selectedTerminal) {
        return { ...terminal, products: newProducts };
      }
      return terminal;
    });

    setTerminals(newTerminals);
  };
  const handleProductChange = (e, id) => {
    const value = e.target.value;

    const filteredValue = value.replace(/[^0-9.]/g, "");

    // Разрешить только одну точку
    const dotCount = (filteredValue.match(/\./g) || []).length;
    if (dotCount > 1) {
      return; // Если больше одной точки, остановить обработку
    }

    // Преобразовать значение в число
    const numericValue = parseFloat(filteredValue);

    // Обновить состояние products в выбранном терминале
    const newProducts = selectedTerminalProducts.map((product) => {
      if (product.product_id === id) {
        return {
          ...product,
          quantity: isNaN(numericValue) ? 0 : numericValue,
        };
      }
      return product;
    });

    const newTerminals = terminals.map((terminal) => {
      if (terminal.id === selectedTerminal) {
        return { ...terminal, products: newProducts };
      }
      return terminal;
    });

    setTerminals(newTerminals);
  };
  // Clear Basket
  const handleDelete = (option) => {
    if (!option) {
      return setShowConfirm(false);
    }
    const newTerminals = terminals.map((terminal) => {
      if (terminal.id === selectedTerminal) {
        return { ...terminal, products: [] };
      }
      return terminal;
    });

    setTerminals(newTerminals);
    setShowConfirm(false);
    if (barkodInput?.current) {
      barkodInput.current.focus();
    }
  };

  const DeleteProductFromBasktet = (id) => {
    const updatedProducts = selectedTerminalProducts.filter(
      (product) => product.product_id !== id
    );

    const newTerminals = terminals.map((terminal) => {
      if (terminal.id === selectedTerminal) {
        return { ...terminal, products: updatedProducts };
      }
      return terminal;
    });
    setTerminals(newTerminals);
  };

  const handleClosePaymentMethod = () => {
    setShowPaymentMethod(false);
    if (barkodInput.current) {
      barkodInput.current.focus();
    }
  };

  const handleBarcodeChange = async (e) => {
    const value = e.target.value;
    setBarcode(value);

    if (value.length > 0 && e.key === "Enter") {
      try {
        let apiBarcode = value; // API'ye gönderilecek barkod
        let quantity = 1; // Varsayılan miktar (adet bazlı ürünler için)

        // Kilogram bazlı ürün kontrolü
        if (value.length === 13 && value.startsWith("22")) {
          // Son 6 haneyi al (kilogram bilgisi)
          const weightPart = value.slice(-6); // Son 6 rakam
          const weightInKg = parseInt(weightPart) / 10000; // Örneğin, "012345" -> 12.345 kg
          quantity = weightInKg; // Miktarı kilogram olarak ayarla

          // Son rakamı al
          const lastDigit = value.slice(-1); // Okunan barkodun son rakamı (örneğin, "5")

          // API için barkodu düzenle: İlk 7 hane + 5 sıfır + son rakam
          apiBarcode = value.slice(0, 7) + "00000" + lastDigit; // Örneğin, "2212345000005"
        }

        const response = await axios.get(`${API}/products/${apiBarcode}`);

        AddProductToBasket(response.data.product_id, quantity);
      } catch (error) {
        toast.error("Mehsul yoxdur!");
        console.error("API isteği hatası:", error);
      }

      setBarcode("");
      barkodInput.current.focus();
    }
  };

  const fuse = useMemo(() => {
    if (!isSuccess || !data) return null; // Return null until data is ready
    return new Fuse(data, {
      keys: ["name", "barcode"], // Adjust based on your data structure
      threshold: 0.3,
      ignoreCase: false,
      minMatchCharLength: 2,
      includeScore: true,
      shouldSort: true,
    });
  }, [data, isSuccess]);

  useMemo(() => {
    if (isSuccess && data) {
      setFilteredProducts(data); // Initialize with full dataset
    }
  }, [data, isSuccess]);

  const handleInputChange = useCallback(
    (e) => {
      const value = e.target.value;
      setQuery(value);

      if (!fuse || !isSuccess) return; // Skip if fuse or data isn't ready

      const debouncedSearch = debounce((searchQuery) => {
        if (!searchQuery || searchQuery.length < 2) {
          setFilteredProducts(data); // Reset to full dataset
          return;
        }

        const results = fuse.search(searchQuery, { limit: 50 });
        setFilteredProducts(results.map((result) => result.item));
      }, 100);

      debouncedSearch(value);

      return () => debouncedSearch.cancel();
    },
    [fuse, data, isSuccess, setFilteredProducts, setQuery]
  );

  useEffect(() => {
    if (barkodFocus) {
      barkodInput.current.focus();
    }
  }, [barkodFocus]);

  const closeReports = () => {
    setShowReports(false);
  };

  const closeEditTab = () => {
    setShortCut(false);
  };
  const filteredData = selectedTerminalProducts?.map((product) => ({
    product_id: product.product_id,
    quantity: product.quantity || 0,
  }));
  useEffect(() => {
    if (selectedTerminalProducts) {
      setForm({
        ...form,
        products: filteredData,
        payment_method: paymentMethod,
      });
    }
  }, [selectedTerminalProducts, paymentMethod]);
  const postSale = async () => {
    if (selectedTerminalProducts.length === 0) {
      return;
    }
    try {
      const res = await axios.post("http://localhost:3000/sales", form);

      console.log(res);
      const newTerminals = terminals.map((terminal) => {
        if (terminal.id === selectedTerminal) {
          return { ...terminal, products: [] };
        }
        return terminal;
      });
      toast.success("Satış uğurlu", {
        autoClose: 2000,
      });

      setTerminals(newTerminals);
    } catch (err) {
      toast.error("Səbətdə məhsul yoxdur!");
      console.log(err);
    }
  };

  const changePaymentMethod = (method) => {
    setPaymentMethod(method);
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey && event.key === "e") {
        event.preventDefault(); // Tarayıcı varsayılanını engelle
        searchInput.current?.focus(); // Inputa odaklan
      } else if (event.key === "F1") {
        event.preventDefault();
        NewTerminal();
      } else if (event.altKey && event.key === "x") {
        event.preventDefault();
        DeleteTerminal();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  });

  return (
    <div className="flex relative flex-col gap-2 h-screen overflow-hidden bg-gray-100">
      <title>Kassa</title>
      <ToastContainer />

      {showConfirm && selectedTerminalProducts.length > 0 && (
        <Confirm
          name={"Səbətdəki məhsullar silinsin?"}
          handleOption={handleDelete}
        />
      )}
      {showPaymentMethod && selectedTerminalProducts.length > 0 && (
        <PaymentMethod
          totals={total}
          closePayment={handleClosePaymentMethod}
          changePaymentMethod={changePaymentMethod}
          paymentMethodvalue={paymentMethod}
          postData={postSale}
        />
      )}
      {shortCut && (
        <ShortCutEdit
          data={data}
          isLoading={isLoading}
          error={error}
          handleClose={closeEditTab}
        />
      )}
      {showReports && <PosReports handleClose={closeReports} />}

      <input
        type="text"
        ref={barkodInput}
        onChange={handleBarcodeChange}
        onKeyDown={handleBarcodeChange}
        // className="focus:outline-red-500"
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

      <header className="flex justify-between  px-2  items-center">
        <div className="flex gap-2  border-newborder">
          {terminals?.map((terminal) => (
            <div
              key={terminal.id}
              onClick={() => setSelectedTerminal(terminal.id)}
              className={`px-4  gap-4 cursor-pointer ${
                terminal.id === selectedTerminal
                  ? "bg-[#494949]"
                  : "bg-gray-500"
              }   flex items-center  h-14 rounded-lg text-white`}
            >
              <h1 className="text-xl leading-0">{terminal.name}</h1>
              {terminals[0].id !== terminal.id &&
                selectedTerminal === terminal.id && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      DeleteTerminal();
                    }}
                    className={`cursor-pointer  `}
                  >
                    <Xicon />
                  </button>
                )}
            </div>
          ))}

          <button
            onClick={NewTerminal}
            className={`cursor-pointer px-2  flex items-center bg-gray-500 h-14 rounded-lg text-white ${
              terminals.length >= 4 && "hidden"
            }`}
          >
            <AddIcon />
          </button>
        </div>
        <div
          className="px-10 cursor-pointer"
          onClick={() => setShowReports(true)}
        >
          <button className="cursor-pointer border bg-white p-2  border-newborder rounded-md text-xl">
            Hesabat
          </button>
        </div>
      </header>

      <div className="flex h-full gap-4 ">
        <div className="min-w-1/2 flex flex-col overflow-hidden border-r border-newborder bg-white">
          {/* Products Table - Fixed with flex-1 to take available space */}
          <div className="w-full overflow-auto h-[400px]  border-newborder bg-white">
            <table
              className="w-full"
              style={{ borderCollapse: "collapse", tableLayout: "auto" }}
              border={1}
            >
              <thead className="text-center bg-[#757872] h-10 text-white text-md font-light  sticky top-0">
                <tr>
                  <th style={{ width: "40%" }}>Məhsul</th>
                  <th style={{ width: "15%" }}>Qiymet</th>
                  <th style={{ width: "15%" }}>Miqdar</th>
                  <th style={{ width: "15%" }}>Məbləg</th>
                  <th style={{ width: "15%" }}>Əməliyyat</th>
                </tr>
              </thead>
              <tbody className="">
                {selectedTerminalProducts?.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center  h-32">
                      <span className="text-3xl font-semibold ">
                        Məhsul yoxdur
                      </span>
                    </td>
                  </tr>
                )}
                {selectedTerminalProducts?.map((product) => (
                  <tr
                    key={product.product_id}
                    className="text-center h-8 w-full border-newborder border-b text-xl"
                  >
                    <td>
                      <div className="flex items-center pl-5">
                        <h1 className="text-sm">{product.name}</h1>
                      </div>
                    </td>
                    <td>
                      <h1 className="text-sm">
                        {product?.sellPrice.toFixed(2) + " ₼"}
                      </h1>
                    </td>
                    <td>
                      <div className="flex justify-center items-center">
                        <div className="flex items-center text-sm">
                          {editProductId === product.product_id ? (
                            <input
                              className="text-center w-[50px] focus:outline-none"
                              type="number"
                              name="quantity"
                              onChange={(e) => {
                                handleProductChange(e, product.product_id);
                              }}
                              onBlur={() => setEditProductId(null)}
                              autoFocus
                            />
                          ) : (
                            <span
                              className="flex gap-2 justify-center items-center cursor-pointer"
                              onClick={() =>
                                setEditProductId(product.product_id)
                              }
                            >
                              {product.quantity.toFixed(2)}
                              <span>
                                {product.unit === "piece" ? "əd" : "kg"}
                              </span>
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="flex w-full justify-center items-center">
                        <span className="text-right w-1/5 text-sm flex justify-end">
                          {(product.sellPrice * product.quantity).toFixed(2)}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className=" p-2 rounded-xl w-full flex justify-center ">
                        <button
                          className="cursor-pointer"
                          onClick={() =>
                            DeleteProductFromBasktet(product.product_id)
                          }
                        >
                          <RecycleBin className="size-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Footer with buttons - now has a fixed height */}
          <div className=" flex justify-between p-2  mt-auto ">
            <div className="flex gap-4 items-center">
              <button
                onClick={() => {
                  if (selectedTerminalProducts.length !== 0) {
                    setQuery("");
                    setShowConfirm(true);
                  } else {
                    if (barkodInput?.current) {
                      barkodInput.current.focus();
                    }
                    return;
                  }
                }}
                className="bg-red-700 cursor-pointer rounded-xl text-white text-xl flex items-center py-4 px-10"
              >
                Ləğv et
              </button>
              <button
                onClick={() => {
                  if (selectedTerminalProducts.length === 0) {
                    if (barkodInput?.current) {
                      barkodInput.current.focus();
                    }
                    setQuery("");
                    return;
                  }
                  setQuery("");
                  setShowPaymentMethod((prev) => !prev);
                }}
                className="cursor-pointer bg-[#50B156] font-semibold rounded-xl text-xl text-white flex items-center py-4 px-10"
              >
                Ödəniş
              </button>
            </div>
            <div className="p-4">
              <h1 className="text-3xl font-semibold">
                Total:{" "}
                <span className="text-4xl font-semibold ml-4 ">
                  {total.toFixed(2)} ₼
                </span>
              </h1>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-10 w-full px-4 box-border ">
          <div className="flex w-full gap-12 items-center">
            <div className="relative  w-9/12 flex items-center ">
              <input
                type="text"
                placeholder="Məhsul axtar..."
                ref={searchInput}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setQuery("");
                    barkodInput.current?.focus();
                  }
                }}
                value={query}
                onChange={handleInputChange}
                className="w-full border h-10 text-2xl px-12 bg-white border-newborder rounded-lg focus:outline-none"
              />
              <SearchIcon className={"absolute ml-2"} />
              <div className="absolute w-10 right-0 items-center justify-center flex p-4  rounded-full ">
                <button
                  onClick={() => {
                    setQuery("");
                    if (barkodInput?.current) {
                      barkodInput.current.focus();
                    }
                  }}
                  className="cursor-pointer"
                >
                  X
                </button>
              </div>
              {query && (
                <div className="absolute top-12 w-full rounded-lg border-newborder h-128  bg-white z-50 border px-4 py-2">
                  <ul className="h-full overflow-auto flex flex-col">
                    {isLoading && "Loading"}
                    {filteredProducts.map((product) => (
                      <li
                        className="text-xl cursor-pointer"
                        key={product.product_id}
                      >
                        {" "}
                        <div className="flex hover:bg-gray-100 p-2 items-center justify-between w-full pr-5">
                          {" "}
                          <p className="w-9/14">{product.name} </p>
                          <span className="text-right">
                            {product.sellPrice} ₼{" "}
                          </span>{" "}
                          <button
                            onClick={() =>
                              AddProductToBasket(product.product_id)
                            }
                            className="cursor-pointer flex items-center justify-center border border-newborder hover:bg-green-700  bg-white rounded-xl hover:text-white"
                          >
                            <Basket className={"size-10 "} />
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <button
              onClick={() => setShortCut((prev) => !prev)}
              className=" cursor-pointer hover:bg-gray-200 bg-white p-1 rounded border border-newborder "
            >
              <FilterIcon className={"size-8"} />
            </button>
          </div>
          <div className="w-full">
            <ul className=" flex box-border flex-wrap gap-2 w-full">
              {freshProducts.length === 0 && "Mehsul yoxdur"}
              {freshProducts?.map((product) => (
                <li
                  key={product?.product_id}
                  className="relative h-[5.7rem]"
                  onClick={() => AddProductToBasket(product.product_id)}
                >
                  <div className="border border-newborder bg-white hover:bg-gray-300 cursor-pointer rounded px-4 w-32 flex items-center justify-start h-16 basis-48 ">
                    <span className="text-xs">{product.name}</span>
                    <div className="absolute right-1 rounded-lg  border-newborder border   bottom-5 z-10 bg-white flex items-center justify-center px-4 ">
                      <span className="text-xs"> {product.sellPrice} ₼</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
