import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import axios from "axios";
import { useApi } from "../Context/useApiContext";
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const LineChart = () => {
  const { API } = useApi();
  const [chartData, setData] = useState({});
  const [showDateOptions, setShowDateOptions] = useState(false);
  const [dateOptions, setDateOptions] = useState([
    { name: "Ayliq", id: 1 },
    { name: "Heftelik", id: 2 },
    { name: "Gunluk", id: 3 },
  ]);
  const [selectedOption, setSelectedOption] = useState(dateOptions[0].name);
  useEffect(() => {
    const fetchMontlyData = async () => {
      try {
        const res = await axios.get(`${API}/reports//turnover-per-month`);
        setData(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchMontlyData();
  }, []);

  // Ay isimleri sıralı olarak
  const labels = Object.keys(chartData);

  // Değerleri sıralı olarak al
  const dataPoints = Object.values(chartData);

  const data = {
    labels: labels, // X ekseni için ay isimleri
    datasets: [
      {
        label: "Satış Miktarı",
        data: dataPoints, // Y ekseni için değerler
        borderColor: "rgba(251, 176, 16)",
        backgroundColor: "rgba(251, 176, 16)",
        tension: 0.4,
      },
    ],
  };

  const dataLength = data.datasets[0].data.length;

  const options = {
    responsive: true, // Ekran boyutuna göre uyumlu olmasını sağlar
    plugins: {
      legend: {
        display: false, // Legend'ı gizler
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return `Satış: ${tooltipItem.raw}`; // Tooltip formatı
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: false, // X ekseninin başlığı
        },
        grid: {
          display: false, // Izgaraları gizler
        },
        offset: true, // X ekseninin daha düzgün hizalanması için ekledik
        ticks: {
          callback: function (value, index) {
            // Veri sayısı kadar etiket gösteriyoruz
            if (index < dataLength) {
              return labels[index]; // Sadece veri sayısına kadar etiket gösteriyoruz
            }
            return ""; // Geriye kalanları boş bırakıyoruz
          },
        },
      },
      y: {
        title: {
          display: false, // Y ekseninin başlığı
        },
        position: "right", // Y eksenini sağa alır
        grid: {
          display: false, // Izgaraları gizler
        },
      },
    },
  };
  const handleOption = (name) => {
    setSelectedOption(name);
    setShowDateOptions(false);
  };

  return (
    <div className="w-7/12 flex flex-col border p-4 rounded-xl border-newborder gap-2">
      <div className="flex justify-between">
        <span className="text-xl">Satis grafigi</span>
        <div className="flex gap-4 relative">
          <button
            className="text-xl border-newborder border px-4 py-2 rounded-lg cursor-pointer"
            onClick={() => setShowDateOptions((prev) => !prev)}
          >
            {selectedOption}
          </button>
          {showDateOptions && (
            <ul className="absolute top-14 right-0 rounded bg-white border border-newborder text-xl flex flex-col gap-4">
              {dateOptions?.map((option) => (
                <li
                  className=" cursor-pointer hover:bg-gray-200 w-full px-6 py-2"
                  onClick={() => handleOption(option.name)}
                  key={option.id}
                >
                  {option.name}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <Line data={data} options={options} />
    </div>
  );
};
