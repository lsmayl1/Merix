import React, { useState } from "react";
import Store from "../../assets/Header/Store";
import Collapse from "../../assets/Navigation/Collapse";
import Calendar from "../../assets/Header/Calendar";
import Search from "../../assets/Header/Search";
import Moon from "../../assets/Header/Moon";
import Sun from "../../assets/Header/Sun";
import UsaIcon from "../../assets/Header/UsaIcon.png";
import Settings from "../../assets/Header/Settings";
import Bell from "../../assets/Header/Bell";
export const Header = ({
  collapsed,
  setCollapsed,
}: {
  collapsed: boolean;
  setCollapsed: () => void;
}) => {
  const [darkMode, setDarkMode] = useState(false);
  return (
    <div className="flex gap-2 max-md:gap-1 max-md:justify-between">
      {collapsed && (
        <button
          onClick={setCollapsed}
          className="px-4 bg-white rounded-xl  cursor-pointer max-md:hidden"
        >
          <Collapse
            className={` text-gray-500 ${
              collapsed ? "rotate-270 size-3" : "size-3 rotate-90"
            }`}
          />
        </button>
      )}
      <div className="bg-white p-2 max-md:hidden rounded-lg flex gap-2  items-center cursor-pointer hover:shadow-md">
        <Store />
        <span className="text-sm font-medium text-nowrap">Merix Store</span>
        <button>
          <Collapse className="text-black size-2" />
        </button>
      </div>
      <div className="bg-white p-2 rounded-lg flex gap-2 items-center cursor-pointer hover:shadow-md">
        <Calendar className={"max-md:size-4"} />
        <span className="text-sm font-medium max-md:text-xs">Today</span>
        <button>
          <Collapse className="text-black size-2 " />
        </button>
      </div>
      <div className="bg-white max-md:hidden rounded-lg flex items-center hover:shadow-md w-full p-2 gap-2 ">
        <Search />
        <input
          type="text"
          placeholder="Search for anything..."
          className=" focus:outline-none w-full"
        />
      </div>
      <div className="bg-white rounded-lg flex items-center hover:shadow-md px-1   gap-2 max-md:gap-1 max-md:hidden">
        <button
          className={`max-md:p-1 p-2 rounded-lg cursor-pointer ${
            darkMode ? "bg-bg " : ""
          }`}
          onClick={() => setDarkMode(!darkMode)}
        >
          <Moon className={`max-md:size-4 ${darkMode && "text-white"}`} />
        </button>
        <button
          className={` max-md:p-1 p-2 rounded-lg cursor-pointer ${
            !darkMode ? "bg-bg " : ""
          }`}
          onClick={() => setDarkMode(!darkMode)}
        >
          <Sun
            className={`max-md:size-4 text-black ${darkMode && "text-white"}`}
          />
        </button>
      </div>
      <div className="bg-white rounded-lg flex items-center hover:shadow-md px-1   gap-2 max-md:hidden">
        <button className={` p-2 rounded-lg cursor-pointer max-md:p-1`}>
          <img src={UsaIcon} className="w-12 max-md:w-full" />
        </button>
      </div>
      <div className="bg-white rounded-lg flex items-center hover:shadow-md px-1   gap-2  max-md:hidden">
        <button className={` p-2 rounded-lg cursor-pointer `}>
          <Settings className="max-md:size-4" />
        </button>
      </div>
      <div className="flex gap-2 max-md:gap-1">
        <div className="bg-white rounded-lg flex items-center hover:shadow-md px-1 ">
          <button className={` p-2 rounded-lg cursor-pointer `}>
            <Bell className={"max-md:size-4"} />
          </button>
        </div>
        <div className="bg-white rounded-lg flex items-center hover:shadow-md px-2   gap-2">
          <button className={` p-2 rounded-lg cursor-pointer `}>II</button>
        </div>
      </div>
    </div>
  );
};
