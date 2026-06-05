import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";

// Chart.js içinde kullanacağın modülleri register etmen gerekiyor
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const data = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Apr"],
  datasets: [
    {
      label: "Users",
      data: [4000, 3000, 2000, 2780, 1890, 2390, 3490, 7000],
      borderColor: "rgb(27, 65, 255)",
      backgroundColor: "rgba(27, 65, 255, 0.1)",
      fill: true,
      tension: 0.4, // eğri çizgi için
      pointRadius: 0,
    },
  ],
};

const options = {
  responsive: true,
  maintainAspectRatio: false,

  plugins: {
    legend: {
      display: false,
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
        drawBorder: false,
      },
      border: {
        display: false,
      },
    },
    y: {
      grid: {
        display: false,
        drawBorder: false,
      },
      border: {
        display: false,
      },
      position: "right",
    },
  },
};

export const LineChart = () => {
  return <Line data={data} options={options} />;
};
