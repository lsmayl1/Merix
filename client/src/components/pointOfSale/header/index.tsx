import React from "react";
import { Plus } from "../../../assets/Icons/Plus";
import { NavLink } from "react-router-dom";
import { ChartPie } from "../../../assets/Icons/ChartPie";
import { Logout } from "../../../assets/Icons/Logout";
import { BarcodeInput } from "../barcodeInput";
import { SearchModal } from "../searchModal";
import { useTranslation } from "react-i18next";

export const PosHeader = () => {
  const { t } = useTranslation();
  return (
    <div className="flex gap-4 items-center justify-between  ">
      <SearchModal
      // data={searchData}
      // setQuery={setQuery}
      // query={query}
      // barcodeRef={barcodeRef}
      // handleAdd={handleChangeQtyAndFocus}
      />
      <div className="flex items-center gap-6">
        <BarcodeInput
        //   ref={barcodeRef}
        //   handleBarcode={(id) => handleChangeQty(id, "increase")}
        />
      </div>
    </div>
  );
};
