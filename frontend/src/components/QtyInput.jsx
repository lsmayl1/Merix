import React, { useEffect, useState } from "react";
import { Minus } from "../assets/Minus";
import { Plus } from "../assets/Plus";

export const QtyInput = ({ barcode, handleQty, qty, className, allign }) => {
  const [newQty, setNewQty] = useState(qty);

  useEffect(() => {
    setNewQty(qty);
  }, [qty]);
  return (
    <div className={`flex items-center ${allign} `}>
      <button
        onClick={() => handleQty(barcode, "deacrese")}
        className="bg-white border border-mainBorder rounded-lg p-0.5"
      >
        <Minus className="size-4 text-black" />
      </button>
      <input
        type="number"
        className={`${className} rounded-lg  w-1/6 text-center  text-black`}
        value={newQty || 0}
        onChange={(e) => setNewQty(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleQty(barcode, null, newQty);
          }
        }}
      />

      <button
        onClick={() => handleQty(barcode, "increase")}
        className="bg-white border border-mainBorder rounded-lg p-0.5"
      >
        <Plus className="size-4 text-black" />
      </button>
    </div>
  );
};
