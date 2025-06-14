import React from "react";
import { SearchIcon } from "../../assets/SearchIcon";
import { Setting } from "../../assets/Setting";
import { Bell } from "../../assets/Bell";
import Profile from "../../assets/Profile";

export const Header = () => {
  return (
    <div className="w-full  py-3   bg-headerBg flex justify-between items-center">
      <h1 className="text-white font-semibold px-14 text-2xl ">Minex</h1>
      <div className="w-1/3 relative flex items-center">
        <input
          type="text"
          className="bg-[#3C3C3C] rounded-lg py-2 w-full px-10 text-white focus:ou placeholder:text-white"
          placeholder="Search"
        />
        <SearchIcon className={"text-white absolute ml-2"} />
      </div>
      <div className="flex items-center justify-between px-4 gap-8">
        <div className="flex  gap-4 items-center">
          <Setting className={"text-white stroke-white size-8 "} />
          <Bell className={"text-white size-8"} />
        </div>

        <div className="flex gap-4 items-center">
          <span>
            <Profile className={"text-white"} />
          </span>
          <div className="flex flex-col ">
            <h1 className="text-white font-medium">Admin Name</h1>
            <p className="text-gray-400 text-xs">example@gmail.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};
