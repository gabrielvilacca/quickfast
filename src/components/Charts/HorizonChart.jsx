import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shadcn/components/ui/card";
import { Badge } from "@/shadcn/components/ui/badge";
import {
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/shadcn/components/ui/dropdown-menu";
import { useFirestore } from "@/hooks/useFirestore";
import { Progress } from "@/shadcn/components/ui/progress";

const HorizonChart = ({ project }) => {
  const { getSubDocuments, deleteDocument } = useFirestore("projects");
  const [totalExpenses, setTotalExpenses] = useState(0);

  useEffect(() => {
    const fetchExpenses = async () => {
      const expenses = await getSubDocuments(project.id, "expenses");
      if (expenses && expenses.length > 0) {
        const total = expenses.reduce(
          (acc, expense) => acc + parseFloat(expense.price),
          0
        );
        setTotalExpenses(total);
      }
    };

    fetchExpenses();
  }, [getSubDocuments, project.id]);

  const percentageAchieved = (totalExpenses / project.value) * 100;

  return (
    <div key={project.id}>
      <Card className="mt-2 mb-0 bg-secondary rounded-lg shadow-lg border border-gray-200 w-4/4 md:w-[500px]">
        <CardContent className="p-4">
          <p className="text-lg text-gray-800 font-semibold">
            Estimativa:{" "}
            <span className="font-semibold text-green-500">
              R${totalExpenses.toFixed(2)} / {project.value}
            </span>
          </p>
          <p className="text-lg text-gray-800">
            Porcentagem Atingida:{" "}
            <span className="font-semibold text-green-500">
              {percentageAchieved.toFixed(2)}%
            </span>
          </p>
          <Progress value={percentageAchieved} className="bg-background mt-2" />
        </CardContent>
      </Card>
    </div>
  );
};

export default HorizonChart;
