import React, { useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";
import Fuse from "fuse.js";
import CustomDatePicker from "../components/DatePicker/CustomDatePicker";
import { ReportsDetails } from "../components/ReportsDetails";
import { FilterIcon } from "../assets/filterIcon";
import { FormatDate } from "../components/utils/DateFunctions";
import { SearchIcon } from "../assets/SearchIcon";
import debounce from "lodash/debounce";

export const Scale = () => {
  const [showFilter, setShowFilter] = useState(false);
  const [data, setData] = useState();
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [query, setQuery] = useState("");
  // API'den veri çekme
  useEffect(() => {
    const getReport = async () => {
      try {
        const res = await axios.get(`${API}/plu/generate-plu`);
        setData(res.data.pluData);
        setFilteredProducts(res.data.pluData || []);
      } catch (error) {
        console.error("API Error:", error);
      }
    };
    getReport();
  }, [API]);

  const fuse = useMemo(() => {
    if (filteredProducts.length === 0) return null; // Return null until data is ready
    return new Fuse(filteredProducts, {
      keys: ["name"], // Adjust based on your data structure
      threshold: 0.5,
      minMatchCharLength: 2,
      includeScore: true,
      shouldSort: true,
    });
  }, [filteredProducts]);
  const handleInputChange = useCallback(
    (e) => {
      const value = e?.target?.value;
      setQuery(value);

      if (!fuse) return; // Skip if fuse or data isn't ready

      const debouncedSearch = debounce((searchQuery) => {
        if (!searchQuery || searchQuery.length < 2) {
          setFilteredProducts(data); // Reset to full dataset
          return;
        }

        const results = fuse.search(searchQuery, { limit: 50 });
        setFilteredProducts(results.map((result) => result.item));
      }, 300);

      debouncedSearch(value);

      return () => debouncedSearch.cancel();
    },
    [fuse, data, setFilteredProducts, setQuery]
  );

  // Filtreleme fonksiyonu
  const applyFilter = () => {
    let filtered = [...(data.sales || [])];

    switch (selectedFilter) {
      case "name": // Tarihe göre sıralama (en yeni önce)
        filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
        break;
      case "cash": // Sadece nakit ödemeler
        filtered = filtered.filter((sale) => sale.paymentMethod === "cash");
        break;
      case "card": // Sadece kart ödemeleri
        filtered = filtered.filter((sale) => sale.paymentMethod === "card");
        break;
      case "kg": // Toplam meblağa göre sıralama (büyükten küçüğe)
        filtered.sort(
          (a, b) => Number(b.total_amount) - Number(a.total_amount)
        );
        break;
      case "piece": // Kâra göre sıralama (büyükten küçüğe)
        filtered.sort((a, b) => Number(b.profit) - Number(a.profit));
        break;
      case "id": // ID'ye göre sıralama (büyükten küçüğe)
        filtered.sort((a, b) => b.sale_id - a.sale_id);
        break;
      default: // Filtre yoksa orijinal veri
        filtered = [...(data.sales || [])];
        break;
    }

    setFilteredProducts(filtered);
  };

  const updateScale = async () => {
    try {
      const res = await axios.get(`${API}/plu/export-plu`, {
        responseType: "blob",
      });

      const blob = new Blob([res.data], { type: res.headers["context-type"] });
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "terezi.csv";
      document.body.appendChild(a);

      a.click();

      // Temizleme işlemi
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.log(error);
    }
  };

  const handleFilterSelection = (option) => {
    setSelectedFilter(selectedFilter === option ? null : option);
  };

  return (
    <div className="relative flex h-full flex-col gap-4">
      <title>Terezi</title>

      <div className="flex flex-col  overflow-auto h-full items-center">
        <div className="w-10/12 h-20 gap-12 flex items-center justify-end py-4">
          {/* Search input */}
          <div className="relative flex-1 flex items-center h-20">
            <input
              type="text"
              // ref={searchInput}
              placeholder="Məhsul axtar..."
              value={query}
              // onKeyDown={(e) => {
              //   if (e.key === "Enter") {
              //     barkodInput.current.focus();
              //   }
              // }}
              onChange={handleInputChange}
              className="w-full border h-10 text-2xl px-12 border-newborder rounded-lg focus:outline-none"
            />
            <SearchIcon className={"absolute ml-2"} />
            <div
              // onClick={() => {
              //   setQuery("");
              //   barkodInput.current.focus();
              // }}
              className="absolute w-10 right-0 items-center justify-center flex px-1 py-3 cursor-pointer rounded-full "
            >
              <button className="size-10 cursor-pointer">X</button>
            </div>
          </div>
          <button
            onClick={updateScale}
            className="flex items-center justify-center hover:bg-gray-300 cursor-pointer bg-white px-2 py-2 border border-newborder rounded"
          >
            Tereziyi yenile
          </button>
          <div className="relative">
            <button
              onClick={() => setShowFilter((prev) => !prev)}
              className="flex items-center justify-center hover:bg-gray-300 cursor-pointer bg-white px-2 py-1 border border-newborder rounded"
            >
              <FilterIcon className="size-8" />
            </button>
            {showFilter && (
              <div className="absolute z-50 px-4 py-4 top-12 bg-white w-[300px] border border-newborder right-0 flex flex-col  gap-12 items-center">
                <ul className="flex flex-col gap-4 w-full">
                  <li className="flex gap-4">
                    <button
                      onClick={() => handleFilterSelection("cash")}
                      className={`rounded-full cursor-pointer transition duration-300 size-6 flex items-center justify-center border-2 ${
                        selectedFilter === "cash"
                          ? "border-blue-500"
                          : "border-gray-500"
                      } overflow-hidden p-1`}
                    >
                      <span
                        className={`${
                          selectedFilter === "cash" ? "bg-blue-400" : ""
                        } w-full h-full rounded-full`}
                      ></span>
                    </button>
                    En cox satilan
                  </li>
                  <li className="flex gap-4">
                    <button
                      onClick={() => handleFilterSelection("card")}
                      className={`rounded-full cursor-pointer transition duration-300 size-6 flex items-center justify-center border-2 ${
                        selectedFilter === "card"
                          ? "border-blue-500"
                          : "border-gray-500"
                      } overflow-hidden p-1`}
                    >
                      <span
                        className={`${
                          selectedFilter === "card" ? "bg-blue-400" : ""
                        } w-full h-full rounded-full`}
                      ></span>
                    </button>
                    En cox qazanc
                  </li>
                </ul>
                <button
                  onClick={applyFilter}
                  className="cursor-pointer flex justify-center border px-2 py-1 rounded w-1/2"
                >
                  Tedbiq et
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="w-10/12 border border-newborder h-[85%] overflow-auto relative flex flex-col items-center">
          <table
            className="w-full  overflow-auto"
            style={{ tableLayout: "auto", borderSpacing: 0 }}
            border={1}
          >
            <thead className="text-center bg-gray-500 h-14 text-white font-light sticky top-0">
              <tr>
                <th>ID</th>
                <th style={{ width: "40%" }}>Məhsul</th>
                <th>PLU</th>
                <th>Satis Qiymet</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                {filteredProducts.length === 0 && (
                  <td
                    colSpan={3}
                    className="text-center tracking-wider  text-3xl p-12"
                  >
                    Secilmiş tarix aralığında satılmış məhsul yoxdur
                  </td>
                )}
              </tr>
              {filteredProducts?.map((product) => (
                <tr
                  key={product?.no}
                  className="text-center h-12 w-full border-[#ADA3A3] border-b text-lg hover:bg-gray-200"
                >
                  <td>
                    <h1>{product?.no}</h1>
                  </td>
                  <td>
                    <div className="w-full text-left flex justify-center">
                      <span className="text-sm w-1/2">{product?.name}</span>
                    </div>
                  </td>
                  <td>{product?.lfcode}</td>
                  <td>
                    <div className="flex w-7/12 gap-4 justify-end items-center">
                      <span>{product?.unit_price.toFixed(2)}</span>
                      <span>₼</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
