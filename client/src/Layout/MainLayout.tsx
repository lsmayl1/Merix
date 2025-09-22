import React, { useEffect } from "react";
import { Sidebar } from "../Components/Sidebar";
import { Outlet } from "react-router-dom";
import { Header } from "../Components/Header";

export const MainLayout = () => {
  const [collapsed, setCollapsed] = React.useState(false);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 435px)");

    setCollapsed(media.matches);

    const listener = (e: MediaQueryListEvent) => setCollapsed(e.matches);
    media.addEventListener("change", listener);

    return () => media.removeEventListener("change", listener);
  }, []);

  return (
    <div className="bg-bg flex h-screen  gap-2 max-md:gap-0">
      <Sidebar
        collapsed={collapsed}
        setCollapsed={() => setCollapsed(!collapsed)}
      />
      <div className="flex-8  gap-2 flex flex-col p-2">
        <Header
          collapsed={collapsed}
          setCollapsed={() => setCollapsed(!collapsed)}
        />
        <div className="overflow-auto pr-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
