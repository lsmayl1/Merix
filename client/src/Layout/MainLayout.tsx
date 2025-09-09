import React from "react";
import { Sidebar } from "../Components/Sidebar";
import { Outlet } from "react-router-dom";
import { Header } from "../Components/Header";

export const MainLayout = () => {
  const [collapsed, setCollapsed] = React.useState(false);
  return (
    <div className="bg-bg flex h-screen p-2 gap-2">
      <Sidebar
        collapsed={collapsed}
        setCollapsed={() => setCollapsed(!collapsed)}
      />
      <div className="flex-1  gap-2 flex flex-col ">
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
