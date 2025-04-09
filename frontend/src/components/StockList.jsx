import React from "react";
import { useApi } from "../components/Context/useApiContext";
export const StockList = () => {
  const [data, setData] = React.useState([]);

  const { API } = useApi();

  const fetchData = async () => {
    try {
      const res = await fetch(`${API}/products/stocks/data`);
      const json = await res.json();
      setData(json);
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, [API]);
  return (
    <div className="h-full w-5/12  border border-newborder rounded-lg  overflow-auto flex flex-col max-md:order-1 max-md:h-1/2 max-md:w-full">
      <div className="p-4">
        <h1 className="text-xl">Azalan Stoklar</h1>
        <div className="flex pt-4 justify-between text-xl rounded-xl">
          <span>Mehsul</span>
          <span>Stok</span>
        </div>
      </div>
      <ul className="flex flex-col  px-3 gap-2 overflow-auto h-full">
        {data?.map((item, index) => (
          <li
            key={index}
            className="flex justify-between border rounded-xl border-newborder p-2"
          >
            <span>{item.name}</span>
            <span>{item.stock}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
