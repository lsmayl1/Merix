import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

export const AuthLayout = () => {
  const { isAuthenticated } = useSelector((state: any) => state.authService);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-[#f4f6fa] flex items-center justify-center p-4">
      <Outlet />
    </div>
  );
};
