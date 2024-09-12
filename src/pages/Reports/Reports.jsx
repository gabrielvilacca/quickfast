import React from "react";
import Settings from "@/assets/Settings.gif";
import { Button } from "@/shadcn/components/ui/button";
import { Separator } from "@/shadcn/components/ui/separator";

export default function Reports() {
  return (
    <div>
      {/* Caso você queira mostrar a seção de "Em breve", pode descomentar essa parte */}

      <div className="flex flex-col items-center mb-10 mt-20">
        <h1 className="font-bold text-3xl mb-4">Em breve...</h1>
        <img src={Settings} alt="Settings" />
      </div>

      {/* <div className="m-5 flex justify-between">
        <h1 className="text-3xl font-bold">Relatórios</h1>
        <Button className="p-6 px-10">Automatizar relatório</Button>
      </div>
      <Separator /> */}
    </div>
  );
}
