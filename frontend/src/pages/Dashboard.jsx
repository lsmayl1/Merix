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
    <div className="w-full h-screen p-2 flex flex-col">
      <CustomDatePicker handleDate={handleDateRange} />

      <div className="flex items-center w-full h-1/5">
        <ul className="flex w-full gap-4 px-4 justify-center">
          <li className="w-1/4 h-full">
            <div className="w-full p-4 rounded border border-newborder h-full flex flex-col gap-4">
              <span className="text-2xl text-gray-400">Dovrriyə</span>
              <span className="text-2xl">{reports?.turnover + "  ₼" || 0}</span>
            </div>
          </li>
          <li className="w-1/4 h-full">
            <div className="w-full p-4 rounded border border-newborder h-full flex flex-col gap-4">
              <span className="text-2xl text-gray-400">Mənfəət</span>
              <span className="text-2xl">{reports?.profit + " ₼" || 0}</span>
            </div>
          </li>
          <li className="w-1/4 h-full">
            <div className="w-full p-4 rounded border border-newborder h-full flex flex-col gap-4">
              <span className="text-2xl text-gray-400">Mənfəət %</span>
              <span className="text-2xl">{reports?.profit + " %" || 0}</span>
            </div>
          </li>
          <li className="w-1/4 h-full">
            <div className="w-full p-4 rounded border border-newborder h-full flex flex-col gap-4">
              <span className="text-2xl text-gray-400">Satış sayısı</span>
              <span className="text-2xl">{reports?.sellCount}</span>
            </div>
          </li>
        </ul>
      </div>
      <div className="flex gap-6 w-full px-4">
        <LineChart />
        <StockList />
      </div>
    </div>
  );
};
