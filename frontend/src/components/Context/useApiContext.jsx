import { useContext } from "react";
import { ApiContext } from "./ApiContex";
export const useApi = () => {
  const context = useContext(ApiContext);
  if (!context) {
    throw Error("useApi Error");
  }

  return context;
};
