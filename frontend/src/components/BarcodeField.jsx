import React, { useEffect, useRef, useState } from "react";

export const BarcodeField = ({ handleBarcode, shouldFocus = true }) => {
  const [barcode, setBarcode] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    if (shouldFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [shouldFocus]);

  useEffect(() => {
    const handleClick = (event) => {
      if (!event.target.matches("input, button,span")) {
        if (shouldFocus && inputRef.current) {
          inputRef.current.focus();
        }
      }
    };

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  const handleKey = (e) => {
    if (e.key == "Enter" && barcode.length > 0) {
      handleBarcode(barcode.trim());
      setBarcode("");
    }
  };

  return (
    <input
      value={barcode}
      ref={inputRef}
      type="number"
      onChange={(e) => setBarcode(e.target.value)}
      className="absolute opacity-0 left-0"
      onKeyDown={(e) => handleKey(e)}
    />
  );
};
