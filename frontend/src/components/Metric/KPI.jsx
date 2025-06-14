import React from "react";

export const KPI = ({ data }) => {
  return (
    <div className="flex items-center gap-2 w-full">
      {data.map((item, index) => (
        <div
          key={index}
          className="bg-white w-full  px-4 py-4  rounded-lg flex flex-col gap-2"
        >
          <label className="text-mainText font-medium capitalize">
            {item.label}
          </label>
          <span className="text-3xl font-semibold">{item.value}</span>
        </div>
      ))}
    </div>
  );
};
