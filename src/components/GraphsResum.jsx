import React, { useEffect, useState } from "react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shadcn/components/ui/card";
import { Activity, Asterisk, CandlestickChart, DollarSign } from "lucide-react";
import { useFirestore } from "@/hooks/useFirestore";

export default function GraphsResum({ project }) {
  const { getSubDocuments } = useFirestore("projects");
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [efficiency, setEfficiency] = useState(0);
  const [expensesCount, setExpensesCount] = useState(0);
  const [deviation, setDeviation] = useState(0);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const expenses = await getSubDocuments(project.id, "expenses");

        if (expenses && expenses.length > 0) {
          const total = expenses.reduce(
            (acc, expense) => acc + parseFloat(expense.price),
            0
          );
          setTotalExpenses(total);

          const efficiencyCalc = (project.value / total) * 100;
          setEfficiency(efficiencyCalc);

          setExpensesCount(expenses.length);
        } else {
          setExpensesCount(0);
        }
      } catch (error) {
        console.error("Erro ao buscar despesas:", error);
      }
    };

    fetchExpenses();
  }, [getSubDocuments, project.id, project.value]);

  useEffect(() => {
    const calculateDeviation = () => {
      if (project.value > 0) {
        const deviationValue =
          ((totalExpenses - project.value) / project.value) * 100;
        setDeviation(deviationValue.toFixed(2));
      }
    };

    calculateDeviation();
  }, [totalExpenses, project.value]);

  const getEfficiencyColor = (efficiency) => {
    if (efficiency >= 100) return "text-green-500";
    if (efficiency >= 90) return "text-yellow-500";
    return "text-red-500";
  };

  const getDeviationClass = () => {
    return deviation < 0 ? "text-green-500" : "text-red-500";
  };

  return (
    <div className="grid gap-4 grid-cols-1 sm:gap-64 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 auto-rows-fr">
      <Card className="min-w-[250px]">
        <CardHeader>
          <div className="flex justify-between">
            <CardDescription className="font-semibold text-md m-0">
              Estimativa
            </CardDescription>
            <DollarSign className="text-zinc-500" />
          </div>
          <CardTitle className="text-green-500 text-3xl">
            <span className="font-semibold text-green-500">
              R${totalExpenses.toFixed(2)} / {project.value}
            </span>
          </CardTitle>
        </CardHeader>
      </Card>

      <Card className="min-w-[250px]">
        <CardHeader>
          <div className="flex justify-between">
            <CardDescription className="font-semibold text-md m-0">
              KPI de eficiência do orçamento
            </CardDescription>
            <Activity className="text-zinc-500" />
          </div>
          <CardTitle className={`${getEfficiencyColor(efficiency)} text-3xl`}>
            {efficiency.toFixed(2)}%
          </CardTitle>
        </CardHeader>
      </Card>

      <Card className="min-w-[250px]">
        <CardHeader>
          <div className="flex justify-between">
            <CardDescription className="font-semibold text-md m-0">
              KPI de desvio da estimativa
            </CardDescription>
            <CandlestickChart className="text-zinc-500" />
          </div>
          <CardTitle className={`text-3xl ${getDeviationClass()}`}>
            {deviation}%
          </CardTitle>
        </CardHeader>
      </Card>

      <Card className="min-w-[250px]">
        <CardHeader>
          <div className="flex justify-between">
            <CardDescription className="font-semibold text-md m-0">
              Quantidade de despesas
            </CardDescription>
            <Asterisk className="text-zinc-500" />
          </div>
          <CardTitle className="text-3xl">{expensesCount}</CardTitle>
        </CardHeader>
      </Card>
    </div>
  );
}
