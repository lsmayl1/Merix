import React from "react";

export const KPI = ({ data }) => {
  return (
    <div className="grid grid-cols-4 max-md:grid-cols-2  gap-2 w-full">
      {data.map((item, index) => (
        <div
          key={index}
          className="bg-white w-full  h-full justify-between px-4 py-4  rounded-lg flex flex-col gap-2"
        >
          <label className="text-mainText text-nowrap max-md:text-xs font-medium capitalize">
            {item.label}
          </label>
          <span className="text-3xl font-semibold max-md:text-2xl text-nowrap">{item.value}</span>
        </div>
      ))}
    </div>
  );
};
