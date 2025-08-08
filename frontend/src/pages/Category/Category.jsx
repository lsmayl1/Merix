import React from "react";
import { NavLink } from "react-router-dom";

export const Category = () => {
  const categories = [
    { id: 1, name: "Siqaretler", productCount: 45, zeroStockCount: 14 },
    { id: 2, name: "Meyve Terevez", productCount: 45, zeroStockCount: 14 },
    { id: 3, name: "Sud Mehsullari", productCount: 45, zeroStockCount: 14 },
  ];
  return (
    <div className=" p-6 w-full h-full ">
      <div className="bg-white h-full rounded-lg w-full flex flex-col gap-4 p-4">
        <div className="flex gap-4">
          <input
            type="text"
            className="border-mainBorder rounded-lg border w-full px-4"
            placeholder="Category name"
          />
          <button className="text-nowrap border-mainBorder border px-4 py-2 rounded-lg">
            Create Category
          </button>
        </div>
        <div className="flex flex-col gap-4">
          {categories.map((dt) => (
            <NavLink
              to={`${dt.id}`}
              className="p-4 hover:bg-gray-200 cursor-pointer rounded-lg border-mainBorder border flex gap-4 justify-between"
            >
              <span className="w-1/4">{dt.name}</span>
              <span>Product Count : {dt.productCount}</span>
              <span>Zero Stock Count{dt.zeroStockCount}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  );
};
