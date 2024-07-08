import React from "react";
import {
  Table as ShadcnTable,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shadcn/components/ui/table";
import { Card } from "@/shadcn/components/ui/card";

const TableExpense = ({ expenses, projectId }) => {
  if (!expenses || expenses.length === 0) {
    return (
      <div className="expense-card">
        <Card>
          <p className="text-center mt-5">Nenhuma despesa encontrada.</p>
        </Card>
      </div>
    );
  }

  const totalExpenses = expenses.reduce(
    (acc, expense) => acc + parseFloat(expense.price),
    0
  );

  return (
    <div className="expense-card">
      <Card className="overflow-x-auto md:w-[500px]">
        <ShadcnTable className="w-full">
          <TableCaption>Uma lista rápida das suas despesas</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Despesa</TableHead>
              <TableHead>Disponibilidade</TableHead>
              <TableHead className="text-right">Valor</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {expenses.map((expense, index) => (
              <TableRow key={expense.id}>
                <TableCell className="font-medium">{expense.title}</TableCell>
                <TableCell>{expense.priority}</TableCell>
                <TableCell className="text-right">{expense.price}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={3}>Total</TableCell>
              <TableCell className="text-right">
                R${totalExpenses.toFixed(2)}
              </TableCell>
            </TableRow>
          </TableFooter>
        </ShadcnTable>
      </Card>
    </div>
  );
};

export default TableExpense;
