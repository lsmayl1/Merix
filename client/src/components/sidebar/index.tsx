import React from "react";
import LogoFrame from "../../assets/Logo/LogoFrame";
import LogoName from "../../assets/Logo/LogoName";
import Dashboard from "../../assets/Sidebar/Dashboard";
import Store from "../../assets/Sidebar/Store";
import Collapse from "../../assets/Navigation/Collapse";
import { NavLink } from "react-router-dom";
import Sales from "../../assets/Sidebar/Sales";
import Transactions from "../../assets/Sidebar/Transactions";
import Employers from "../../assets/Sidebar/Employers";
import Products from "../../assets/Sidebar/Products";
import Suppliers from "../../assets/Sidebar/Suppliers";
import LogoMain from "../../assets/Logo/LogoMain";
import { PointOfSale } from "../../assets/Icons/PointOfSale";

export const Sidebar = ({
  collapsed,
  setCollapsed,
}: {
  collapsed: boolean;
  setCollapsed: () => void;
}) => {
  const sidebar = [
    { name: "Dashboard", link: "/dashboard", icon: <Dashboard /> },
    // {
    //   name: "Store",
    //   link: "/store",
    //   icon: <Store />,
    //   // category: [
    //   //   { name: "Store 1", link: "/store/1" },
    //   //   { name: "Store 2", link: "/store/2" },
    //   // ],
    // },
    {
      name: "Sales",
      link: "/sales",
      icon: <Sales />,
    },
    {
      name: "Transactions",
      link: "/transactions",
      icon: <Transactions />,
    },
    {
      name: "Employees",
      link: "/employees",
      icon: <Employers />,
    },
    {
      name: "Products",
      link: "/products",
      icon: <Products />,
    },
    {
      name: "Suppliers",
      link: "/suppliers",
      icon: <Suppliers />,
    },
    {
      name: "Point of Sale",
      link: "/point-of-sale",
      icon: <PointOfSale />,
    },
  ];
  return (
    <div
      className={`flex flex-col flex-none transition-width duration-200 ${
        collapsed ? "w-16" : "w-48"
      }  bg-white p-2 py-4`}
    >
      <div
        className={`flex items-center gap-2 ${
          collapsed ? "justify-center" : " justify-between"
        } `}
      >
        <div className="flex items-center gap-2">
          <LogoMain className="size-6" />
          {!collapsed && <LogoName className="text-black w-14" />}
        </div>
        {!collapsed && (
          <button
            onClick={setCollapsed}
            className=" p-2 bg-border/10 rounded-lg cursor-pointer"
          >
            <Collapse
              className={` text-gray-500 ${
                collapsed ? "rotate-270 size-2" : "size-3 rotate-90"
              }`}
            />
          </button>
        )}
      </div>
      <div className="flex flex-col gap-1 mt-10">
        {sidebar.map((item, i) => (
          <div key={i}>
            <NavLink
              to={item.link}
              className={({ isActive }) =>
                `flex justify-between items-center hover:bg-border/10 ${
                  isActive && "bg-gray-300 text-white"
                }	 rounded-lg p-2`
              }
            >
              {({ isActive }) => (
                <div
                  key={item.name}
                  className={`flex items-center gap-4  ${
                    isActive ? "text-gray-700" : "text-gray-500"
                  } `}
                >
                  {React.cloneElement(item.icon, {
                    className: `size-6  ${
                      isActive ? "text-gray-700" : "text-gray-500"
                    }`,
                  })}
                  {!collapsed && <span>{item.name}</span>}
                </div>
              )}
            </NavLink>

            {!collapsed
              ? item?.category?.map((cat) => (
                  <a
                    href={cat.link}
                    key={cat.name}
                    className="flex items-center gap-4 text-gray-500 hover:bg-border/10 p-2 rounded-lg pl-10"
                  >
                    <span>{cat.name}</span>
                  </a>
                ))
              : ""}
          </div>
        ))}
      </div>
    </div>
  );
};
