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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shadcn/components/ui/card";
import { useExpenses } from "@/hooks/useExpenses";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const OverviewChart = ({ projectId }) => {
  const expenses = useExpenses(projectId);
  const [monthlyExpenses, setMonthlyExpenses] = useState(new Array(12).fill(0));

  useEffect(() => {
    const monthlyCounts = new Array(12).fill(0);

    expenses.forEach((expense) => {
      const expenseDate = expense.createdAt.toDate(); // Converte o Timestamp para Date
      const month = expenseDate.getMonth(); // getMonth() retorna o mês de 0 (Janeiro) a 11 (Dezembro)
      monthlyCounts[month]++;
    });

    setMonthlyExpenses(monthlyCounts);
  }, [expenses]);

  const data = {
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
        label: "Despesas",
        data: monthlyExpenses,
        backgroundColor: "#32BE60",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Quantidade de despesas",
      },
    },
  };

  return (
    <Card className="w-full md:min-w-[500px]">
      <CardHeader>
        <CardTitle>Despesas Mensais</CardTitle>
        <CardDescription>Um resumo das despesas mensais</CardDescription>
      </CardHeader>
      <CardContent>
        <div style={{ minHeight: "400px" }}>
          <Bar data={data} options={options} />
        </div>
      </CardContent>
    </Card>
  );
};

export default OverviewChart;
