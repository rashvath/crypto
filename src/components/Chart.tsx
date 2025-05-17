import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Filler,
  ChartOptions,
  ScriptableContext,
} from "chart.js";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Filler
);

interface ChartProps {
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      borderColor?: string;
      backgroundColor?: string;
      tension?: number;
      fill?: boolean;
    }[];
  };
}

const Chart: React.FC<ChartProps> = ({ data }) => {
  // Red and green chart options
  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "#e2e8f0",
          font: {
            family: "'Inter', sans-serif",
            size: 12,
            weight: "bold",
          },
          padding: 20,
          usePointStyle: true,
          pointStyle: "circle",
          boxWidth: 8,
        },
      },
      tooltip: {
        mode: "index",
        intersect: false,
        backgroundColor: "rgba(15, 23, 42, 0.95)",
        // backdropFilter: "blur(4px)",
        titleColor: "#f8fafc",
        bodyColor: "#e2e8f0",
        titleFont: {
          family: "'Inter', sans-serif",
          size: 14,
          weight: "bold",
        },
        bodyFont: {
          family: "'Inter', sans-serif",
          size: 12,
        },
        padding: 12,
        cornerRadius: 12,
        displayColors: true,
        borderColor: "rgba(255, 255, 255, 0.1)",
        borderWidth: 1,
        // boxShadow: "0 4px 6px rgba(0, 0, 0, 0.25)",
        callbacks: {
          label: (context) => {
            let label = context.dataset.label || "";
            if (label) label += ": ";
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }).format(context.parsed.y);
            }
            return label;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
          drawTicks: false,
        },
        ticks: {
          color: "#94a3b8",
          font: {
            family: "'Inter', sans-serif",
            size: 11,
          },
        },
        border: {
          display: false,
        },
      },
      y: {
        grid: {
          color: "rgba(148, 163, 184, 0.1)",
          drawTicks: false,
        },
        ticks: {
          color: "#94a3b8",
          font: {
            family: "'Inter', sans-serif",
            size: 11,
          },
          padding: 10,
          callback: (value) => {
            return new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            }).format(Number(value));
          },
        },
        border: {
          display: false,
          dash: [4, 4],
        },
      },
    },
    elements: {
      line: {
        tension: 0.4,
        borderWidth: 3,
      },
      point: {
        radius: 0,
        hoverRadius: 8,
        hoverBorderWidth: 2,
        backgroundColor: "#ffffff",
      },
    },
    interaction: {
      intersect: false,
      mode: "nearest",
    },
  };

  // Enhanced dataset with red/green styling
  const enhancedData = {
    ...data,
    datasets: data.datasets.map((dataset, index) => {
      // Determine if the trend is positive (green) or negative (red)
      const firstValue = dataset.data[0] || 0;
      const lastValue = dataset.data[dataset.data.length - 1] || 0;
      const isPositive = lastValue >= firstValue;

      const baseColor = isPositive ? "#10b981" : "#ef4444"; // Green or Red
      const borderColor = baseColor;

      // Create gradient fill
      const gradientFill = (context: ScriptableContext<"line">) => {
        const { chart } = context;
        const { ctx, chartArea } = chart;

        if (!chartArea) return baseColor;

        const gradient = ctx.createLinearGradient(
          0,
          chartArea.bottom,
          0,
          chartArea.top
        );
        gradient.addColorStop(0, `${baseColor}40`);
        gradient.addColorStop(1, `${baseColor}00`);
        return gradient;
      };

      return {
        ...dataset,
        borderColor,
        backgroundColor: gradientFill,
        tension: 0.4,
        fill: true,
        pointBackgroundColor: "#ffffff",
        pointBorderColor: borderColor,
        pointHoverRadius: 8,
        pointHoverBorderWidth: 2,
        borderWidth: 3,
        borderJoinStyle: "round" as const,
        borderCapStyle: "round" as const,
      };
    }),
  };

  return (
    <div className="w-full h-full bg-slate-900/80 rounded-xl backdrop-blur-sm border border-slate-800 shadow-xl p-4">
      <div className="h-[400px]">
        <Line data={enhancedData} options={options} className="w-full h-full" />
      </div>
    </div>
  );
};

export default Chart;
