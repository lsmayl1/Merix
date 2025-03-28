import React, { useEffect, useState } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { CloseIcon } from "../assets/Close";
const FetchSales = async () => {
  const { data } = await axios.get("http://localhost:3000/sales");
  return data;
};
export const PosReports = ({ handleClose }) => {
  const { data, isLoding, error } = useQuery({
    queryKey: ["sales"],
    queryFn: FetchSales,
  });
  const [turnover, setTurnOver] = useState(null);

  const formatDate = (isoString) => {
    const date = new Date(isoString);

    // Gün, ay və il
    const days = date.getDate().toString().padStart(2, "0");
    const months = [
      "yanvar",
      "fevral",
      "mart",
      "aprel",
      "may",
      "iyun",
      "iyul",
      "avqust",
      "sentyabr",
      "oktyabr",
      "noyabr",
      "dekabr",
    ];
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    // Saat, dəqiqə və saniyə
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");

    // Tarix və vaxtı birləşdir
    return `${days} ${month} ${year}, ${hours}:${minutes}:${seconds}`;
  };

  useEffect(() => {
    const totalTurnover = data?.reduce(
      (acc, sale) => acc + Number(sale.total_amount),
      0
    );
    setTurnOver(totalTurnover);
  }, [data]);

  return (
    <div className="absolute  flex justify-center items-center w-full h-full backdrop-blur-xs z-40">
      <div className="flex flex-col  justify-center h-[90%] bg-white w-[90%] rounded-l-xl border-[#ADA3A3] border relative">
        <div className="absolute -top-4 size-10 overflow-hidden bg-white rounded-l-3xl -right-5 ">
          <button className="cursor-pointer" onClick={handleClose}>
            <CloseIcon className={"w-full h-full"} />
          </button>
        </div>
        <div className="px-4 flex items-center justify-center">
          <span className="text-3xl">Dövriyyə: {turnover?.toFixed(2)}</span>
        </div>
        <div className="w-full overflow-auto h-full px-20  border-[#ADA3A3] py-10">
          <table
            className="w-full border"
            style={{ borderCollapse: "collapse", tableLayout: "auto" }}
            border={1}
          >
            <thead className="text-center bg-gray-500 h-14 text-white text-xl font-light   top-0">
              <tr>
                <th style={{ width: "15%" }}>Satıs Nömrəsi</th>
                <th>Toplam Məbləğ</th>
                <th>Ödəniş növü</th>
                <th>Tarix</th>
              </tr>
            </thead>
            <tbody className="">
              {data?.map((sale) => (
                <tr
                  key={sale.sale_id}
                  className="text-center h-16 w-full border-[#ADA3A3] border-b text-xl"
                >
                  <td>
                    <div className="flex items-center justify-center pl-5">
                      <h1>{sale.sale_id}</h1>
                    </div>
                  </td>
                  <td> {sale.total_amount + " ₼"}</td>
                  <td>
                    <div className="flex justify-center items-center">
                      <div className="flex items-center">
                        <span className="flex gap-2 justify-center items-center cursor-pointer">
                          {sale.payment_method === "cash" ? "Nağd" : "Kart"}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="flex w-full justify-center items-center">
                      <span className="text-right min-w-20 flex justify-end">
                        {formatDate(sale.date)}
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
