import React, { useEffect, useState } from "react";
import { useExpenses } from "@/hooks/useExpenses";
import { Card } from "@/shadcn/components/ui/card";
import { ArrowBigDownDash, ArrowBigUpDash } from "lucide-react";

const TagRanking = ({ projectId }) => {
  const expenses = useExpenses(projectId);
  const [tagRanks, setTagRanks] = useState([]);
  const [previousTagRanks, setPreviousTagRanks] = useState([]);

  useEffect(() => {
    if (expenses.length > 0) {
      const tagTotals = expenses.reduce((acc, expense) => {
        if (expense.tags) {
          expense.tags.forEach((tag) => {
            if (!acc[tag]) {
              acc[tag] = 0;
            }
            acc[tag] += parseFloat(expense.price);
          });
        }
        return acc;
      }, {});

      const sortedTags = Object.keys(tagTotals).sort(
        (a, b) => tagTotals[b] - tagTotals[a]
      );

      setPreviousTagRanks(tagRanks);
      setTagRanks(sortedTags);
    }
  }, [expenses]);

  const getRankingChange = (tag) => {
    const previousIndex = previousTagRanks.indexOf(tag);
    const currentIndex = tagRanks.indexOf(tag);

    if (previousIndex === -1) return "new";
    if (currentIndex < previousIndex) return "up";
    if (currentIndex > previousIndex) return "down";
    return "same";
  };

  return (
    <Card className="p-5 md:w-[500px] w-4/4 h-42 mt-2 md:mt-0 md:m-5 bg-secondary shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Ranking de Tags</h2>
      <ul className="grid grid-cols-2 gap-4">
        {tagRanks.map((tag, index) => (
          <li key={tag} className="flex items-center justify-between">
            <span className="text-xl font-semibold">
              {index + 1}. {tag}
            </span>
            {getRankingChange(tag) === "up" && (
              <ArrowBigUpDash className="w-5 h-5 text-green-500" />
            )}
            {getRankingChange(tag) === "down" && (
              <ArrowBigDownDash className="w-5 h-5 text-red-500" />
            )}
            {getRankingChange(tag) === "new" && (
              <span className="text-blue-500">Novo</span>
            )}
          </li>
        ))}
      </ul>
    </Card>
  );
};

export default TagRanking;
