import React from "react";
import LogoFrame from "../../assets/Logo/LogoFrame";
import Dashboard from "../../assets/Sidebar/Dashboard";
import Companies from "../../assets/Sidebar/Companies";
import Database from "../../assets/Sidebar/Database";
import { NavLink } from "react-router-dom";

const AccountIcon = ({ className = "" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
  </svg>
);

const ChevronLeft = ({ className = "" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 18l-6-6 6-6" />
  </svg>
);

const DemoIcon = ({ className = "" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="16" rx="2" />
    <path d="M8 2v4M16 2v4M3 10h18M8 14h2M14 14h2M8 18h2M14 18h2" />
  </svg>
);

const NAV = [
  { name: "Dashboard",      link: "/dashboard",      icon: <Dashboard /> },
  { name: "Companies",      link: "/companies",       icon: <Companies /> },
  { name: "Demo Requests",  link: "/demo-requests",   icon: <DemoIcon /> },
  { name: "Database",       link: "/database",        icon: <Database /> },
];

const BOTTOM = [
  { name: "Account", link: "/account", icon: <AccountIcon /> },
];

const navItem = (isActive: boolean, collapsed: boolean) =>
  `flex items-center gap-3 rounded-lg px-2 py-2 text-sm font-medium transition-colors duration-150 ${
    collapsed ? "justify-center" : ""
  } ${
    isActive
      ? "bg-brand text-white shadow-sm"
      : "text-text-secondary hover:bg-bg-muted hover:text-text-primary"
  }`;

export const Sidebar = ({
  collapsed,
  setCollapsed,
}: {
  collapsed: boolean;
  setCollapsed: () => void;
}) => (
  <div
    className={`flex flex-col flex-none transition-all duration-200 ${
      collapsed ? "w-[60px]" : "w-52"
    } bg-bg-surface border-r border-border`}
  >
    {/* Logo area */}
    <div className={`flex items-center h-14 px-3 border-b border-border shrink-0 ${collapsed ? "justify-center" : "justify-between"}`}>
      <div className="flex items-center gap-2.5">
        <LogoFrame className="size-7 shrink-0" />
        {!collapsed && (
          <span className="text-sm font-bold text-text-primary tracking-tight">Merix</span>
        )}
      </div>
      {!collapsed && (
        <button
          onClick={setCollapsed}
          className="size-6 flex items-center justify-center rounded-md hover:bg-bg-muted text-text-muted hover:text-text-secondary transition-colors"
        >
          <ChevronLeft className="size-3.5" />
        </button>
      )}
    </div>

    {/* Main nav */}
    <nav className="flex flex-col gap-0.5 flex-1 p-2 overflow-y-auto">
      {NAV.map((item) => (
        <NavLink
          key={item.link}
          to={item.link}
          title={collapsed ? item.name : undefined}
          className={({ isActive }) => navItem(isActive, collapsed)}
        >
          {({ isActive }) => (
            <>
              {React.cloneElement(item.icon, {
                className: `size-[18px] shrink-0 ${isActive ? "text-white" : "text-text-muted"}`,
              })}
              {!collapsed && <span className="truncate">{item.name}</span>}
            </>
          )}
        </NavLink>
      ))}
    </nav>

    {/* Bottom nav */}
    <div className="flex flex-col gap-0.5 p-2 border-t border-border shrink-0">
      {BOTTOM.map((item) => (
        <NavLink
          key={item.link}
          to={item.link}
          title={collapsed ? item.name : undefined}
          className={({ isActive }) => navItem(isActive, collapsed)}
        >
          {({ isActive }) => (
            <>
              {React.cloneElement(item.icon, {
                className: `size-[18px] shrink-0 ${isActive ? "text-white" : "text-text-muted"}`,
              })}
              {!collapsed && <span className="truncate">{item.name}</span>}
            </>
          )}
        </NavLink>
      ))}
    </div>
  </div>
);
