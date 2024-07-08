import React, { useState } from "react";
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
import { toast, useToast } from "@/shadcn/components/ui/use-toast";
import { NumericFormat } from "react-number-format";

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
  const { toast } = useToast();

  const createProject = async (e) => {
    e.preventDefault();
    if (!title || !description || !value || !imageUrl) return;

    try {
      const result = await addProject({
        title,
        description,
        value,
        imageUrl,
        deleted: false,
      });

      if (result.type === "SUCCESS") {
        toast({
          title: "Novo projeto",
          description: `O projeto ${title} foi criado com sucesso!`,
        });

        setTitle("");
        setDescription("");
        setValue("");
        setImageUrl("");
        setOpen(false);

        onProjectCreated(result.payload); // Notificar o ID do projeto recém-criado
      }
    } catch (error) {
      console.error("Erro ao criar projeto:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao criar o projeto. Tente novamente.",
        status: "error",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[800px] overflow-y-auto max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Criando projeto</DialogTitle>
          <DialogDescription>
            Preencha as informações do novo projeto.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={createProject}>
          <div className="grid gap-4 py-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="name">Nome do projeto</Label>
              <Input
                id="name"
                className="col-span-3"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="col-span-3 h-32 resize-none"
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
                required
                customInput={Input}
                value={value}
                onValueChange={({ value }) => setValue(value)}
                className="col-span-3"
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
