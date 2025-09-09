import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip } from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip);

export const PieChart = ({ chartData, total }) => {
  const dataLabels = chartData?.map((dt) => dt.name) || [];
  const dataValues = chartData?.map((dt) => dt.value) || [];

  const data = {
    labels: dataLabels || [],
    datasets: [
      {
        data: dataValues || 0,
        backgroundColor: chartData?.map((dt) => dt.color) || [],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        display: false, // 🔑 legend kapalı
      },
      tooltip: {
        enabled: true,
      },
    },
    cutout: "75%", // 🔑 donut efekti
  };

  // 🔹 Ortadaki değeri gösteren plugin
  const centerTextPlugin = {
    id: "centerText",
    beforeDraw(chart: any) {
      const { ctx, width, height } = chart;
      ctx.save();

      // 🔹 "Net Profit" yazısı rengi
      ctx.font = "bold 18px Arial";
      ctx.fillStyle = "#737373"; // kırmızı renk
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(`${total.label}`, width / 2, height / 2.3);

      // 🔹 Toplam değer rengi
      ctx.font = "bold 24px Arial";
      ctx.fillStyle = "#000000"; // siyah renk
      ctx.fillText(
        `${total.value.toFixed(2) || 0} ₼`,
        width / 2,
        height / 1.75
      );

      ctx.restore();
    },
  };

  return <Pie data={data} options={options} plugins={[centerTextPlugin]} />;
};
