import React, { useEffect, useState } from "react";
import CustomDatePicker from "../components/DatePicker/CustomDatePicker";
import axios from "axios";
import { useApi } from "../components/Context/useApiContext.jsx";
import { LineChart } from "../components/Charts/LineChart.jsx";
import { StockList } from "../components/StockList.jsx";
export const Dashboard = () => {
  const { API } = useApi();
  const [dateRange, setDateRange] = useState({});
  const [reports, setReports] = useState({
    turnover: 0.0,
    profit: 0.0,
    sellCount: 0,
  });

  const handleDateRange = (range) => {
    const timeZoneOffset = "+04:00"; // Adjust based on your timezone

    // Convert from and to dates to ISO format with timezone
    const formattedRange = {
      from: range.from
        ? new Date(range.from).toISOString().replace("Z", timeZoneOffset)
        : null,
      to: range.to
        ? new Date(range.to).toISOString().replace("Z", timeZoneOffset)
        : null,
    };

    setDateRange(formattedRange);
  };

  const data = [
    { name: "Dovrriyə", id: 1, value: reports?.turnover + "  ₼" || 0 },
    { name: "Mənfəət", id: 2, value: reports?.profit + " ₼" || 0 },
    { name: "Mənfəət %", id: 3, value: reports?.profit + " %" || 0 },
    { name: "Satış sayısı", id: 4, value: reports?.sellCount || 0 },
  ];

  useEffect(() => {
    if (!dateRange.from) return;
    const getReport = async () => {
      try {
        const res = await axios.post(`${API}/reports`, dateRange);
        setReports(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    getReport();
  }, [dateRange, API]);

  return (
    <div className="w-full h-screen py-2 px-4 flex flex-col">
      <CustomDatePicker handleDate={handleDateRange} />

      {/* <div className="flex items-center w-full h-1/5">
        <ul className="flex w-full gap-4 max-lg:gap-2 ">
          {data?.map((dt) => (
            <li key={dt.id} className="w-full h-full">
              <div className="w-full p-4 truncate rounded border border-newborder h-full flex flex-col gap-4">
                <span className="text-2xl truncate text-gray-400 max-lg:text-xl max-md:text-md max-xs:text-[12px]
                max-mm:text-[10px]">
                  {dt.name}
                </span>
                <span className="text-2xl max-lg:text-xl max-md:text-md max-xs:text-[14px] max-mm:text-[10px]">
                  {dt.value}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div> */}
      <div className="flex gap-6 w-full h-3/7 max-md:h-full max-md:flex-col">
        <LineChart />
        <StockList />
      </div>
    </div>
  );
};
