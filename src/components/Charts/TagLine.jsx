import React, { useEffect, useState } from "react";
import { Doughnut, Line } from "react-chartjs-2";
import {
  Chart,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  Title,
  LineElement,
  PointElement,
  LinearScale,
} from "chart.js";
import { Card } from "@/shadcn/components/ui/card";
import { useExpenses } from "@/hooks/useExpenses";

// Registrar os componentes do Chart.js
Chart.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const TagLine = ({ projectId }) => {
  const expenses = useExpenses(projectId);
  const [chartData, setChartData] = useState({});

  useEffect(() => {
    if (expenses.length > 0) {
      const tagTotals = expenses.reduce((acc, expense) => {
        if (expense.tags) {
          expense.tags.forEach((tag) => {
            if (!acc[tag]) {
              acc[tag] = 0;
            }
            acc[tag] += parseFloat(expense.price);
          });
        }
        return acc;
      }, {});

      const labels = Object.keys(tagTotals);
      const data = Object.values(tagTotals);

      setChartData({
        labels,
        datasets: [
          {
            label: "Despesas por Tag",
            data,
            backgroundColor: [
              "#FF6384",
              "#36A2EB",
              "#FFCE56",
              "#4BC0C0",
              "#F39C12",
              "#8E44AD",
              "#2ECC71",
              "#E74C3C",
              "#3498DB",
              "#9B59B6",
              "#1ABC9C",
              "#34495E",
            ],
            hoverBackgroundColor: [
              "#FF6384",
              "#36A2EB",
              "#FFCE56",
              "#4BC0C0",
              "#F39C12",
              "#8E44AD",
              "#2ECC71",
              "#E74C3C",
              "#3498DB",
              "#9B59B6",
              "#1ABC9C",
              "#34495E",
            ],
          },
        ],
      });
    }
  }, [expenses]);

  return (
    <Card className="p-5 w-4/4 md:w-[500px] h-[170px] mt-5 bg-secondary shadow-lg ">
      {chartData.labels ? (
        <Line data={chartData} />
      ) : (
        <p>Carregando dados...</p>
      )}
    </Card>
  );
};

export default TagLine;
