import React from "react";

export const Table = ({
  data,
  header,
  loading,
  handlePage,
  curentPage,
  totalPage,
  style = {
    body: "",
    header: "",
  },
}) => {
  return (
    <div className="w-full flex flex-col  h-full items-center bg-white   rounded-xl  ">
      <div className="w-full flex flex-col gap-4 pr-2  min-h-0 overflow-y-auto">
        <table
          className="min-w-full"
          style={{
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr className="">
              {header?.map((head, index) => (
                <th
                  key={index}
                  className={
                    `px-6 text-start bg-[#F7F7F7] text-black  py-4 ${style.header}` +
                    (index === 0 ? "rounded-tl-xl rounded-bl-xl " : "") +
                    (index === header.length - 1
                      ? "rounded-tr-xl rounded-br-xl  "
                      : "")
                  }
                >
                  {head.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {!data ||
              (data.length === 0 && (
                <tr>
                  <td
                    colSpan={header.length || 1}
                    className=" text-center py-4 w-full "
                  >
                    {loading ? "Yuklenir..." : "Mehsul yoxdur"}
                  </td>
                </tr>
              ))}
            {data?.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className={`hover:bg-[#eeeeee] cursor-pointer  border-gray-200 text-black text-[14px] font-semibold ${style.body} `}
              >
                {header?.map((col, index) => (
                  <td
                    key={index}
                    className={`px-6 py-2 text-nowrap   ${
                      index === 0 ? "rounded-tl-xl rounded-bl-xl" : ""
                    } ${
                      index === header.length - 1
                        ? "rounded-tr-xl rounded-br-xl"
                        : ""
                    }`}
                  >
                    {col.render
                      ? col.render(row[col.key], row)
                      : row[col.key] ?? "-"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {data?.length >= 50 && (
        <div className="pt-4 flex justify-between w-full  items-center border-t border-mainBorder ">
          <span className="text-md font-medium text-mainText">
            Showing {curentPage} to 50 of {totalPage} entries
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => handlePage("prev")}
              className="px-4 py-2 bg-gray-200 rounded-lg cursor-pointer"
            >
              Previous
            </button>
            <button
              onClick={handlePage}
              className="px-4 py-2 bg-gray-200 rounded-lg cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
