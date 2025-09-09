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

export const PieChartComponent = ({
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
    <div className="flex flex-col gap-4 h-full flex-1  bg-white rounded-lg p-2">
      <h1 className="font-bold text-[#737373]">{title || "Pie Chart"}</h1>
      <div className="w-full flex items-center justify-center">
        <div className="w-9/12 flex items-center justify-center">
          <PieChart chartData={chartData} total={total || 0} />
        </div>
      </div>
      <div className="flex flex-col gap-2 p-2 overflow-auto max-h-[100px] min-h-0">
        {chartData?.map((dt, i) => (
          <div
            key={i}
            className="flex justify-between hover:bg-gray-100 hover:cursor-pointer"
          >
            <div className="flex gap-2 items-center">
              <span
                className={` rounded-full size-4`}
                style={{ backgroundColor: dt.color }}
              ></span>
              <span>{dt.name || "Value"}</span>
            </div>
            <span>{dt.value || 0}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
