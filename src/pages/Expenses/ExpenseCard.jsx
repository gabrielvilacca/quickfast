import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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

const ExpenseCard = ({ expense }) => {
  const { deleteDocument } = useFirestore("expense");

  const removeExpense = async (expenseId) => {
    await deleteDocument(expenseId);
  };

  const getPriorityLabel = (priority) => {
    switch (priority) {
      case "disponivel":
        return "Disponível";
      case "indisponivel":
        return "Indisponível";
      default:
        return "N/A";
    }
  };

  const getPriorityBadgeColor = (priority) => {
    switch (priority) {
      case "disponivel":
        return "bg-green-500 text-white";
      case "indisponivel":
        return "bg-red-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  return (
    <Card className="m-5 mb-0 bg-secondary rounded-lg shadow-lg border border-gray-200 w-[250px]">
      <CardHeader className="p-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-semibold text-gray-800">
            {expense.title}
          </CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <DotsHorizontalIcon
                className="w-6 h-6 text-gray-500 hover:text-gray-700"
                role="button"
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white p-2 rounded-lg shadow-md">
              <DropdownMenuLabel className="text-gray-700">
                Ações
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-gray-700 hover:bg-gray-100">
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-600 hover:bg-red-100"
                onClick={() => removeExpense(expense.id)}
              >
                Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <CardDescription className="text-gray-600 mt-2">
          {expense.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4">
        <p className="text-lg text-gray-800">
          Preço: <span className="font-semibold">R$ {expense.price}</span>
        </p>
      </CardContent>
      <CardFooter className="p-4 border-t border-gray-200">
        <Badge
          className={`${getPriorityBadgeColor(
            expense.priority
          )} py-1 px-3 rounded-full`}
        >
          {getPriorityLabel(expense.priority)}
        </Badge>
      </CardFooter>
    </Card>
  );
};

export default ExpenseCard;
