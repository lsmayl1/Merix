import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Cash from "../../../assets/Icons/Cash";
import CreditCard from "../../../assets/Icons/CreditCard";
import { Payment } from "../../../assets/Icons/Payment";
import Collapse from "../../../assets/Icons/Collapse";
import { set } from "react-hook-form";
export const PaymentSide = ({ data = [], handleBack, value = 40 }) => {
  const { t } = useTranslation();
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [cash, setCash] = useState("0");
  const [card, setCard] = useState("0");

  const buttons = ["7", "8", "9", "4", "5", "6", "1", "2", "3", ".", "0", "⌫"];

  const applyValue = (key: string) => {
    let value = paymentMethod === "cash" ? cash : card;

    // Təmizlə
    if (key === "C") {
      paymentMethod === "cash" ? setCash("0") : setCard("0");
      return;
    }

    // Backspace
    if (key === "⌫") {
      if (value.length <= 1) {
        paymentMethod === "cash" ? setCash("0") : setCard("0");
      } else {
        paymentMethod === "cash"
          ? setCash(value.slice(0, -1))
          : setCard(value.slice(0, -1));
      }
      return;
    }

    // "." yalnız bir dəfə
    if (key === "." && value.includes(".")) return;

    // Ondalık max 2
    if (value.includes(".")) {
      const [, decimals] = value.split(".");
      if (decimals.length >= 2) return;
    }

    // 👉 ƏGƏR value "0"-dırsa, onu əvəz et
    const newValue = value === "0" && key !== "." ? key : value + key;

    paymentMethod === "cash" ? setCash(newValue) : setCard(newValue);
  };
  const handleAllValue = () => {
    if (paymentMethod === "cash") {
      setCash(value.toString());
    } else {
      setCard(value.toString());
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= "0" && e.key <= "9") {
        applyValue(e.key);
      }

      if (e.key === "." || e.key === ",") {
        applyValue(".");
      }

      if (e.key === "Backspace") {
        applyValue("⌫");
      }

      if (e.key === "Delete") {
        applyValue("C");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [card, cash, paymentMethod]);

  return (
    <div className="flex flex-col h-full justify-between ">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-4">
          <Collapse
            className="inline size-6 mr-2 cursor-pointer"
            onClick={handleBack}
          />
        </div>
      </div>
      <div className="flex items-center justify-center text-5xl gap-4 font-medium">
        <span className=" text-nowrap">{value.toFixed(2) || "50.00"} ₼</span>
      </div>
      <div className="flex flex-col justify-end w-full gap-2  rounded-lg  p-2 font-medium ">
        <div
          onClick={() => setPaymentMethod("cash")}
          className={`flex w-full gap-8 justify-between  items-center border cursor-pointer ${
            paymentMethod === "cash" ? "border-blue-600" : "border-gray-200"
          } w-fit p-4 rounded-lg `}
        >
          <div className="flex gap-2 items-center">
            <Cash className="size-6" />
            <h1>{t("Cash")}</h1>{" "}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xl">
              {Number(cash).toFixed(2) || "0.00"} ₼
            </span>
          </div>
        </div>
        <div
          onClick={() => setPaymentMethod("card")}
          className={`flex gap-8 items-center border justify-between cursor-pointer w-full ${
            paymentMethod === "card" ? "border-blue-600" : "border-gray-200"
          } w-fit p-4 rounded-lg `}
        >
          <div className="flex gap-2 items-center">
            <CreditCard className="size-6 mr-2" />
            <h1>{t("Card")}</h1>{" "}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xl">
              {Number(card).toFixed(2) || "0.00"} ₼
            </span>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2 ">
        <div className="w-full">
          <div className="grid grid-cols-3 gap-2">
            {buttons.map((btn) => (
              <button
                key={btn}
                onClick={() => applyValue(btn)}
                className="h-24 text-2xl font-medium bg-gray-200 rounded hover:bg-gray-300 active:scale-95"
              >
                {btn}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2 w-full h-full">
          <button
            onClick={handleAllValue}
            className="flex justify-center text-2xl gap-2 items-center border border-gray-200 px-6 h-16 rounded-lg w-full"
          >
            <span className=""> {t("All Value")}</span>
          </button>
          <button
            // onClick={() => handleSubmitSale("sale")}
            className={`flex justify-center text-2xl gap-2 items-center border border-gray-200 px-6 h-16 rounded-lg w-full
				${Number(cash) + Number(card) < value ? "bg-gray-300 cursor-not-allowed" : ""}
				`}
          >
            <Payment className={"size-8 "} />
            <span className=""> {t("Pay")}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
