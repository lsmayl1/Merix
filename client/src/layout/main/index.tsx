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
    <div className="bg-bg-page flex h-screen overflow-hidden">
      <Sidebar
        collapsed={collapsed}
        setCollapsed={() => {
          setCollapsed(!collapsed);
          setTimeout(() => window.dispatchEvent(new Event("resize")), 50);
        }}
      />
      <div className="flex-1 flex flex-col min-w-0 min-h-0 overflow-hidden">
        <Header collapsed={collapsed} setCollapsed={() => setCollapsed(!collapsed)} />
        <main className="flex-1 overflow-auto p-4 min-h-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
