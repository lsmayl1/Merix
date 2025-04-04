import React from "react";

export const StockList = () => {
  const data = [
    { name: "Corek", amount: 15 },
    { name: "Cay", amount: 10 },
    { name: "Sut", amount: 5 },
    { name: "Yag", amount: 20 },
  ];
  return (
    <div className="h-full w-5/12 border border-newborder rounded-lg p-4">
      <h1 className="text-xl">Azalan Stoklar</h1>
      <ul className="flex flex-col py-4">
        {data.map((item, index) => (
          <li
            key={index}
            className="flex justify-between border-b border-newborder py-2"
          >
            <span>{item.name}</span>
            <span>{item.amount}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
