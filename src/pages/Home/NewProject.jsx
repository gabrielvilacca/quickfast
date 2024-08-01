// components/NewProject.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shadcn/components/ui/dialog";
import { Label } from "@/shadcn/components/ui/label";
import { Input } from "@/shadcn/components/ui/input";
import { Button } from "@/shadcn/components/ui/button";
import { useFirestore } from "@/hooks/useFirestore";
import { toast, useToast } from "@/shadcn/components/ui/use-toast";
import Select from "react-select";
import useClients from "@/hooks/useClients"; // Correto para importação padrão

export default function NewProject({
  children,
  open,
  setOpen,
  onProjectCreated,
}) {
  const { addDocument: addProject } = useFirestore("projects");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedClient, setSelectedClient] = useState(null);
  const { toast } = useToast();
  const clients = useClients(); // Usando o hook
  const navigate = useNavigate();

  const clientOptions = clients.map((client) => ({
    value: client.id,
    label: client.name,
  }));

  const createProject = async (e) => {
    e.preventDefault();
    if (!title || !description || !selectedClient) return;

    try {
      const result = await addProject({
        title,
        description,
        clientId: selectedClient.value,
        deleted: false,
      });

      if (result.type === "SUCCESS") {
        toast({
          title: "Novo Projeto",
          description: `O projeto ${title} foi adicionado com sucesso!`,
        });

        setTitle("");
        setDescription("");
        setSelectedClient(null);
        setOpen(false);

        onProjectCreated(result.payload);
        navigate("/some-path");
      }
    } catch (error) {
      console.error("Erro ao criar o projeto:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao adicionar o projeto. Tente novamente.",
        status: "error",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[800px] overflow-y-auto max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Adicionando Projeto</DialogTitle>
          <DialogDescription>
            Preencha as informações do seu projeto.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={createProject}>
          <div className="grid gap-4 py-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="title">Título do projeto</Label>
              <Input
                id="title"
                className="col-span-3"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="description">Descrição do projeto</Label>
              <Input
                id="description"
                className="col-span-3"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="client">Cliente</Label>
              <Select
                id="client"
                options={clientOptions}
                onChange={(selected) => setSelectedClient(selected)}
                value={selectedClient}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancelar
            </Button>
            <Button type="submit">Salvar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
