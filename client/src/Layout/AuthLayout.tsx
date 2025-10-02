import React from "react";
import { Outlet } from "react-router-dom";
import LogoName from "../assets/Logo/LogoName";
import LogoMain from "../assets/Logo/LogoMain";

export const AuthLayout = () => {
  return (
    <div className=" flex flex-col p-4 gap-4">
      <LogoName />
      <div className="flex items-center gap-4 flex-col">
        <LogoMain />
        <Outlet />
      </div>
    </div>
  );
};
