import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shadcn/components/ui/dialog";
import { Button } from "@/shadcn/components/ui/button";
import { Input } from "@/shadcn/components/ui/input";
import { Label } from "@/shadcn/components/ui/label";
import { Textarea } from "@/shadcn/components/ui/textarea";
import { useFirestore } from "@/hooks/useFirestore";
import { useToast } from "@/shadcn/components/ui/use-toast";
import Select from "react-select";
import { PlusCircledIcon } from "@radix-ui/react-icons";
import { useDocument } from "@/hooks/useDocument";
import { arrayUnion } from "firebase/firestore";
import { useCollection } from "@/hooks/useCollection";

const priorityOptions = [
  { value: "disponivel", label: "Disponível" },
  { value: "indisponivel", label: "Indisponível" },
];

export default function NewExpense({ children, open, setOpen, projectId }) {
  const { addSubDocument } = useFirestore("projects");
  const { toast } = useToast();
  const { toast: showToast } = useToast();
  const [priority, setPriority] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [newTag, setNewTag] = useState("");
  const [showNewTagForm, setShowNewTagForm] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);
  const { documents: users } = useCollection("users", [
    "teamId",
    "==",
    projectId, // Usando o projectId passado como prop
  ]);
  const { document: projectDoc } = useDocument("projects", projectId);
  const { updateDocument: updateProject } = useFirestore("projects");
  const [assignedMembers, setAssignedMembers] = useState([]);

  // Certifique-se de que `users` é um array antes de usar map
  const userOptions =
    users?.map((user) => ({
      value: user.id,
      label: user.name,
    })) || [];

  // Certifique-se de que `projectDoc` e `projectDoc.tags` são definidos antes de usar map
  const tagOptions =
    projectDoc?.tags?.map((tag) => ({
      value: tag,
      label: tag,
    })) || [];

  const addNewTag = async (e) => {
    e.preventDefault();
    if (!newTag) return;
    await updateProject(projectId, {
      tags: arrayUnion(newTag),
    });
    toast({
      title: "Nova tag",
      description: `A tag ${newTag} foi adicionada com sucesso`,
    });
    setNewTag("");
    setShowNewTagForm(false);
  };

  const createExpense = async (e) => {
    e.preventDefault();
    if (
      !title ||
      !description ||
      !price ||
      !priority ||
      selectedTags.length < 1
    )
      return;

    try {
      const newExpense = await addSubDocument(projectId, "expenses", {
        title,
        description,
        priority,
        price: parseFloat(price),
        tags: selectedTags.map((tag) => tag.value),
        deleted: false,
      });

      showToast({
        title: "Nova despesa",
        description: `A despesa ${title} foi criada com sucesso!`,
      });

      setTitle("");
      setDescription("");
      setPrice("");
      setPriority("");
      setSelectedTags([]);
      setOpen(false);
    } catch (error) {
      console.log("Erro ao criar despesa:", error);
      showToast({
        title: "Erro",
        description: "Ocorreu um erro ao criar a despesa. Tente novamente.",
        status: "error",
      });
    }
  };

  if (!projectId) {
    return null; // ou algum tipo de loading ou mensagem de erro
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nova Despesa</DialogTitle>
          <DialogDescription>
            Adicione uma nova despesa ao projeto.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4 max-h-[500px] overflow-y-auto">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="h-32 resize-none"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="price">Preço</Label>
            <Input
              id="price"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="priority">Prioridade</Label>
            <Select
              id="priority"
              options={priorityOptions}
              onChange={(selected) => setPriority(selected?.value)}
              value={priorityOptions.find(
                (option) => option.value === priority
              )}
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex gap-2">
              <Label htmlFor="name">Tags</Label>
              <PlusCircledIcon
                className="h-4 w-4 shrink-0"
                role="button"
                onClick={() => setShowNewTagForm(true)}
              />
              {showNewTagForm && (
                <form onSubmit={addNewTag}>
                  {" "}
                  <Input
                    value={newTag}
                    className="h-6"
                    placeholder="Nova tag.."
                    onChange={(e) => setNewTag(e.target.value)}
                  />
                </form>
              )}
            </div>
            <Select
              isMulti
              options={tagOptions}
              onChange={(options) => setSelectedTags(options)}
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
          <Button type="submit" onClick={createExpense}>
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
