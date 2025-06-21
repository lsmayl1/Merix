import React, { useState } from "react";
import Calendar from "../../assets/Calendar";
import { getDateRange } from "../utils/GetDateRange";

export const DateRange = ({ handleDate }) => {
  const [showDateModal, setShowDateModal] = useState(false);
  const [range, setRange] = useState([
    { name: "Today" },
    { name: "Yesterday" },
    { name: "Last 7 Days" },
    { name: "Last 30 Days" },
    { name: "This Month" },
    { name: "Last Month" },
    { name: "This Year" },
  ]);
  const [end, setEnd] = useState(null);
  const { startFormatted, endFormatted } = getDateRange("thisWeek");
  console.log(startFormatted);

  return (
    <div className="flex w-full justify-between p-4 items-center">
      <h1 className="text-3xl font-semibold ">{startFormatted} - {endFormatted} </h1>
      <div className="flex items-center relative ">
        <button className="flex gap-4 items-center bg-white py-2 px-4 rounded-lg border border-mainBorder text-xl">
          <Calendar />
          This Week
        </button>
        {showDateModal && (
          <div className="flex bg-white shadow-2xl  absolute top-12 z-50 rounded-lg w-[600%] right-0">
            <div className="flex flex-col gap-12 flex-1  justify-between border-r border-mainBorder">
              <ul className="flex flex-col font-semibold">
                {range.map((rg, index) => (
                  <li
                    key={index}
                    className="hover:bg-gray-100 p-4 rounded-lg cursor-pointer"
                  >
                    {rg.name}
                  </li>
                ))}
              </ul>
              <span className="hover:bg-gray-100 py-3 px-4 rounded-lg cursor-pointer font-semibold">
                Custom
              </span>
            </div>
            <div className="flex-3"></div>
          </div>
        )}
      </div>
    </div>
  );
};
