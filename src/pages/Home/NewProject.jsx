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
import { Textarea } from "@/shadcn/components/ui/textarea";
import { Button } from "@/shadcn/components/ui/button";
import ProjectPic from "@/components/ProjectPic";
import { useFirestore } from "@/hooks/useFirestore";
import { useToast } from "@/shadcn/components/ui/use-toast";
import { NumericFormat } from "react-number-format";
import Select from "react-select";
import useClients from "@/hooks/useClients";
import ExportSheets from "@/components/ExportSheets";

export default function NewProject({
  children,
  open,
  setOpen,
  onProjectCreated,
}) {
  const { addDocument: addProject } = useFirestore("projects");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [value, setValue] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [selectedClient, setSelectedClient] = useState(null);
  const [showExportSheets, setShowExportSheets] = useState(false); // Adicionando estado para abrir o diálogo
  const { toast } = useToast();
  const clients = useClients();
  const navigate = useNavigate();

  const clientOptions = clients.map((client) => ({
    value: client.id,
    label: client.name,
  }));

  const createProject = async (e) => {
    e.preventDefault();
    if (!title || !description || !value || !imageUrl || !selectedClient) {
      toast({
        title: "Erro",
        description: "Todos os campos são obrigatórios.",
        status: "error",
      });
      return;
    }

    try {
      const result = await addProject({
        title,
        description,
        value,
        imageUrl,
        clientId: selectedClient.value,
        deleted: false,
      });

      if (result.type === "SUCCESS") {
        toast({
          title: "Novo Projeto",
          description: `O projeto ${title} foi adicionado com sucesso!`,
        });

        // Limpar o formulário após o sucesso
        setTitle("");
        setDescription("");
        setValue("");
        setImageUrl("");
        setSelectedClient(null);
        setOpen(false);

        // Notificar a criação do projeto e navegar para a página correspondente
        onProjectCreated(result.payload); // Considerando que result.payload contém o ID do projeto
        navigate(`/projetos/${result.payload}`); // Navegação para a rota do projeto recém-criado
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
        <div className="flex justify-between">
          <DialogHeader>
            <DialogTitle>Adicionando Projeto</DialogTitle>
            <DialogDescription>
              Preencha as informações do seu projeto.
            </DialogDescription>
          </DialogHeader>
          <Button onClick={() => setShowExportSheets(true)}>
            Exportar Planilhas
          </Button>
          <ExportSheets open={showExportSheets} setOpen={setShowExportSheets} />
        </div>
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
              <Textarea
                id="description"
                className="col-span-3 h-32 resize-none"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="value">Valor</Label>
              <NumericFormat
                id="value"
                prefix="R$ "
                thousandSeparator="."
                decimalSeparator=","
                decimalScale={2}
                allowNegative={false}
                value={value}
                onValueChange={({ value }) => setValue(value)}
                customInput={Input}
                className="col-span-3"
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
                className="col-span-3"
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Foto do projeto</Label>
              <ProjectPic onImageUpload={setImageUrl}>
                <Button type="button">Selecionar foto</Button>
              </ProjectPic>
              {imageUrl && (
                <img
                  src={imageUrl}
                  alt="Project"
                  className="mt-2 h-32 w-32 object-cover rounded-lg"
                />
              )}
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
