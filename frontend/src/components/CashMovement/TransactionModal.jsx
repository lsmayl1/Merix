import React, { useState } from "react";
import { CreditCard } from "../../assets/CreditCard";
import { Cash } from "../../assets/Cash";
import CloseSquare from "../../assets/Navigation/CloseSquare";
import { useForm } from "react-hook-form";

export const TransactionModal = ({ handleClose, onSubmit }) => {
  const [transactionType, setTransactionType] = useState("in");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    defaultValues: {
      amount: "0",
      description: "",
    },
  });
  const handleTransactionTypeChange = (method) => {
    setTransactionType(method);
  };

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
  };

  const validateSubmit = (data) => {
    onSubmit({
      ...data,
      transactionType,
      paymentMethod,
    });
  };
  return (
    <div className="absolute right-0 top-0 w-full h-full flex items-center justify-center ">
      <div className="flex overflow-auto flex-col gap-6 bg-white  w-1/2 border border-mainBorder  rounded-lg items-center px-2 py-12">
        <div className="w-full flex justify-end px-12">
          <button onClick={handleClose}>
            <CloseSquare className={"size-10"} />
          </button>
        </div>
        <div className="flex  w-1/2 gap-2   rounded-lg">
          <button
            onClick={() => handleTransactionTypeChange("in")}
            className={`${
              transactionType === "in"
                ? "bg-blue-500 text-white"
                : "border border-mainBorder"
            }  py-2 px-4 rounded-lg w-full`}
          >
            Pay In
          </button>
          <button
            onClick={() => handleTransactionTypeChange("out")}
            className={` ${
              transactionType === "out"
                ? "bg-blue-500 text-white"
                : "border border-mainBorder"
            }
                border border-mainBorder py-2 px-4 w-full rounded-lg`}
          >
            Pay Out
          </button>
        </div>
        <form
          className="w-1/2 flex flex-col gap-4"
          onSubmit={handleSubmit(validateSubmit)}
        >
          <div className="flex flex-col gap-1 ">
            <label>Amount</label>
            <input
              type="number"
              {...register("amount", {
                required: "Amount is required",
                min: {
                  value: 0.01,
                  message: "Amount must be greater than 0",
                },
              })}
              className="border p-2 border-mainBorder rounded-lg"
            />
            {errors?.amount?.message && (
              <p className="text-red-500">{errors.amount.message}</p>
            )}
          </div>
          <div className="flex flex-col gap-1 ">
            <label>Description</label>
            <input
              type="text"
              {...register("description", {
                required: "Description is required",
                maxLength: {
                  value: 255,
                  message: "Description cannot exceed 255 characters",
                },
              })}
              className="border p-2 border-mainBorder rounded-lg"
            />
            {errors?.description?.message && (
              <p className="text-red-500">{errors.description.message}</p>
            )}
          </div>
          <div className="flex gap-2 items-center ">
            <button
              onClick={() => handlePaymentMethodChange("cash")}
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
                Cash
              </span>
            </button>
            <button
              onClick={() => handlePaymentMethodChange("card")}
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
                Card
              </span>
            </button>
          </div>
          <div className="flex items-center gap-4  ">
            <button
              onClick={handleClose}
              type="button"
              className="rounded-xl truncate  w-full max-lg:text-md cursor-pointer border border-red-700 px-4 py-1 font-semibold text-red-700"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-xl cursor-pointer w-full max-lg:text-md border border-blue-700 px-4 py-1 font-semibold text-blue-700"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
