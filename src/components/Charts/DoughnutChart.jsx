import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
import { Card } from "@/shadcn/components/ui/card";
import { useExpenses } from "@/hooks/useExpenses";

// Registrar os componentes do Chart.js
Chart.register(ArcElement, Tooltip, Legend);

const DoughnutChart = ({ projectId }) => {
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
    <Card className="p-5 w-full md:w-[500px] h-auto mt-5 bg-secondary shadow-lg">
      <h2 className="text-3xl font-bold mb-4">Distribuição por tag</h2>
      {chartData.labels ? (
        <div className="relative h-64 md:h-96">
          <Doughnut data={chartData} options={{ maintainAspectRatio: false }} />
        </div>
      ) : (
        <p>Carregando dados...</p>
      )}
    </Card>
  );
};

export default DoughnutChart;
