import React, { useState } from "react";
import { Plus } from "../../assets/Plus";

export const FiltersModal = () => {
  const [selectedOption, setSelectedOption] = useState(null);

  const filterOptions = [
    { label: "Category", value: "category" },
    { label: "Price Range", value: "priceRange" },
    { label: "Name", value: "name" },
    { label: "Unit", value: "unit" },
  ];
  return (
    <div className="bg-white absolute border top-10 right-12 border-mainBorder p-4 rounded-lg shadow-md w-48 ">
      <div className="w-full">
        <ul className="w-full flex flex-col gap-2">
          {filterOptions.map((item, index) => (
            <li className="">
              <div className="flex gap-2 items-center justify-between border-b border-mainBorder py-2">
                <label>{item.label}</label>
                <button
                  onClick={() => setSelectedOption(item.value)}
                  className="text-mainText"
                >
                  <Plus className={"size-4"} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
