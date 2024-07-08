import React, { useEffect, useState } from "react";
import { PolarArea } from "react-chartjs-2";
import {
  Chart as ChartJS,
  RadialLinearScale,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { useExpenses } from "@/hooks/useExpenses";
import { Card } from "@/shadcn/components/ui/card";

// Register Chart.js components
ChartJS.register(RadialLinearScale, ArcElement, Tooltip, Legend);

const PolarAreaChart = ({ projectId }) => {
  const expenses = useExpenses(projectId);
  const [tagCounts, setTagCounts] = useState({});
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Quantidade de Despesas",
        data: [],
        backgroundColor: [],
        borderColor: [],
        borderWidth: 1,
      },
    ],
  });

  useEffect(() => {
    if (expenses.length === 0) return;

    const counts = expenses.reduce((acc, expense) => {
      if (expense.tags) {
        expense.tags.forEach((tag) => {
          if (!acc[tag]) {
            acc[tag] = 0;
          }
          acc[tag] += 1;
        });
      }
      return acc;
    }, {});

    setTagCounts(counts);

    const data = {
      labels: Object.keys(counts),
      datasets: [
        {
          label: "Quantidade de Despesas",
          data: Object.values(counts),
          backgroundColor: [
            "rgba(255, 99, 132, 0.2)",
            "rgba(54, 162, 235, 0.2)",
            "rgba(255, 206, 86, 0.2)",
            "rgba(75, 192, 192, 0.2)",
            "rgba(153, 102, 255, 0.2)",
            "rgba(255, 159, 64, 0.2)",
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
            "rgba(255, 159, 64, 1)",
          ],
          borderWidth: 1,
        },
      ],
    };

    setChartData(data);
  }, [expenses]);

  return (
    <Card className="p-3 md:w-[500px] h-auto mt-2 md:m-5 bg-secondary shadow-lg">
      <h2 className="font-bold text-lg">Quantidade de despesas</h2>
      <div className="md:h-[250px] md:w-[250px] mx-auto">
        {chartData.labels.length > 0 ? (
          <PolarArea data={chartData} />
        ) : (
          <p>Nenhuma despesa encontrada.</p>
        )}
      </div>
    </Card>
  );
};

export default PolarAreaChart;
