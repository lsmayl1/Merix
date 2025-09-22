import React from "react";

type data = { label: string; value: string }[];
export const KPI = ({ data }: { data: data }) => {
  return (
    <div
      className="grid gap-2 md:[grid-template-columns:repeat(var(--cols),minmax(0,1fr))] grid-cols-1"
      style={{ ["--cols" as any]: data.length }}
    >
      {data.map((item, index) => (
        <div key={index} className="bg-white p-4 rounded-lg flex flex-col">
          <span className="text-sm text-gray-500">{item.label || "Label"}</span>
          <span className="text-xl font-bold">{item.value || 0}</span>
        </div>
      ))}
    </div>
  );
};
