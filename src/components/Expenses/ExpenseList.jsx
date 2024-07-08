import React, { useState } from "react";
import { useExpenses } from "@/hooks/useExpenses";
import ExpenseCard from "./ExpenseCard"; // Supondo que ExpenseCard é semelhante ao Task
import NewExpenseDialog from "@/pages/Expenses/NewExpenseDialog";

const ExpenseList = ({ projectId }) => {
  const expenses = useExpenses(projectId);
  const [showNewExpenseDialog, setShowNewExpenseDialog] = useState(false);

  return (
    <div className="p-5">
      <NewExpenseDialog
        open={showNewExpenseDialog}
        setOpen={setShowNewExpenseDialog}
        projectId={projectId}
      />
      {expenses.length > 0 ? (
        <div className="flex flex-col gap-4">
          {expenses.map((expense, index) => (
            <div key={expense.id} className="w-full">
              <ExpenseCard expense={expense} index={index} />
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center mt-5">Nenhuma despesa encontrada.</p>
      )}
    </div>
  );
};

export default ExpenseList;
