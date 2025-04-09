import React, { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import Home, { Dashboard } from "../../assets/Home";
import { ProductIcon } from "../../assets/ProductIcon";
import { PosIcon } from "../../assets/posIcon";
import { ReportIcon } from "../../assets/ReportIcon";
import { ScaleIcon } from "../../assets/ScaleIcon";
import { RightArrow } from "../../assets/Arrows";
import { Hamburger } from "../../assets/hamburger";

export const Layout = () => {
  const location = useLocation();
  const pathname = location.pathname;
  const lastPath = pathname.split("/").pop();
  const [showSidebar, setShowSidebar] = useState(true);
  const [showHamburger, setShowHamburger] = useState(false);
  const links = [
    { name: "Əsas", blank: false, path: "", icon: <Dashboard /> },
    { name: "Mallar", blank: false, path: "mallar", icon: <ProductIcon /> },
    { name: "Kassa", blank: true, path: "kassa", icon: <PosIcon /> },
    {
      name: "Hesabat",
      blank: false,
      icon: <ReportIcon />,
      category: [
        { name: "Satış Hesabatı", path: "satis-hesabati" },
        {
          name: "Məhsul Üzrə Satış Hesabatı",
          path: "satilmis-mehsul-hesabati",
        },
      ],
    },
    { name: "Tərəzi", blank: false, path: "terezi", icon: <ScaleIcon /> },
  ];

  return (
    <div className="h-screen w-full flex relative bg-white">
      <button
        className="h-10 w-10 lg:hidden flex items-center justify-center  absolute top-7 left-4 z-50"
        onClick={() => setShowSidebar((prev) => !prev)}
      >
        <Hamburger />
      </button>
      {showSidebar && (
        <div
          className={` h-screen w-1/6 justify-center  border-r bg-white border-newborder flex items-center max-lg:absolute max-lg:w-full max-lg:z-40 `}
        >
          <ul className="flex flex-col w-10/12  gap-4">
            {links.map((item) => (
              <li key={item.name} className="flex w-full flex-col">
                {" "}
                <NavLink
                  to={item?.path}
                  target={item.blank ? "_blank" : ""}
                  onClick={() => setShowSidebar(false)}
                  className={`px-4 py-2 flex items-center  w-full gap-4 max-xl:gap-2 bg-gray-400 rounded-lg ${
                    lastPath === item.path
                      ? "bg-gray-500 text-white"
                      : "bg-white border border-newborder text-black"
                  }`}
                >
                  {item.icon &&
                    React.cloneElement(item?.icon, {
                      className: `${
                        lastPath === item.path ? "text-white " : ""
                      }size-8 max-2xl:size-6 max-xl:size-5`,
                    })}

                  <span className="text-xl truncate max-2xl:text-lg max-xl:text-xs">
                    {item.name}
                  </span>
                  {item?.category?.length > 0 && (
                    <span className="ml-auto cursor-pointer">
                      <RightArrow className={"rotate-90 max-xl:size-4"} />
                    </span>
                  )}
                </NavLink>
                {item?.category?.length > 0 && (
                  <ul className="mt-2 ml-6 gap-2 flex flex-col">
                    {item?.category?.map((subItem, index) => (
                      <NavLink
                        to={subItem.path}
                        key={index}
                        onClick={() => setShowSidebar(false)}
                        className={`px-4 max-2xl:text-xs py-2  ${
                          subItem.path === lastPath
                            ? "bg-gray-500 text-white"
                            : "bg-gray-200"
                        }  rounded-lg`}
                      >
                        {subItem.name}
                      </NavLink>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className=" flex-1 w-full">
        <Outlet />
      </div>
    </div>
  );
};
