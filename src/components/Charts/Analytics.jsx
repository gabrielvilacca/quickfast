import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useExpenses } from "@/hooks/useExpenses";
import { Card } from "@/shadcn/components/ui/card";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function Analytics({ projectId }) {
  const expenses = useExpenses(projectId);
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});

  useEffect(() => {
    if (expenses.length > 0) {
      const monthlyExpenses = new Array(12).fill(0);

      expenses.forEach((expense) => {
        const date = new Date(expense.date);
        const month = date.getMonth(); // getMonth() returns 0-11
        monthlyExpenses[month] += parseFloat(expense.price);
      });

      const chartData = {
        labels: [
          "Janeiro",
          "Fevereiro",
          "Março",
          "Abril",
          "Maio",
          "Junho",
          "Julho",
          "Agosto",
          "Setembro",
          "Outubro",
          "Novembro",
          "Dezembro",
        ],
        datasets: [
          {
            label: "Despesas Mensais",
            data: monthlyExpenses,
            backgroundColor: "#32BE60",
          },
        ],
      };

      const chartOptions = {
        responsive: true,
        plugins: {
          legend: {
            position: "top",
          },
          title: {
            display: true,
            text: "Despesas Mensais",
          },
        },
        scales: {
          y: {
            title: {
              display: true,
              text: "Despesas (R$)",
            },
            beginAtZero: true,
          },
        },
      };

      setChartData(chartData);
      setChartOptions(chartOptions);
    }
  }, [expenses]);

  return (
    <Card className="p-5 w-full md:w-[500px] mt-2 bg-secondary shadow-lg">
      <h2 className="text-2xl font-bold">Despesas Mensais</h2>
      {chartData.labels ? (
        <Bar data={chartData} options={chartOptions} />
      ) : (
        <p>Carregando dados...</p>
      )}
    </Card>
  );
}
