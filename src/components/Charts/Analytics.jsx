import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useFirestore } from "@/hooks/useFirestore";
import { Card } from "@/shadcn/components/ui/card";

// Register Chart.js components
Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function Analytics() {
  const { getSubDocuments } = useFirestore("projects");
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const expenses = await getSubDocuments("project-id", "expenses");
        const monthlyExpenses = {};

        expenses.forEach((expense) => {
          const date = new Date(expense.date);
          const month = date.getMonth() + 1; // getMonth() returns 0-11, so add 1
          const year = date.getFullYear();
          const key = `${year}-${month < 10 ? `0${month}` : month}`;

          if (!monthlyExpenses[key]) {
            monthlyExpenses[key] = 0;
          }
          monthlyExpenses[key] += parseFloat(expense.price);
        });

        const labels = Object.keys(monthlyExpenses).sort();
        const data = labels.map((label) => monthlyExpenses[label]);

        setChartData({
          labels: labels,
          datasets: [
            {
              label: "Despesas Mensais",
              data: data,
              borderColor: "#32BE60",
              backgroundColor: "#32BE60",
              fill: true,
            },
          ],
        });

        setChartOptions({
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
        });
      } catch (error) {
        console.error("Erro ao buscar despesas:", error);
      }
    };

    fetchExpenses();
  }, [getSubDocuments]);

  return (
    <Card className="p-5 w-4/4 md:w-[500px] mt-2 bg-secondary shadow-lg">
      <h2 className="text-2xl font-bold">Despesas Mensais</h2>
      {chartData.labels ? (
        <Line data={chartData} options={chartOptions} />
      ) : (
        <p>Carregando dados...</p>
      )}
    </Card>
  );
}
