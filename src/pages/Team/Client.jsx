import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shadcn/components/ui/card";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/shadcn/components/ui/dropdown-menu";
import { useFirestore } from "@/hooks/useFirestore";
import { useNavigate } from "react-router-dom";

const Client = ({ client }) => {
  const { deleteDocument } = useFirestore("clients");
  const navigate = useNavigate();

  const removeClient = async (clientId) => {
    await deleteDocument(clientId);
  };

  const handleCardClick = () => {
    navigate(`/client/${client.id}`);
  };

  if (!client) {
    return null;
  }

  return (
    <div key={client.id} className="m-4">
      <Card
        className="bg-secondary rounded-lg shadow-lg border border-gray-200 transition-transform transform hover:scale-105 cursor-pointer"
        onClick={handleCardClick}
      >
        <CardHeader className="p-4 border-b border-gray-200 flex justify-between items-center">
          <CardTitle className="text-xl font-semibold text-gray-800">
            {client.name}
          </CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <DotsHorizontalIcon
                className="w-6 h-6 text-gray-500 hover:text-gray-700 transition-colors"
                role="button"
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white p-2 rounded-lg shadow-md">
              <DropdownMenuLabel className="text-gray-700 font-medium">
                Ações
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-gray-700 hover:bg-gray-100 rounded-md transition-colors">
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-600 hover:bg-red-100 rounded-md transition-colors"
                onClick={() => removeClient(client.id)}
              >
                Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
      </Card>
    </div>
  );
};

export default Client;
