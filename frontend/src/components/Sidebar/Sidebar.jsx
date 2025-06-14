import React, { useEffect, useState } from "react";
import Dashboard from "../../assets/Sidebar/Dashboard";
import Box from "../../assets/Sidebar/Box";
import Reports from "../../assets/Sidebar/Reports";
import { NavLink } from "react-router-dom";
import { Kart } from "../../assets/Sidebar/Kart";

const links = [
  { name: "Dashboard", blank: false, path: "", icon: <Dashboard /> },
  { name: "Products", blank: false, path: "products", icon: <Box /> },
  {
    name: "Reports",
    blank: false,
    icon: <Reports />,
    path: "reports",
    category: [
      { name: "Sale Report", path: "satis-hesabati" },
      {
        name: "Products Sold Report",
        path: "satilmis-mehsul-hesabati",
      },
    ],
  },
  { name: "Pos", blank: true, path: "pos", icon: <Kart /> },
];
export const Sidebar = (prop) => {
  return (
    <div
      className={`w-full justify-center flex py-12 ${prop.className}
      `}
    >
      <ul className="flex flex-col  gap-2">
        {links.map((link, index) => (
          <div className="flex flex-col gap-1 " key={index}>
            <NavLink
              to={link.path}
              className={({ isActive }) =>
                `flex items-center gap-4 border-mainBorder py-2 ${
                  isActive
                    ? "bg-white border border-mainBorder"
                    : "hover:bg-white"
                } px-4 rounded-lg transition-colors duration-200`
              }
            >
              {({ isActive }) => (
                <>
                  {link.icon &&
                    React.cloneElement(link.icon, {
                      className: ` size-8 ${
                        isActive ? "text-black" : "text-mainText"
                      } `,
                    })}
                  <span
                    className={`${
                      isActive ? "text-black" : "text-mainText"
                    } text-lg font-medium`}
                  >
                    {link.name}
                  </span>
                </>
              )}
            </NavLink>

            {link.category && link.category.length > 0 && (
              <ul className="border-l  border-mainBorder ml-7.5 ">
                {link.category.map((subLink, subIndex) => (
                  <NavLink
                    key={subIndex}
                    to={`${link.path}/${subLink.path}`}
                    className={({ isActive }) =>
                      `flex items-center gap-4 py-2 ${
                        isActive
                          ? "bg-white border border-mainBorder"
                          : "hover:bg-white"
                      } px-4 rounded-lg transition-colors duration-200`
                    }
                  >
                    {({ isActive }) => (
                      <span
                        className={` text-lg font-medium text-nowrap ${
                          isActive ? "text-black" : "text-mainText"
                        }`}
                      >
                        {subLink.name}
                      </span>
                    )}
                  </NavLink>
                ))}
              </ul>
            )}
          </div>
        ))}
      </ul>
    </div>
  );
};
