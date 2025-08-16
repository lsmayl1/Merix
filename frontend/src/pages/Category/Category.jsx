import React from "react";
import { NavLink } from "react-router-dom";
import { useGetCategoriesQuery } from "../../redux/slices/CategorySlice";

export const Category = () => {
  const { data } = useGetCategoriesQuery();
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
          {data?.map((dt) => (
            <NavLink
              to={`${dt.category_id}`}
              className="p-8 hover:bg-gray-200 cursor-pointer rounded-lg border-mainBorder border flex gap-4 justify-between"
            >
              <span className="w-1/4 text-4xl">{dt.name}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  );
};
