import React, { useCallback, useEffect, useRef, useState } from "react";
import { Wallet } from "../assets/Wallet";
import { Kart } from "../assets/Kart";
import { Tick } from "../assets/Tick";
import axios from "axios";

export const PaymentMethod = ({
  totals,
  closePayment,
  changePaymentMethod,
  paymentMethodvalue,
  postData,
}) => {
  const [takedMoney, setTakedMoney] = useState(totals);
  const [receipt, setReceipt] = useState(false);
  const [editTaked, setEditTaked] = useState(false);
  const inputRef = useRef(null);

  const closePaymentPage = () => {
    closePayment();
  };

  const createSale = async () => {
    await postData();
    closePayment();
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus(); // input elemanına odaklanın
    }
  }, []); // editTaked değiştiğinde input elemanına odaklanın

  const handleTakeMoneyChange = (e) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value)) {
      setTakedMoney(value);
    }
  };

  return (
    <div className="absolute backdrop-blur-xs w-full h-full z-50 flex items-center justify-center">
      <div className="w-1/2 bg-white h-1/2 border rounded-2xl border-[#ADA3A3] flex ">
        <div className="text-2xl w-1/3 p-4 flex flex-col gap-5 border-r border-[#ADA3A3]">
          <h1>Odəniş üsulu</h1>
          <div className="flex flex-col gap-5 ">
            <button
              className={` border p-4 cursor-pointer  rounded-2xl flex items-center gap-5 ${
                paymentMethodvalue === "cash"
                  ? "bg-[#A9A9A9] border-none text-white"
                  : "bg-white"
              }`}
              onClick={() => changePaymentMethod("cash")}
            >
              <Wallet />
              Nagd{" "}
            </button>
            <button
              className={` border p-4  cursor-pointer rounded-2xl flex items-center gap-5 ${
                paymentMethodvalue === "card"
                  ? "bg-[#A9A9A9] border-none text-white"
                  : "bg-white"
              }`}
              onClick={() => changePaymentMethod("card")}
            >
              <Kart />
              Kart{" "}
            </button>
          </div>
        </div>
        <div className="w-2/3 p-4 flex flex-col gap-10 justify-between">
          <div className="flex justify-center">
            <h1 className="text-3xl">Toplam {totals.toFixed(2)} ₼ </h1>
          </div>
          {paymentMethodvalue === "cash" ? (
            <div className="flex flex-col gap-5 w-full">
              <div className="flex gap-5 w-full">
                <div className="flex flex-1 flex-col gap-1">
                  <span className="text-xl px-2">Alınan məbləg</span>
                  <div className="flex-1 border flex items-center border-black rounded-2xl">
                    {editTaked ? (
                      <input
                        type="number"
                        className="w-full text-2xl px-4  focus:outline-none"
                        onBlur={() => setEditTaked((prev) => !prev)}
                        onChange={handleTakeMoneyChange}
                        ref={inputRef}
                      />
                    ) : (
                      <span
                        className="text-2xl px-4"
                        onClick={() => setEditTaked((prev) => !prev)}
                      >
                        {takedMoney.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex flex-1 flex-col gap-1">
                  <span className="text-xl px-2">Qaytarılacag məbləg</span>
                  <div className="flex-1 p-2 border rounded-2xl">
                    <span className="text-2xl">
                      {(takedMoney - totals).toFixed(2) + " ₼"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex gap-5 w-full">
              <div className="flex flex-1 flex-col gap-1">
                <span className="text-xl px-2">Kart nomresi</span>
                <div className="flex-1 p-2 border border-[#ADA3A3] rounded-2xl">
                  <span className="text-2xl">4898 9845 6548 2454</span>
                </div>
              </div>
            </div>
          )}
          <div className="flex gap-5 items-center">
            <span className="text-2xl">Cek</span>
            <div
              className={` border  rounded-md overflow-auto size-7 flex items-center justify-center ${
                receipt ? "bg-[#44bd40] border-none" : "bg-white"
              }`}
              onClick={() => setReceipt(!receipt)}
            ></div>
          </div>

          <div className="flex justify-center gap-15">
            <button
              onClick={closePaymentPage}
              className="text-2xl bg-red-500 cursor-pointer text-white p-2 rounded-2xl w-full"
            >
              Legv et
            </button>
            <button
              onClick={createSale}
              className="text-2xl bg-green-500 cursor-pointer text-white p-2 rounded-2xl w-full"
            >
              Odenis et
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
