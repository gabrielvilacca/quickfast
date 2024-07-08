// components/ExpenseList.js
import React from "react";
import { useExpenses } from "@/hooks/useExpenses";
import ExpenseCard from "./ExpenseCard";

const ExpenseList = () => {
  const expenses = useExpenses();

  return (
    <div className="grid gap-4">
      {expenses.map((expense) => (
        <ExpenseCard key={expense.id} expense={expense} />
      ))}
    </div>
  );
};

export default ExpenseList;
