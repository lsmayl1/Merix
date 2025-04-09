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
import { Confirm } from "./Confirm";
import { PaymentMethod } from "./PaymentMethod";
import { RecycleBin } from "../assets/recycleBin";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import Fuse from "fuse.js";
import { useQuery } from "@tanstack/react-query";
import { ShortCutEdit } from "./ShortCutEdit";
import { PosReports } from "./PosReports";
const FetchProducts = async () => {
  const { data } = await axios.get("http://localhost:3000/products");
  return data;
};

export const Pos = () => {
  const { data, isLoding, error, isSuccess } = useQuery({
    queryKey: ["products"],
    queryFn: FetchProducts,
    staleTime: 1000 * 60,
  });

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
  const [form, setForm] = useState({
    payment_method: paymentMethod,
    products: [],
  });
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
  useEffect(() => {
    let sum = 0;
    selectedTerminalProducts.forEach((product) => {
      sum += product.sellPrice * product.quantity;
    });
    setTotal(sum);
  }, [selectedTerminalProducts]);

  useEffect(() => {
    localStorage.setItem("terminals", JSON.stringify(terminals));
  }, [terminals, selectedTerminal]);

  const handleSpanClick = (id) => {
    setEditProductId(id);
  };

  const handleInputBlur = () => {
    setEditProductId(null);
  };

  const NewTerminal = () => {
    if (terminals.length >= 4) return;
    const newTerminal = {
      id: terminals.length + 1,
      name: `Kassa ${terminals.length + 1}`,
      products: [],
    };
    setTerminals([...terminals, newTerminal]);
    setSelectedTerminal(newTerminal.id);
  };

  const DeleteTerminal = () => {
    if (selectedTerminal === 1) {
      console.log("Bu terminal siline bilmez");
      return;
    }
    const newTerminals = terminals.filter(
      (terminal) => terminal.id !== selectedTerminal
    );

    setTerminals(newTerminals);

    if (newTerminals.length > 0) {
      setSelectedTerminal(newTerminals[0].id);
    } else {
      setSelectedTerminal(null); // Ya da başka bir uygun değer
    }
  };

  const activeTerminal = (id) => {
    setSelectedTerminal(id);
  };

  const AddProductToBasket = (id, quantity) => {
    // Find the product from the products list
    const product = data.find((product) => product.product_id === id);

    if (!product) {
      console.error("Ürün bulunamadı:", id);
      toast.error("Ürün bulunamadı!"); // Kullanıcıya geri bildirim
      return; // Erken dönüş, devam etme
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

    handleSearchInputBlur();
    setTerminals(newTerminals);
  };
  const handleProductChange = (e, id) => {
    const value = e.target.value;

    // Разрешить только цифры и точку
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
    handleSearchInputBlur();
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
          console.log(weightInKg);
          quantity = weightInKg; // Miktarı kilogram olarak ayarla

          // Son rakamı al
          const lastDigit = value.slice(-1); // Okunan barkodun son rakamı (örneğin, "5")

          // API için barkodu düzenle: İlk 7 hane + 5 sıfır + son rakam
          apiBarcode = value.slice(0, 7) + "00000" + lastDigit; // Örneğin, "2212345000005"
        }

        // API isteği
        const response = await axios.get(
          `http://localhost:3000/products/${apiBarcode}`
        );

        // Ürünü sepete eklerken quantity'i de gönder
        AddProductToBasket(response.data.product_id, quantity);
      } catch (error) {
        toast.error("Mehsul yoxdur!");
        console.error("API isteği hatası:", error);
      }

      setBarcode(""); // Input'u temizle
      barkodInput.current.focus(); // Tekrar odaklan
    }
  };

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

  // Ürün arama inputuna odaklan
  const handleUrunAramaClick = () => {
    if (searchInput.current) {
      searchInput.current.focus(); // Ürün arama inputuna odaklan
    }
  };
  const handleSearchInputBlur = () => {
    if (barkodInput.current) {
      barkodInput.current.focus();
    }
  };

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
    setForm({ ...form, payment_method: paymentMethod, products: filteredData });
  }, [paymentMethod, selectedTerminalProducts, filteredData, form]);

  const postSale = async () => {
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
    <div className="flex relative flex-col gap-2 h-screen overflow-hidden">
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
          isLoading={isLoding}
          error={error}
          handleClose={closeEditTab}
        />
      )}
      {showReports && <PosReports handleClose={closeReports} />}
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
      <div className="flex justify-between  px-2  items-center">
        <div className="flex gap-2  border-[#ADA3A3]">
          {terminals?.map((terminal) => (
            <div
              key={terminal.id}
              onClick={() => activeTerminal(terminal.id)}
              className={`px-2  gap-4 cursor-pointer ${
                terminal.id === selectedTerminal
                  ? "bg-[#494949]"
                  : "bg-gray-500"
              }   flex items-center  h-14 rounded-lg text-white`}
            >
              <h1 className="text-xl leading-0">{terminal.name}</h1>
              {terminals[0].id !== terminal.id && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    DeleteTerminal();
                  }}
                  className={`cursor-pointer `}
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
          <button className="cursor-pointer border h-14 px-4 rounded-md text-xl">
            Hesabat
          </button>
        </div>
      </div>

      <div className="flex h-full gap-4 ">
        <div className="min-w-1/2 flex flex-col overflow-hidden border-r border-[#ADA3A3]">
          {/* Products Table - Fixed with flex-1 to take available space */}
          <div className="w-full overflow-auto h-[400px]  border-[#ADA3A3]">
            <table
              className="w-full"
              style={{ borderCollapse: "collapse", tableLayout: "auto" }}
              border={1}
            >
              <thead className="text-center bg-[#757872] h-10 text-white text-md font-light  sticky top-0">
                <tr>
                  <th style={{ width: "40%" }}>Məhsul</th>
                  <th style={{ width: "15%" }}>Qiymet</th>
                  <th style={{ width: "15%" }}>Vahid</th>
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
                    className="text-center h-8 w-full border-[#ADA3A3] border-b text-xl"
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
                              type="text"
                              name="quantity"
                              onKeyPress={(e) => {
                                if (e.key === "Enter") {
                                  barkodInput.current.focus();
                                }
                              }}
                              onChange={(e) => {
                                handleProductChange(e, product.product_id);
                              }}
                              onBlur={handleInputBlur}
                              autoFocus
                            />
                          ) : (
                            <span
                              className="flex gap-2 justify-center items-center cursor-pointer"
                              onClick={() =>
                                handleSpanClick(product.product_id)
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
                        <span className="text-right min-w-20 text-sm flex justify-end">
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
                  if (selectedTerminalProducts.length > 0) {
                    setQuery("");
                    setShowConfirm(true);
                  } else {
                    return;
                  }
                }}
                className="bg-red-700 cursor-pointer rounded-xl text-white text-xl flex items-center py-4 px-10"
              >
                Ləğv et
              </button>
              <button
                onClick={() => setShowPaymentMethod((prev) => !prev)}
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
          <div className="flex w-full justify-between items-center">
            <div className="relative  w-9/12 flex items-center ">
              <input
                type="text"
                placeholder="Məhsul axtar..."
                ref={searchInput}
                onClick={handleUrunAramaClick}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    barkodInput.current?.focus();
                  }
                }}
                value={query}
                onBlur={handleSearchInputBlur}
                onChange={handleInputChange}
                className="w-full border h-10 text-2xl px-12 border-[#ADA3A3] rounded-lg focus:outline-none"
              />
              <SearchIcon className={"absolute ml-2"} />
              <div
                onClick={() => {
                  setQuery("");
                }}
                className="absolute w-10 right-0 items-center justify-center flex px-1 py-3 cursor-pointer rounded-full "
              >
                <button className="">X</button>
              </div>
              {query && (
                <div className="absolute top-12 w-full rounded-lg border-[#ADA3A3] h-128  bg-white z-50 border p-4">
                  <ul className="h-full overflow-auto flex flex-col">
                    {isLoding && "Loading"}
                    {filteredProducts.map((product) => (
                      <li className="text-2xl" key={product.product_id}>
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
                            className="cursor-pointer flex items-center justify-center border border-[#ADA3A3] hover:bg-green-700  bg-white rounded-xl hover:text-white"
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
            <div className="border p-1 rounded-md">
              <button
                onClick={() => setShortCut((prev) => !prev)}
                className="text-xl px-4 cursor-pointer"
              >
                Düzəliş et
              </button>
            </div>
          </div>
          <div className="w-full">
            <ul className=" flex box-border flex-wrap gap-2 w-full">
              {shortCutsProducts.products.length === 0 && "Mehsul yoxdur"}
              {shortCutsProducts?.products?.map((product) => (
                <li
                  key={product.product_id}
                  className="relative h-[5.7rem] "
                  onClick={() => AddProductToBasket(product.product_id)}
                >
                  <div className="border border-[#ADA3A3] hover:bg-gray-300 cursor-pointer rounded px-4 w-32 flex items-center justify-start h-16 basis-48 ">
                    <span className="text-xs">{product.name}</span>
                    <div className="absolute right-1 rounded-lg  border-[#ADA3A3] border   bottom-5 z-10 bg-white flex items-center justify-center px-4 ">
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
