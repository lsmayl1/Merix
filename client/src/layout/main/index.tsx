import React, { useEffect } from "react";
import { Sidebar } from "../../components/sidebar/index.tsx";
import { Outlet } from "react-router-dom";
import { Header } from "../../components/header/index.tsx";

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
    <div className="bg-bg flex h-screen max-md:gap-0">
      <Sidebar
        collapsed={collapsed}
        setCollapsed={() => {
          setCollapsed(!collapsed);

          setTimeout(() => window.dispatchEvent(new Event("resize")), 50);
        }}
      />
      <div className="flex-1 gap-2 flex flex-col p-2 min-w-0">
        <Header
          collapsed={collapsed}
          setCollapsed={() => setCollapsed(!collapsed)}
        />
        <div className="overflow-auto pr-1 my-container flex-1 min-w-0">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
