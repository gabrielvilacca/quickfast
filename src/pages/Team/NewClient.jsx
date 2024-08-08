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
import { Eye, EyeOff } from "lucide-react";

export default function NewClient({
  children,
  open,
  setOpen,
  onClientCreated,
}) {
  const { addDocument: addClient } = useFirestore("clients");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const createClient = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) return;

    try {
      // Adicionar cliente ao Firestore com as informações fornecidas
      const result = await addClient({
        name,
        email,
        password, // Note que aqui estamos salvando a senha no Firestore. Certifique-se de que isso está de acordo com as práticas de segurança.
        deleted: false,
      });

      if (result.type === "SUCCESS") {
        toast({
          title: "Novo Cliente",
          description: `O cliente ${name} foi adicionado com sucesso!`,
        });

        setName("");
        setEmail("");
        setPassword("");
        setOpen(false);

        onClientCreated(result.payload);
        navigate(`/client/${result.payload.id}`); // Navegação correta
      }
    } catch (error) {
      console.error("Erro ao criar o cliente:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao adicionar o cliente. Tente novamente.",
        status: "error",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[800px] overflow-y-auto max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Adicionando Cliente</DialogTitle>
          <DialogDescription>
            Preencha as informações do seu cliente.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={createClient}>
          <div className="grid gap-4 py-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="name">Nome do cliente</Label>
              <Input
                id="name"
                className="col-span-3"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email">Email do cliente</Label>
              <Input
                id="email"
                className="col-span-3"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="password">Senha do cliente</Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="outline"
                  className="absolute inset-y-0 right-0 px-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </Button>
              </div>
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
