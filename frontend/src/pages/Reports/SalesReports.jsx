import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useApi } from "../../components/Context/useApiContext";
import CustomDatePicker from "../../components/DatePicker/CustomDatePicker";
import { ReportsDetails } from "../../components/ReportsDetails";
import { FilterIcon } from "../../assets/filterIcon";
import { FormatDate } from "../../components/utils/DateFunctions";

export const SalesReports = () => {
  const { API } = useApi();
  const [dateRange, setDateRange] = useState({});
  const [showDetails, setShowDetails] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [selectedSale, setSelectedSale] = useState(null);
  const [data, setData] = useState({
    turnover: 0,
    profit: 0,
    sellCount: 0,
  });
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState([]);

  // API'den veri çekme
  useEffect(() => {
    if (!dateRange.from) return;

    const getReport = async () => {
      try {
        const res = await axios.post(`${API}/reports`, dateRange);
        setData(res.data);
        setFilteredProducts(res.data.sales || []);
      } catch (error) {
        console.error("API Error:", error);
      }
    };
    getReport();
  }, [dateRange, API]);

  // Turnover hesaplama fonksiyonu
  const calculateTurnover = useCallback(() => {
    const turnover = filteredProducts.reduce((sum, sale) => {
      const amount = parseFloat(sale.total_amount) || 0; // parseFloat ile daha kesin dönüşüm
      return sum + amount;
    }, 0);
    const profit = filteredProducts.reduce((sum, sale) => {
      const amount = parseFloat(sale.profit) || 0;
      return sum + amount;
    }, 0);

    const saleCount = filteredProducts.length;

    const fixedProfit = Number(profit.toFixed(2));
    const fixedTurnover = Number(turnover.toFixed(2));
    setData((prev) => ({
      ...prev,
      turnover: fixedTurnover,
      profit: fixedProfit,
      sellCount: saleCount,
    }));
  }, [filteredProducts]);

  // filteredProducts değiştiğinde turnover'ı yeniden hesapla
  useEffect(() => {
    calculateTurnover();
  }, [filteredProducts]);

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

  const handleFilterSelection = (option) => {
    setSelectedFilter(selectedFilter === option ? null : option);
  };

  const handleDate = (range) => {
    setDateRange(range);
    setSelectedFilter(null); // Tarih değiştiğinde filtreyi sıfırla
  };

  return (
    <div className="relative flex h-full flex-col gap-4">
      <title>Hesabat</title>

      {showDetails && (
        <ReportsDetails
          selectedSale={selectedSale}
          handleClose={() => setShowDetails(false)}
        />
      )}

      <CustomDatePicker handleDate={handleDate} />
      <div className="flex flex-col overflow-auto h-full items-center">
        <div className="w-10/12 h-20 flex items-center py-4">
          <ul className="w-full h-full flex items-center gap-4">
            <li className="w-1/4 border border-newborder h-full rounded flex items-center gap-4 px-4">
              <span className="text-xl text-gray-500 px-2">Dovriyye</span>
              <div className="flex w-9/12 gap-4 justify-end items-center text-2xl">
                <span>{data?.turnover}</span>
                <span>₼</span>
              </div>
            </li>
            <li className="w-1/4 border border-newborder h-full rounded flex items-center gap-4 px-4">
              <span className="text-xl text-gray-500 px-2">Qazanc</span>
              <div className="flex w-9/12 gap-4 justify-end items-center text-2xl">
                <span>{data.profit}</span>
                <span>₼</span>
              </div>
            </li>
            <li className="w-1/4 border border-newborder h-full rounded flex items-center justify-between gap-4 px-4">
              <span className="text-xl w-7/12 text-gray-500 px-2">
                Satis sayisi
              </span>
              <div className="flex gap-4 justify-end items-end text-2xl">
                <span>{data.sellCount}</span>
              </div>
            </li>
          </ul>
          <div className="relative">
            <button
              onClick={() => setShowFilter((prev) => !prev)}
              className="flex items-center justify-center hover:bg-gray-300 cursor-pointer bg-white px-2 py-1 border border-newborder rounded"
            >
              <FilterIcon className="size-8" />
            </button>
            {showFilter && (
              <div className="absolute z-50 px-4 py-4 top-12 bg-white size-[300px] border border-newborder right-0 flex flex-col justify-between">
                <ul className="flex flex-col gap-4 w-full">
                  <li className="flex gap-4">
                    <button
                      onClick={() => handleFilterSelection("name")}
                      className={`rounded-full cursor-pointer transition duration-300 size-6 flex items-center justify-center border-2 ${
                        selectedFilter === "name"
                          ? "border-blue-500"
                          : "border-gray-500"
                      } overflow-hidden p-1`}
                    >
                      <span
                        className={`${
                          selectedFilter === "name" ? "bg-blue-400" : ""
                        } w-full h-full rounded-full`}
                      ></span>
                    </button>
                    Tarix
                  </li>
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
                    Nagd
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
                    Kart
                  </li>
                  <li className="flex gap-4">
                    <button
                      onClick={() => handleFilterSelection("kg")}
                      className={`rounded-full cursor-pointer transition duration-300 size-6 flex items-center justify-center border-2 ${
                        selectedFilter === "kg"
                          ? "border-blue-500"
                          : "border-gray-500"
                      } overflow-hidden p-1`}
                    >
                      <span
                        className={`${
                          selectedFilter === "kg" ? "bg-blue-400" : ""
                        } w-full h-full rounded-full`}
                      ></span>
                    </button>
                    Mebleg
                  </li>
                  <li className="flex gap-4">
                    <button
                      onClick={() => handleFilterSelection("piece")}
                      className={`rounded-full cursor-pointer transition duration-300 size-6 flex items-center justify-center border-2 ${
                        selectedFilter === "piece"
                          ? "border-blue-500"
                          : "border-gray-500"
                      } overflow-hidden p-1`}
                    >
                      <span
                        className={`${
                          selectedFilter === "piece" ? "bg-blue-400" : ""
                        } w-full h-full rounded-full`}
                      ></span>
                    </button>
                    Qazanc
                  </li>
                  <li className="flex gap-4">
                    <button
                      onClick={() => handleFilterSelection("id")}
                      className={`rounded-full cursor-pointer transition duration-300 size-6 flex items-center justify-center border-2 ${
                        selectedFilter === "id"
                          ? "border-blue-500"
                          : "border-gray-500"
                      } overflow-hidden p-1`}
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
                  onClick={applyFilter}
                  className="cursor-pointer border px-2 py-1 rounded w-1/2"
                >
                  Tedbiq et
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="w-10/12 border border-newborder h-[85%]  overflow-auto relative flex flex-col items-center">
          <table
            className=" w-full  overflow-auto"
            style={{ tableLayout: "auto", borderSpacing: 0 }}
            border={1}
          >
            <thead className="text-center bg-gray-500 h-14 text-white font-light sticky top-0">
              <tr>
                <th style={{ width: "10%" }}>No</th>
                <th>Toplam Məbləğ</th>
                <th>Ödəniş növü</th>
                <th>Qazanc</th>
                <th style={{ width: "25%" }}>Tarix</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                {filteredProducts.length === 0 && (
                  <td colSpan={5} className="text-center tracking-wider  text-3xl p-12">
                    Secilmiş tarix aralığında satış yoxdur
                  </td>
                )}
              </tr>
              {filteredProducts?.map((sale) => (
                <tr
                  key={sale.sale_id}
                  className="text-center h-12 w-full border-[#ADA3A3] border-b text-xl hover:bg-gray-200"
                  onDoubleClick={() => {
                    setSelectedSale(sale);
                    setShowDetails(true);
                  }}
                >
                  <td>
                    <div className="flex items-center justify-center">
                      <h1>{sale.sale_id}</h1>
                    </div>
                  </td>
                  <td>
                    <div className="flex w-8/12 gap-4 justify-end items-center">
                      <span>{sale.total_amount}</span>
                      <span>₼</span>
                    </div>
                  </td>
                  <td>
                    <div className="flex justify-center items-center">
                      <span className="flex gap-2 justify-center items-center cursor-pointer">
                        {sale.paymentMethod === "cash" ? "Nağd" : "Kart"}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div className="flex w-9/12 gap-4 justify-end items-center">
                      <span>{sale.profit}</span>
                      <span>₼</span>
                    </div>
                  </td>
                  <td>
                    <div className="flex w-full justify-center items-center">
                      <span className="text-right min-w-20 flex justify-end">
                        {FormatDate(sale.date)}
                      </span>
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
