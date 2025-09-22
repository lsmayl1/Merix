import React, { useMemo } from "react";
import { PieChart } from ".";
type data = {
  name: string;
  color?: string;
  value: string | number;
}[];
type total = {
  label: string;
  value: number;
};

export const DonutChartComponent = ({
  title,
  data,
  total,
}: {
  title: string;
  data: data;
  total: total;
}) => {
  function getRandomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
  const chartData = useMemo(() => {
    return data.map((dt) => ({
      ...dt,
      color: dt.color ? dt.color : getRandomColor(),
    }));
  }, [data]);

  return (
    <div className="flex flex-col  h-full flex-2  bg-white rounded-lg p-2">
      <h1 className="font-bold text-[#737373]">{title || "Pie Chart"}</h1>
      <div className="flex w-full max-md:flex-col h-full gap-2">
        <div className="w-full flex flex-2 items-center justify-center">
          <div className="w-7/12 flex items-center justify-center max-md:w-full">
            <PieChart chartData={chartData} total={total || 0} />
          </div>
        </div>
        <div className="grid grid-cols-3 items-center max-md:grid-cols-2 flex-2 overflow-auto auto-rows-[80px] max-h-[600px]">
          {chartData?.map((dt, i) => (
            <div
              key={i}
              className="flex items-center gap-4 h-full hover:bg-gray-100 hover:cursor-pointer p-2 rounded-lg "
            >
              <span
                className={` rounded-xs h-1/2 w-2 `}
                style={{ backgroundColor: dt.color }}
              ></span>
              <div className="flex flex-col  ">
                <span>{dt.name || "Value"}</span>

                <span>{dt.value + " ₼" || 0}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
