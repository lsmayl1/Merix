import React from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";

export const Layout = () => {
  const location = useLocation();
  const pathname = location.pathname;
  const lastPath = pathname.split("/").pop();
  return (
    <div className="h-24 w-full relative">
      <header className="h-16 w-full border border-[#ADA3A3] flex items-center px-24 justify-center">
        <ul className="flex items-center gap-10">
          <li>
            <div
              className={`px-4 py-2 bg-gray-400 rounded-lg text-xl ${
                lastPath === ""
                  ? "bg-gray-500 text-white"
                  : "bg-white border text-black"
              }`}
            >
              Mallar
            </div>
          </li>
          <li>
            <NavLink
              to={"/terezi"}
              className={`px-4 py-2 bg-gray-400 rounded-lg text-xl ${
                lastPath === "tereze"
                  ? "bg-gray-500 text-white"
                  : "bg-white border text-black"
              }`}
            >
              Terezi
            </NavLink>
          </li>
          <li>
            {" "}
            <NavLink
              target="blank"
              to={"/pos"}
              className={`px-4 py-2 bg-gray-400 rounded-lg text-xl ${
                lastPath === "pos"
                  ? "bg-gray-500 text-white"
                  : "bg-white border text-black"
              }`}
            >
              Kassa
            </NavLink>
          </li>
          <li>
            {" "}
            <div className="px-4 py-2 border rounded-lg ">Hesabat</div>
          </li>
        </ul>
      </header>
      <div className="">
        <Outlet />
      </div>
    </div>
  );
};
