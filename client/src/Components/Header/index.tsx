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
    <div className="flex gap-2">
      {collapsed && (
        <button
          onClick={setCollapsed}
          className="p-2 rounded-lg cursor-pointer"
        >
          <Collapse
            className={` text-white ${
              collapsed ? "rotate-270 size-3" : "size-3 rotate-90"
            }`}
          />
        </button>
      )}
      <div className="bg-white p-2 rounded-lg flex gap-2 items-center cursor-pointer hover:shadow-md">
        <Store />
        <span className="text-sm font-medium text-nowrap">Merix Store</span>
        <button>
          <Collapse className="text-black size-2" />
        </button>
      </div>
      <div className="bg-white p-2 rounded-lg flex gap-2 items-center cursor-pointer hover:shadow-md">
        <Calendar />
        <span className="text-sm font-medium">Today</span>
        <button>
          <Collapse className="text-black size-2" />
        </button>
      </div>
      <div className="bg-white rounded-lg flex items-center hover:shadow-md w-full p-2 gap-2">
        <Search />
        <input
          type="text"
          placeholder="Search for anything..."
          className=" focus:outline-none w-full"
        />
      </div>
      <div className="bg-white rounded-lg flex items-center hover:shadow-md px-1   gap-2">
        <button
          className={` p-2 rounded-lg cursor-pointer ${
            darkMode ? "bg-bg " : ""
          }`}
          onClick={() => setDarkMode(!darkMode)}
        >
          <Moon className={`${darkMode && "text-white"}`} />
        </button>
        <button
          className={` p-2 rounded-lg cursor-pointer ${
            !darkMode ? "bg-bg " : ""
          }`}
          onClick={() => setDarkMode(!darkMode)}
        >
          <Sun className={`${!darkMode && "text-white"}`} />
        </button>
      </div>
      <div className="bg-white rounded-lg flex items-center hover:shadow-md px-1   gap-2">
        <button className={` p-2 rounded-lg cursor-pointer `}>
          <img src={UsaIcon} className="w-12" />
        </button>
      </div>
      <div className="bg-white rounded-lg flex items-center hover:shadow-md px-1   gap-2">
        <button className={` p-2 rounded-lg cursor-pointer `}>
          <Settings />
        </button>
      </div>
      <div className="bg-white rounded-lg flex items-center hover:shadow-md px-1   gap-2">
        <button className={` p-2 rounded-lg cursor-pointer `}>
          <Bell />
        </button>
      </div>
      <div className="bg-white rounded-lg flex items-center hover:shadow-md px-2   gap-2">
        <button className={` p-2 rounded-lg cursor-pointer `}>II</button>
      </div>
    </div>
  );
};
