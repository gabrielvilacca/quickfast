import React from "react";
import { useExpenses } from "@/hooks/useExpenses";
import TableExpense from "./Table";

const OverviewList = ({ projectId }) => {
  const fetchedExpenses = useExpenses(projectId);

  return (
    <div className="overview-list">
      <TableExpense expenses={fetchedExpenses} projectId={projectId} />
    </div>
  );
};

export default OverviewList;
