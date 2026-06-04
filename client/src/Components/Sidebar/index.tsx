import React from "react";
import LogoMain from "../../assets/Logo/LogoMain";
import LogoName from "../../assets/Logo/LogoName";
import Dashboard from "../../assets/Sidebar/Dashboard";
import Companies from "../../assets/Sidebar/Companies";
import Setup from "../../assets/Sidebar/Setup";
import Database from "../../assets/Sidebar/Database";
import { NavLink } from "react-router-dom";

const AccountIcon = ({ className = "" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
  </svg>
);

const NAV = [
  { name: "Dashboard",  link: "/dashboard",  icon: <Dashboard /> },
  { name: "Companies",  link: "/companies",  icon: <Companies /> },
  { name: "New Setup",  link: "/setup",      icon: <Setup /> },
  { name: "Database",   link: "/database",   icon: <Database /> },
];

const BOTTOM = [
  { name: "Account", link: "/account", icon: <AccountIcon /> },
];

export const Sidebar = ({
  collapsed,
  setCollapsed,
}: {
  collapsed: boolean;
  setCollapsed: () => void;
}) => (
  <div className={`flex flex-col flex-none transition-all duration-200 ${
    collapsed ? "w-16" : "w-52"
  } bg-white border-r border-[#e2e8f0] p-3`}>

    {/* Logo */}
    <div className={`flex items-center mb-6 px-1 ${collapsed ? "justify-center" : "justify-between"}`}>
      <div className="flex items-center gap-2">
        <LogoMain className="size-6 shrink-0" />
        {!collapsed && <LogoName className="w-14 text-[#0f172a]" />}
      </div>
      {!collapsed && (
        <button onClick={setCollapsed}
          className="size-7 flex items-center justify-center rounded-lg hover:bg-[#f1f5f9] text-[#94a3b8] hover:text-[#64748b] transition-colors">
          <svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
      )}
    </div>

    {/* Main nav */}
    <nav className="flex flex-col gap-0.5 flex-1">
      {NAV.map((item) => (
        <NavLink key={item.link} to={item.link} title={collapsed ? item.name : undefined}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-lg px-2 py-2 text-sm font-medium transition-colors ${
              collapsed ? "justify-center" : ""
            } ${isActive ? "bg-[#0f172a] text-white" : "text-[#64748b] hover:bg-[#f1f5f9] hover:text-[#0f172a]"}`
          }
        >
          {({ isActive }) => (
            <>
              {React.cloneElement(item.icon, {
                className: `size-5 shrink-0 ${isActive ? "text-white" : "text-[#94a3b8]"}`,
              })}
              {!collapsed && <span className="truncate">{item.name}</span>}
            </>
          )}
        </NavLink>
      ))}
    </nav>

    {/* Bottom nav — account */}
    <div className="flex flex-col gap-0.5 pt-3 border-t border-[#e2e8f0]">
      {BOTTOM.map((item) => (
        <NavLink key={item.link} to={item.link} title={collapsed ? item.name : undefined}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-lg px-2 py-2 text-sm font-medium transition-colors ${
              collapsed ? "justify-center" : ""
            } ${isActive ? "bg-[#0f172a] text-white" : "text-[#64748b] hover:bg-[#f1f5f9] hover:text-[#0f172a]"}`
          }
        >
          {({ isActive }) => (
            <>
              {React.cloneElement(item.icon, {
                className: `size-5 shrink-0 ${isActive ? "text-white" : "text-[#94a3b8]"}`,
              })}
              {!collapsed && <span className="truncate">{item.name}</span>}
            </>
          )}
        </NavLink>
      ))}
    </div>
  </div>
);
