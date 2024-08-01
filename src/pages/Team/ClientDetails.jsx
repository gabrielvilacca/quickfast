import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import html2canvas from "html2canvas";
import { Button } from "@/shadcn/components/ui/button";
import { Separator } from "@/shadcn/components/ui/separator";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shadcn/components/ui/tabs";
import { useAuthContext } from "@/hooks/useAuthContext";
import useClients from "@/hooks/useClients";

const ClientDetails = () => {
  const { id } = useParams(); // Obter o ID da URL
  const clients = useClients(); // Obter todos os clientes
  const { user } = useAuthContext(); // Obter informações de autenticação
  const [client, setClient] = useState(null);
  const captureRef = useRef(null);

  useEffect(() => {
    // Encontrar o cliente pelo ID
    const foundClient = clients.find((client) => client.id === id);
    setClient(foundClient);
  }, [clients, id]);

  const handleShare = async () => {
    if (captureRef.current) {
      const canvas = await html2canvas(captureRef.current, {
        backgroundColor: "#fff",
        useCORS: true,
        scale: window.devicePixelRatio,
        logging: true,
        letterRendering: 1,
        allowTaint: false,
      });

      const imgData = canvas.toDataURL("image/png");

      const link = document.createElement("a");
      link.href = imgData;
      link.download = `client-${id}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      if (navigator.share) {
        const blob = await (await fetch(imgData)).blob();
        const filesArray = [
          new File([blob], `client-${id}.png`, { type: "image/png" }),
        ];
        navigator
          .share({
            title: `Client ${id}`,
            text: "Confira os detalhes do cliente",
            files: filesArray,
          })
          .catch((error) => console.error("Error sharing", error));
      } else {
        console.log("Web Share API não suportada no navegador.");
      }
    }
  };

  if (!client) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="flex m-5 justify-between">
        <h1 className="text-3xl font-bold">Detalhes do Cliente</h1>
      </div>
      <Separator />
      <div
        ref={captureRef}
        className="m-5 flex md:flex-row flex-col justify-between bg-white"
      >
        <div>
          <Tabs defaultValue="overview" className="w-[400px]">
            <TabsList>
              <TabsTrigger value="overview">Visão Geral</TabsTrigger>
              <TabsTrigger value="details">Detalhes</TabsTrigger>
            </TabsList>
            <TabsContent value="overview">
              <div className="p-4">
                <h2 className="text-2xl font-bold">Nome: {client.name}</h2>
                <p className="text-xl">Email: {client.email}</p>
              </div>
            </TabsContent>
            <TabsContent value="details">
              <div className="p-4">
                <h2 className="text-2xl font-bold">Outros Detalhes</h2>
                {/* Adicione outros detalhes do cliente aqui */}
              </div>
            </TabsContent>
          </Tabs>
        </div>
        <div className="flex gap-5 mt-5 md:mt-0">
          <Button onClick={handleShare} className="w-[1000px] md:w-28">
            Compartilhar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ClientDetails;
