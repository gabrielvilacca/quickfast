import React, { useEffect, useState } from "react";
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
import { Progress } from "@/shadcn/components/ui/progress";

const ProjectCard = ({ project }) => {
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

  const removeProject = async (projectId) => {
    await deleteDocument(projectId);
  };

  return (
    <div key={project.id}>
      <Card className="m-5 mb-0 bg-secondary rounded-lg shadow-lg border border-gray-200">
        <CardHeader className="p-4 border-b border-gray-200">
          <CardContent className="p-4">
            {project.imageUrl && (
              <img
                src={project.imageUrl}
                alt="Project"
                className="h-64 w-64 object-cover rounded-lg"
              />
            )}
          </CardContent>
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl font-semibold text-gray-800">
              {project.title}
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
                  onClick={() => removeProject(project.id)}
                >
                  Excluir
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <CardDescription className="text-gray-600 mt-2">
            {project.description}
          </CardDescription>
          <p className="text-lg text-gray-600 flex items-center">
            <span className="font-bold text-gray-900">Cliente:</span>
            <span className="ml-2 font-semibold">{project.clientName}</span>
          </p>
        </CardHeader>
        <CardContent className="p-4">
          <p className="text-lg text-gray-800">
            Estimativa:{" "}
            <span className="font-semibold text-green-500">
              R${totalExpenses.toFixed(2)} / {project.value}
            </span>
          </p>
          <Progress
            value={(totalExpenses / project.value) * 100}
            className="bg-background mt-2"
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectCard;
