import React, { useState, useEffect } from "react";
import { Button } from "@/shadcn/components/ui/button";
import { Separator } from "@/shadcn/components/ui/separator";
import NewExpenseDialog from "./NewExpenseDialog";
import ExpenseList from "./ExpenseList";
import { useFirestore } from "@/hooks/useFirestore";

export default function Expense() {
  const [showNewExpenseDialog, setShowNewExpenseDialog] = useState(false);
  const { documents: projects, loading, error } = useFirestore("projects");

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro ao carregar projetos.</div>;

  return (
    <div>
      <div className="flex m-5 justify-between">
        <h1 className="text-3xl font-bold">Despesas</h1>
        <Button onClick={() => setShowNewExpenseDialog(true)}>
          Nova despesa
        </Button>
      </div>
      <Separator />
      <NewExpenseDialog
        open={showNewExpenseDialog}
        setOpen={setShowNewExpenseDialog}
        projects={projects}
      />
      <ExpenseList />
    </div>
  );
}
