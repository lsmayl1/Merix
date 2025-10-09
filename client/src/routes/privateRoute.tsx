import React from "react";
import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";

export const PrivateRoute = () => {
  const { token } = useSelector((state: any) => state.authService);

  // if (!token) {
  //   return <div>Not Authorized</div>;
  // }

  return <Outlet />;
};
