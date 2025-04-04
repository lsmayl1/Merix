import React, { useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import Home, { Dashboard } from "../../assets/Home";
import { ProductIcon } from "../../assets/ProductIcon";
import { PosIcon } from "../../assets/posIcon";
import { ReportIcon } from "../../assets/ReportIcon";
import { ScaleIcon } from "../../assets/ScaleIcon";
import { RightArrow } from "../../assets/Arrows";

export const Layout = () => {
  const location = useLocation();
  const pathname = location.pathname;
  const lastPath = pathname.split("/").pop();
  const [openCategory, setOpenCategory] = useState(false);
  const [openedCategory, setOpenedCategory] = useState(null);
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
    <div className="h-screen w-full flex  z-50 ">
      <div className="px-8 h-screen  border-r  border-newborder flex items-center ">
        <ul className="flex flex-col  gap-6">
          {links.map((item) => (
            <li key={item.name} className="flex w-full flex-col">
              {" "}
              <NavLink
                to={item?.path}
                target={item.blank ? "_blank" : ""}
                className={`px-4 py-2 flex items-center  w-full gap-4 bg-gray-400 rounded-lg text-xl ${
                  lastPath === item.path
                    ? "bg-gray-500 text-white"
                    : "bg-white border border-newborder text-black"
                }`}
              >
                {item.icon &&
                  React.cloneElement(item?.icon, {
                    className: `${
                      lastPath === item.path ? "text-white " : ""
                    }size-8`,
                  })}

                <span className="text-2xl">{item.name}</span>
                {item?.category?.length > 0 && (
                  <span className="ml-auto cursor-pointer">
                    <RightArrow className={"rotate-90"} />
                  </span>
                )}
              </NavLink>
              {item?.category?.length > 0 && (
                <ul className="mt-2 ml-6 gap-2 flex flex-col">
                  {item?.category?.map((subItem, index) => (
                    <NavLink
                      to={subItem.path}
                      key={index}
                      className={`px-4 text-nowrap py-2 text-lg ${
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
      <div className=" flex-1 w-full">
        <Outlet />
      </div>
    </div>
  );
};
