import { Button } from "@/shadcn/components/ui/button";
import { Separator } from "@/shadcn/components/ui/separator";
import React from "react";

export default function Settings() {
  return (
    <div>
      <div className="flex m-5 justify-between">
        <h1 className="text-3xl font-bold">Configurações</h1>
        <Button>Novo membro</Button>
      </div>
      <Separator />
    </div>
  );
}
