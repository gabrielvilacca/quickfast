import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Importar useNavigate
import { Button } from "@/shadcn/components/ui/button";
import NewClient from "./NewClient";
import ClientList from "./ClientList";
import { Separator } from "@/shadcn/components/ui/separator";
import Overview from "@/components/Overview";

export default function Team() {
  const [showNewClient, setShowNewClient] = useState(false);
  const navigate = useNavigate(); // Chamar useNavigate para obter a função navigate

  const handleClientCreated = (clientId) => {
    // Redirecionar para a página de detalhes do projeto após criação
    navigate(`/client/${clientId}`);
  };

  return (
    <div>
      <div className="flex justify-between m-5">
        <h1 className="text-3xl font-bold">Meus Clientes</h1>
        <Button onClick={() => setShowNewClient(true)} className="p-6 px-10">
          Adicionar Cliente
        </Button>
      </div>
      <Separator />
      <NewClient
        open={showNewClient}
        setOpen={setShowNewClient}
        onClientCreated={handleClientCreated}
      />
      <ClientList />
    </div>
  );
}
