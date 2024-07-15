import React, { useContext } from "react";
import { UserDocContext } from "../contexts/UserDocContext";
import { Card } from "@/shadcn/components/ui/card";

const YourFunction = () => {
  const { userDoc } = useContext(UserDocContext);

  if (!userDoc) {
    return <p>Carregando...</p>;
  }

  const userRole = userDoc.role;

  return (
    <div className="m-5 p-5 bg-gray-100 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-4 text-gray-800">Sua função:</h1>
      <Card className={`p-4 flex items-center font-mediumrounded-lg shadow-md`}>
        <h2 className="text-2xl">
          {userRole === "admin"
            ? "Administrador"
            : userRole === "collaborator"
            ? "Colaborador"
            : "Visualizador"}
        </h2>
      </Card>
    </div>
  );
};

export default YourFunction;
