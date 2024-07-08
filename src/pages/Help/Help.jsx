import { BugIcon } from "lucide-react";
import React from "react";
import Bug from "@/assets/Bug.gif";
import { Button } from "@/shadcn/components/ui/button";

export default function Help() {
  return (
    <div className="p-8">
      <h1 className="text-xl font-medium flex items-center">
        <BugIcon className="mr-2 w-8 h-8" />
        Ajuda
      </h1>
      <p className="text-lg mt-4">
        Caso esteja enfrentando algum problema, bug ou estiver alguma dúvida.
        Pode me chamar clicando no botão abaixo.
      </p>
      <div className="flex flex-col items-center justify-center ">
        <div>
          <img src={Bug} alt="Bug" />
        </div>
        <a href="https://wa.me/5537999286153">
          <Button className="w-64 h-16 text-2xl">Chamar suporte</Button>
        </a>
      </div>
    </div>
  );
}
