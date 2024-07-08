import React, { useEffect, useState } from "react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shadcn/components/ui/card";
import {
  AreaChart,
  Asterisk,
  CandlestickChart,
  CircleDollarSign,
} from "lucide-react";
import { useFirestore } from "@/hooks/useFirestore";

export default function CardChart({ project }) {
  const { getSubDocuments } = useFirestore("projects");
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [roi, setRoi] = useState(0);
  const [expensesCount, setExpensesCount] = useState(0);
  const [investmentGain, setInvestmentGain] = useState("");
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

          // Definindo a quantidade de despesas
          setExpensesCount(expenses.length);
        } else {
          // Caso não haja despesas, define a contagem como 0
          setExpensesCount(0);
        }
      } catch (error) {
        console.error("Erro ao buscar despesas:", error);
      }
    };

    fetchExpenses();
  }, [getSubDocuments, project.id]);

  const handleInputChange = (e) => {
    setInvestmentGain(e.target.value);
  };

  const calculateRoi = () => {
    if (investmentGain && totalExpenses > 0) {
      const roiValue = ((investmentGain - totalExpenses) / totalExpenses) * 100;
      setRoi(roiValue.toFixed(2));
    }
  };

  const calculateDeviation = () => {
    if (project.value > 0) {
      const deviationValue =
        ((totalExpenses - project.value) / project.value) * 100;
      setDeviation(deviationValue.toFixed(2));
    }
  };

  useEffect(() => {
    calculateRoi();
    calculateDeviation();
  }, [investmentGain, totalExpenses, project.value]);

  const getRoiClass = () => {
    return roi < 0 ? "text-red-500" : "text-green-500";
  };

  const getDeviationClass = () => {
    return deviation < 0 ? "text-green-500" : "text-red-500";
  };

  return (
    <div
      key={project.id}
      className="grid gap-4 grid-cols-1 sm:gap-64 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 auto-rows-fr"
    >
      <Card className="min-w-[250px] bg-secondary shadow-md">
        <CardHeader>
          <div className="flex justify-between">
            <CardDescription className="font-semibold text-md m-0">
              Valor das despesas
            </CardDescription>
            <CircleDollarSign className="text-zinc-500" />
          </div>
          <CardTitle className="font-bold text-4xl">
            {totalExpenses.toFixed(2)}
          </CardTitle>
        </CardHeader>
      </Card>

      <Card className="min-w-[250px] bg-secondary shadow-md">
        <CardHeader>
          <div className="flex justify-between">
            <CardDescription className="font-semibold text-md m-0">
              ROI
            </CardDescription>
            <AreaChart className="text-zinc-500" />
          </div>
          <CardTitle className={`text-3xl ${getRoiClass()}`}>{roi}%</CardTitle>
          <div className="mt-2">
            <input
              type="number"
              value={investmentGain}
              onChange={handleInputChange}
              placeholder="Ganho do Investimento"
              className="p-2 border rounded w-full"
            />
          </div>
        </CardHeader>
      </Card>

      <Card className="min-w-[250px] bg-secondary shadow-md">
        <CardHeader>
          <div className="flex justify-between">
            <CardDescription className="font-semibold text-md m-0">
              Quantidade de despesas
            </CardDescription>
            <Asterisk className="text-zinc-500" />
          </div>
          <CardTitle className="font-bold text-4xl">{expensesCount}</CardTitle>
        </CardHeader>
      </Card>

      <Card className="min-w-[250px] bg-secondary shadow-md">
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
    </div>
  );
}
