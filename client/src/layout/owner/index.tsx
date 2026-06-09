import React, { useEffect } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/services/authService";
import { useGetOwnerMeQuery } from "../../redux/features/owner/ownerSlice.tsx";
import LogoFrame from "../../assets/Logo/LogoFrame";

const NAV = [
  { name: "Dashboard",    link: "/owner/dashboard",    icon: (cls: string) => <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg> },
  { name: "Sales",        link: "/owner/sales",         icon: (cls: string) => <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg> },
  { name: "Reports",      link: "/owner/reports",       icon: (cls: string) => <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="M18 17V9M13 17V5M8 17v-3"/></svg> },
];

const navItem = (isActive: boolean) =>
  `flex items-center gap-3 rounded-lg px-2 py-2 text-sm font-medium transition-colors ${
    isActive ? "bg-brand text-white shadow-sm" : "text-text-secondary hover:bg-bg-muted hover:text-text-primary"
  }`;

export const OwnerLayout = () => {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const { data }  = useGetOwnerMeQuery(undefined);
  const [collapsed, setCollapsed] = React.useState(false);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 435px)");
    setCollapsed(media.matches);
    const listener = (e: MediaQueryListEvent) => setCollapsed(e.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="bg-bg-page flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div className={`flex flex-col flex-none transition-all duration-200 ${collapsed ? "w-[60px]" : "w-52"} bg-bg-surface border-r border-border`}>
        <div className={`flex items-center h-14 px-3 border-b border-border shrink-0 ${collapsed ? "justify-center" : "justify-between"}`}>
          <div className="flex items-center gap-2.5">
            <LogoFrame className="size-7 shrink-0" />
            {!collapsed && <span className="text-sm font-bold text-text-primary tracking-tight">Merix</span>}
          </div>
          {!collapsed && (
            <button onClick={() => setCollapsed(true)} className="size-6 flex items-center justify-center rounded-md hover:bg-bg-muted text-text-muted transition-colors">
              <svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
            </button>
          )}
          {collapsed && (
            <button onClick={() => setCollapsed(false)} className="size-6 flex items-center justify-center rounded-md hover:bg-bg-muted text-text-muted transition-colors">
              <svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
            </button>
          )}
        </div>

        {/* Company name */}
        {!collapsed && data?.client && (
          <div className="px-3 py-2.5 border-b border-border">
            <p className="text-xs text-text-muted">Company</p>
            <p className="text-sm font-semibold text-text-primary truncate">{data.client.name}</p>
          </div>
        )}

        <nav className="flex flex-col gap-0.5 flex-1 p-2 overflow-y-auto">
          {NAV.map((item) => (
            <NavLink key={item.link} to={item.link} title={collapsed ? item.name : undefined}
              className={({ isActive }) => navItem(isActive)}>
              {({ isActive }) => (
                <>
                  {item.icon(`size-[18px] shrink-0 ${isActive ? "text-white" : "text-text-muted"}`)}
                  {!collapsed && <span className="truncate">{item.name}</span>}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="flex flex-col gap-0.5 p-2 border-t border-border shrink-0">
          {!collapsed && data?.user && (
            <div className="px-2 py-1.5 mb-1">
              <p className="text-xs font-medium text-text-primary truncate">{data.user.firstName} {data.user.lastName}</p>
              <p className="text-xs text-text-muted truncate">{data.user.email}</p>
            </div>
          )}
          <button onClick={handleLogout}
            className="flex items-center gap-3 rounded-lg px-2 py-2 text-sm font-medium text-text-secondary hover:bg-bg-muted hover:text-danger transition-colors w-full">
            <svg className="size-[18px] shrink-0 text-text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/>
            </svg>
            {!collapsed && <span>Sign out</span>}
          </button>
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 min-h-0 overflow-hidden">
        <div className="h-14 border-b border-border bg-bg-surface flex items-center px-4 shrink-0">
          {collapsed && (
            <button onClick={() => setCollapsed(false)} className="mr-3 text-text-muted hover:text-text-primary">
              <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            </button>
          )}
          <span className="text-sm font-semibold text-text-primary">{data?.client?.name ?? "Dashboard"}</span>
        </div>
        <main className="flex-1 overflow-auto p-4 min-h-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
