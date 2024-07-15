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
import { Button } from "@/shadcn/components/ui/button"; // Assumindo que você tenha um componente Button

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

  const handleDownloadCSV = () => {
    const headers = ["Despesa", "Disponibilidade", "Valor"];
    const rows = expenses.map((expense) => [
      expense.title,
      expense.priority,
      expense.price,
    ]);

    let csvContent =
      "data:text/csv;charset=utf-8," +
      headers.join(",") +
      "\n" +
      rows.map((row) => row.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "despesas.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
              <TableCell colSpan={2}>Total</TableCell>
              <TableCell className="text-right">
                R${totalExpenses.toFixed(2)}
              </TableCell>
            </TableRow>
          </TableFooter>
        </ShadcnTable>
        <div className="flex justify-end m-4">
          <Button onClick={handleDownloadCSV}>Baixar CSV</Button>
        </div>
      </Card>
    </div>
  );
};

export default TableExpense;
