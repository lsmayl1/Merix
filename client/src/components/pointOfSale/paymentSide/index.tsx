import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Cash from "../../../assets/Icons/Cash";
import CreditCard from "../../../assets/Icons/CreditCard";
import { Payment } from "../../../assets/Icons/Payment";
import Return from "../../../assets/Icons/Return";
export const PaymentSide = ({ data = [] }) => {
  const { t } = useTranslation();
  const { paymentMethod, setPaymentMethod } = useState("cash");
  const barcodeRef = React.useRef(null);

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
    barcodeRef.current?.focus();
  };

  return (
    <div className="flex flex-col h-fit justify-center gap-4">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-2xl font-medium">{t("total")}</span>
          <span className="text-3xl font-medium">
            {data?.total?.toFixed(2) || "0.00"} ₼
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-2 ">
        <div className="flex flex-col gap-2 border-mainBorder border rounded-lg w-full p-2 font-medium ">
          <div className="flex justify-between items-center">
            <div className="flex gap-2 items-center">
              <h1>{t("receivedAmount")}</h1>{" "}
              <span className="bg-gray-100 rounded-full px-2  border border-mainBorder text-gray-400">
                /
              </span>
            </div>
            <div className="flex items-center gap-2">
              <input
                className="text-xl text-right"
                step={0.01}
                // ref={receivedInput}
                // type="number"
                // onChange={(e) =>
                //   setReceivedAmount(e.target.value.replace(",", "."))
                // }
                // value={receivedAmount}
              />
              <span> ₼</span>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <h1>{t("amountToReturn")}</h1>
            {/* <span className="text-xl">{AmountToReturn.toFixed(2)} ₼</span> */}
          </div>
        </div>
        <div className="flex items-center gap-2 w-full">
          <div className="flex gap-2 items-center w-full h-full">
            <button
              //   onClick={() => handlePaymentMethodChange("cash")}
              className={`flex flex-col gap-1 items-center border  px-6 py-1 rounded-lg w-full ${
                paymentMethod == "cash"
                  ? "border-blue-500 bg-blue-50"
                  : " border-mainBorder"
              }`}
            >
              <Cash
                className={`${
                  paymentMethod == "cash" ? "text-blue-500" : "text-black"
                }`}
              />
              <span
                className={`${
                  paymentMethod == "cash" ? "text-blue-500" : "text-black"
                }`}
              >
                {t("cash")}
              </span>
            </button>
            <button
              //   onClick={() => handlePaymentMethodChange("card")}
              className={`flex flex-col gap-1 items-center border ${
                paymentMethod == "card"
                  ? "border-blue-500 bg-blue-50"
                  : " border-mainBorder"
              }  px-6 py-1 rounded-lg w-full`}
            >
              <CreditCard
                className={`${
                  paymentMethod == "card" ? "text-blue-500" : "text-black"
                }`}
              />
              <span
                className={`${
                  paymentMethod == "card" ? "text-blue-500" : "text-black"
                }`}
              >
                {t("card")}
              </span>
            </button>
          </div>
          <button
            // disabled={data.length == 0 || postLoading}
            // onClick={() => handleSubmitSale("return")}
            className="flex justify-center  gap-2 items-center border border-mainBorder px-6 h-full rounded-lg w-full"
          >
            <Return className={"text-red-500"} />
            <span className="text-red-500">{t("Qaytarılma")}</span>
          </button>
        </div>
        <div className="flex items-center gap-2 w-full h-full">
          <button
            // disabled={data.length == 0 || postLoading}
            // onClick={() => handleSubmitSale("sale")}
            className="flex justify-center text-2xl gap-2 items-center border border-mainBorder px-6 h-16 rounded-lg w-full"
          >
            <Payment className={"size-8 text-green-500"} />
            <span className="text-green-500"> {t("Satış")}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
