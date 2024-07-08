import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Importar useNavigate
import { useSubscriptionContext } from "@/hooks/useSubscriptionContext";
import { Button } from "@/shadcn/components/ui/button";
import { Separator } from "@/shadcn/components/ui/separator";
import NewProject from "./NewProject";
import ProjectList from "./ProjectList";

export default function Home() {
  const { subscriptionDoc } = useSubscriptionContext();
  const [showNewProject, setShowNewProject] = useState(false);
  const navigate = useNavigate(); // Instanciar o hook useNavigate

  const handleProjectCreated = (projectId) => {
    // Redirecionar para a página de detalhes do projeto após criação
    navigate(`/project/${projectId}`);
  };

  return (
    <div>
      <div className="m-5 flex justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="mt-2 text-md text-zinc-400">
            Analise o andamento das despesas dos seus projetos e permita que os
            seus clientes vejam em tempo real
          </p>
        </div>
        <Button onClick={() => setShowNewProject(true)} className="p-6 px-10">
          Criar Projeto
        </Button>
      </div>
      <Separator />
      <NewProject
        open={showNewProject}
        setOpen={setShowNewProject}
        onProjectCreated={handleProjectCreated}
      />
      <ProjectList />
    </div>
  );
}
