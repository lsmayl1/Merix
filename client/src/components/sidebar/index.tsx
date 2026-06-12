import React, { useState, useMemo } from "react";
import LogoFrame from "../../assets/Logo/LogoFrame";
import Dashboard from "../../assets/Sidebar/Dashboard";
import Companies from "../../assets/Sidebar/Companies";
import Database from "../../assets/Sidebar/Database";
import { NavLink, useLocation } from "react-router-dom";
import { useGetClientsQuery } from "../../redux/features/clients/clientsSlice.tsx";

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

const ChevronDown = ({ className = "" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 9l6 6 6-6" />
  </svg>
);

const DemoIcon = ({ className = "" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="16" rx="2" />
    <path d="M8 2v4M16 2v4M3 10h18M8 14h2M14 14h2M8 18h2M14 18h2" />
  </svg>
);

const ReportsIcon = ({ className = "" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 3v18h18" />
    <path d="M18 17V9M13 17V5M8 17v-3" />
  </svg>
);

const LogsIcon = ({ className = "" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="20" height="18" rx="2" />
    <path d="M7 8l2 2-2 2M11 12h6" />
  </svg>
);

const DownloadIcon = ({ className = "" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3v13M7 11l5 5 5-5" />
    <path d="M3 19h18" />
  </svg>
);

const NAV = [
  { name: "Dashboard",      link: "/dashboard",      icon: <Dashboard /> },
  { name: "Companies",      link: "/companies",       icon: <Companies />, id: "companies" },
  { name: "Reports",        link: "/reports",         icon: <ReportsIcon /> },
  { name: "Demo Requests",  link: "/demo-requests",   icon: <DemoIcon /> },
  { name: "Database",       link: "/database",        icon: <Database /> },
  { name: "Server Logs",   link: "/server-logs",     icon: <LogsIcon /> },
  { name: "Download",      link: "/download",         icon: <DownloadIcon /> },
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

const initials = (name = "") =>
  name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase() || "?";

const CompaniesNav = ({ collapsed }: { collapsed: boolean }) => {
  const location = useLocation();
  const onCompanies = location.pathname.startsWith("/companies");
  const [open, setOpen] = useState(onCompanies);
  const [search, setSearch] = useState("");
  const { data: companies = [] } = useGetClientsQuery(undefined, { pollingInterval: 60000 });

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return companies;
    return companies.filter(
      (c: any) => c.name?.toLowerCase().includes(q) || c.email?.toLowerCase().includes(q),
    );
  }, [companies, search]);

  // Collapsed sidebar → just the icon link, no submenu
  if (collapsed) {
    return (
      <NavLink to="/companies" title="Companies" className={({ isActive }) => navItem(isActive, true)}>
        {({ isActive }) => (
          <Companies className={`size-[18px] shrink-0 ${isActive ? "text-white" : "text-text-muted"}`} />
        )}
      </NavLink>
    );
  }

  return (
    <div className="flex flex-col">
      {/* Parent row: link to overview + expand toggle */}
      <div
        className={`flex items-center gap-1 rounded-lg pr-1 ${
          onCompanies ? "text-text-primary" : "text-text-secondary"
        }`}
      >
        <NavLink
          to="/companies"
          end
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-lg px-2 py-2 text-sm font-medium transition-colors duration-150 flex-1 ${
              isActive
                ? "bg-brand text-white shadow-sm"
                : "hover:bg-bg-muted hover:text-text-primary"
            }`
          }
        >
          {({ isActive }) => (
            <>
              <Companies className={`size-[18px] shrink-0 ${isActive ? "text-white" : "text-text-muted"}`} />
              <span className="truncate">Companies</span>
            </>
          )}
        </NavLink>
        <button
          onClick={() => setOpen((o) => !o)}
          title={open ? "Collapse" : "Expand"}
          className="size-6 flex items-center justify-center rounded-md hover:bg-bg-muted text-text-muted shrink-0"
        >
          <ChevronDown className={`size-3.5 transition-transform ${open ? "" : "-rotate-90"}`} />
        </button>
      </div>

      {/* Company list */}
      {open && (
        <div className="mt-1 ml-2 pl-2 border-l border-border flex flex-col gap-0.5">
          {companies.length > 8 && (
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search…"
              className="mb-1 w-full px-2 py-1 text-xs border border-border rounded-md focus:outline-none focus:border-brand bg-bg-surface text-text-primary placeholder:text-text-muted"
            />
          )}
          <div className="max-h-64 overflow-y-auto flex flex-col gap-0.5">
            {filtered.length === 0 ? (
              <span className="px-2 py-1.5 text-xs text-text-muted">No companies</span>
            ) : (
              filtered.map((c: any) => (
                <NavLink
                  key={c.id}
                  to={`/companies/${c.id}`}
                  title={c.name}
                  className={({ isActive }) =>
                    `flex items-center gap-2 rounded-md px-2 py-1.5 text-xs font-medium transition-colors ${
                      isActive
                        ? "bg-brand text-white"
                        : "text-text-secondary hover:bg-bg-muted hover:text-text-primary"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span
                        className={`size-5 rounded flex items-center justify-center text-[10px] font-bold shrink-0 ${
                          isActive ? "bg-white/20 text-white" : "bg-bg-muted text-text-secondary"
                        }`}
                      >
                        {initials(c.name)}
                      </span>
                      <span className="truncate flex-1">{c.name}</span>
                      <span
                        className={`size-1.5 rounded-full shrink-0 ${
                          c.status === "active" ? "bg-success" : "bg-danger"
                        }`}
                      />
                    </>
                  )}
                </NavLink>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

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
      {NAV.map((item) =>
        item.id === "companies" ? (
          <CompaniesNav key="companies" collapsed={collapsed} />
        ) : (
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
        )
      )}
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
